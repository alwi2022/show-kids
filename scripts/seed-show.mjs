import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Isi konfigurasi Supabase di .env.local.");
const client = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
try {
  const { data, error } = await client.auth.signInWithPassword({
    email: process.env.SEED_ADMIN_EMAIL || "admin@showkids.local",
    password: process.env.SEED_ADMIN_PASSWORD || "ShowKids!2026",
  });
  if (error || !data.user)
    throw new Error(
      "Login admin untuk seed gagal. Buat akun demo sesuai panduan atau isi SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD secara lokal.",
    );
  const { data: role, error: roleError } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (roleError || !role)
    throw new Error("Akun seed tidak memiliki role admin.");
  const records = JSON.parse(
    await readFile(
      new URL("../supabase/fixtures/show-kids-videos.json", import.meta.url),
      "utf8",
    ),
  );
  const { error: insertError } = await client
    .from("contents")
    .upsert(records, { onConflict: "slug", ignoreDuplicates: true });
  if (insertError)
    throw new Error(
      `Impor gagal (${insertError.code}). Periksa migration dan hak akses admin.`,
    );
  console.log(
    `${records.length} video SHOW Kids diproses. Konten dengan slug yang sudah ada dipertahankan.`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.auth.signOut({ scope: "local" });
}
