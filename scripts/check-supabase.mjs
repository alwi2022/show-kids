import { createClient } from '@supabase/supabase-js';

process.loadEnvFile('.env.local');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error('Isi URL dan publishable key di .env.local.');
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
let failed = false;
function report(label, success, detail = '') {
  console.log(`${success ? 'PASS' : 'PENDING'} ${label}${detail ? `: ${detail}` : ''}`);
  if (!success) failed = true;
}
try {
  const { data, error, count } = await client.from('contents').select('id,slug,type,thumbnail,media_url', { count: 'exact' }).limit(12);
  report('Tabel konten dan akses publik', !error, error ? error.code : `${count ?? 0} konten Published`);
  const role = await client.rpc('is_admin');
  report('Anon tidak memiliki role admin', !role.error && role.data === false, role.error?.code || '');
  const membership = await client.from('admin_users').select('user_id');
  report('Membership admin tidak terbuka untuk anon', Boolean(membership.error) || membership.data?.length === 0);
  report('Data testing sudah tersedia', !error && (count || 0) > 0, !error && !count ? 'Jalankan supabase/seed.sql di SQL Editor.' : '');
  if (data?.length) {
    const videos = data.filter(c => c.type === 'Video');
    report('Video mempunyai URL YouTube/Vimeo', videos.every(c => /^https:\/\/(www\.)?(youtube\.com\/watch\?|youtu\.be\/|vimeo\.com\/)/.test(c.media_url)), `${videos.length} video pada halaman pertama`);
  }
  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const login = await client.auth.signInWithPassword({ email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD });
    report('Login admin terkonfigurasi', !login.error, login.error?.code || '');
    if (!login.error) {
      const admin = await client.rpc('is_admin');
      report('Role admin terkonfigurasi', !admin.error && admin.data === true);
      for (const bucket of ['thumbnails', 'worksheets']) {
        const result = await client.storage.from(bucket).list('', { limit: 1 });
        report(`Akses Storage ${bucket}`, !result.error, result.error ? 'Periksa bucket/policy.' : '');
      }
    }
  } else console.log('SKIP Login dan Storage admin: isi SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD di .env.local untuk memeriksa.');
} finally {
  await client.auth.signOut({ scope: 'local' });
  if (failed) process.exitCode = 1;
}
