# SHOW Kids

Live demo: [show-kids.vercel.app](https://show-kids.vercel.app) ? [CMS](https://show-kids.vercel.app/admin)

Aplikasi fullstack untuk katalog edukasi anak dan parenting. Frontend publik menggunakan SSR Next.js, CMS tersedia di `/admin`, dan data disimpan di Supabase PostgreSQL, Auth, serta Storage.

## Stack

- Next.js 16, React 19, TypeScript, dan Node.js 22.15+.
- Supabase PostgreSQL, Auth, dan private Storage.
- Framer Motion untuk animasi dengan dukungan reduced motion.
- Tiptap untuk editor artikel, Zod untuk validasi, dan sanitize-html untuk sanitasi HTML.

## Arsitektur tiga layer

| Layer | Lokasi | Tanggung jawab |
| --- | --- | --- |
| Presentation | `src/app/(public)`, `src/components/public` | Katalog dan detail SSR, navigasi, pencarian, serta tampilan media |
| Management | `src/app/admin`, `src/components/admin` | Login, CRUD konten/kategori, upload, editor, preview, dan pengaturan SEO |
| Backend & Data | `src/app/api/admin`, `src/server` | Controller → Service → Repository → Supabase |

Controller menangani request, pemeriksaan origin, dan respons HTTP. Service menangani aturan aplikasi serta otorisasi. Repository menangani akses database atau sumber data. Server Components membaca service langsung tanpa memanggil HTTP API aplikasi sendiri. Route media publik juga memanggil service untuk memeriksa akses sebelum mengirim file atau redirect.

Ketiga layer berada dalam satu aplikasi Next.js; tidak membutuhkan server backend terpisah. `src/proxy.ts` menyegarkan session admin, sementara halaman dan service memeriksa identitas serta keanggotaan admin. RLS PostgreSQL dan Storage membatasi akses langsung melalui Supabase.

## Instalasi

Jalankan dari root repository dengan Node.js 22.15+ dan npm:

```powershell
npm ci
Copy-Item .env.example .env.local
```

Isi `.env.local` sebelum menjalankan aplikasi. Jika file tersebut sudah tersedia, pertahankan konfigurasi yang ada.

| Variabel | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Origin aplikasi: `http://localhost:3000` untuk lokal atau origin HTTPS deployment |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key Supabase |

Aplikasi tidak membutuhkan service-role key. Jangan memasukkan secret key ke variabel `NEXT_PUBLIC_*`. File environment tidak masuk Git. Restart server setelah konfigurasi berubah.

### Database dan Storage

Buat project Supabase, lalu jalankan migration berikut secara berurutan melalui SQL Editor pada database baru:

1. `supabase/migrations/202611230001_content_and_admin.sql`
2. `supabase/migrations/202611230002_storage.sql`
3. `supabase/migrations/202611230003_categories.sql`
4. `supabase/migrations/202611230004_article_images.sql`

Pada project yang sudah dimigrasikan, jalankan hanya migration yang belum diterapkan. Alternatif dengan Supabase CLI:

```powershell
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Migration membuat tabel, constraint, RLS, bucket privat, kategori awal, dan kebijakan akses gambar artikel.

### Akun admin demo

Kredensial default untuk lingkungan assessment:

```text
Email: admin@showkids.local
Password: ShowKids!2026
```

Akun harus diprovisi pada setiap project Supabase baru; aplikasi tidak membuatnya otomatis:

1. Buat pengguna tersebut di Authentication → Users dengan email confirmed.
2. Jalankan `supabase/provision-demo-admin.sql` untuk mendaftarkannya di `public.admin_users`.
3. Buka `/admin` dan login.

Alur login dan CMS pada lingkungan lokal telah dikonfirmasi melalui pengujian manual pengguna. Kredensial demo hanya untuk assessment; gunakan kredensial berbeda untuk produksi. Password di-hash dan session ditangani Supabase Auth.

### Data contoh

Setelah migration, jalankan SQL berikut sesuai kebutuhan:

1. `supabase/seed.sql`: 12 video SHOW Kids.
2. `supabase/seed-library-demo.sql`: tiga worksheet dan tiga artikel.
3. `supabase/enrich-demo-descriptions.sql`: deskripsi contoh yang lebih panjang.

Seed tidak menimpa slug yang sudah ada. Enrichment hanya memperbarui deskripsi yang masih sesuai versi seed, sehingga edit admin dipertahankan. Jumlah konten aktual bergantung pada seed dan perubahan CMS.

### Menjalankan

```powershell
npm run dev
```

Buka `http://localhost:3000`. Untuk menjalankan build produksi lokal:

```powershell
npm run build
npm start
```

## Fitur publik

| Route | Isi |
| --- | --- |
| `/` | Hero, kategori pilihan, Popular Series, dan quick access |
| `/video` | Katalog video |
| `/worksheet` | Katalog worksheet |
| `/parents` | Katalog artikel parenting |
| `/content/[slug]` | Detail konten dan konten terkait |

- Tombol **Cari** di header membuka form pencarian judul/kategori. Input mendapat fokus; Escape, klik di luar, atau keluar dari kontrol dengan keyboard menutup panel. Mobile menggunakan ikon search.
- Pencarian juga tersedia di katalog. Form memakai navigasi GET dengan parameter URL; submit memuat halaman hasil, bukan live search saat mengetik.
- Filter kategori, filter tipe pada beranda, dan pagination mempertahankan parameter pencarian. Daftar utama memakai 12 item per halaman dan mengoreksi halaman di luar rentang.
- Popular Series mengambil konten Published dari database dengan urutan kurasi awal. Badge New dan durasi berasal dari data konten.
- Detail video menyediakan embed tanpa autoplay, judul, deskripsi yang dapat diperluas, dan konten terkait. CTA Putar lagu di beranda membuka player di halaman tersebut.
- Worksheet menyediakan **Unduh PDF** langsung dan **Buka PDF** di tab baru, ditempatkan di bawah gambar.
- Artikel menampilkan format rich text dan daftar isi otomatis dari H2/H3. Tanpa heading H2/H3, daftar isi tidak ditampilkan.
- Draft dan slug yang tidak ditemukan menghasilkan 404 pada detail publik.

## CMS dan SEO Manager

CMS memakai sidebar Konten/Kategori, tabel dengan thumbnail, pagination, dan menu akun untuk logout. Editor berada di `/admin/content/new` dan `/admin/content/[id]/edit`, dengan preview tampilan konten serta preview SEO.

- CRUD Video, Worksheet, Artikel, dan kategori.
- Judul, kategori, deskripsi, media, durasi video, status New, dan Published.
- Upload thumbnail/PDF atau input URL. Video mendukung URL YouTube/Vimeo yang tervalidasi.
- Slug otomatis dari judul, dapat diedit, dan memiliki constraint unik di database.
- Meta title maksimal 60 karakter dan meta description maksimal 160 karakter, dengan indikator jumlah karakter.
- Alt text thumbnail wajib; canonical URL dan focus keyword tersedia.
- Rename kategori memperbarui referensi konten secara cascade. Kategori yang masih dipakai tidak dapat dihapus.

Editor Tiptap menyediakan H2/H3, bold, italic, bullet/numbered list, undo/redo, link, serta gambar lewat URL atau upload dengan alt text wajib. Toolbar tidak menyediakan quote/coret. HTML artikel disanitasi di server dan disimpan pada `description`, maksimal 20.000 karakter HTML. Artikel plain text lama tetap didukung. Deskripsi Video/Worksheet tetap plain text; perpindahan dari Artikel mengonversi format menjadi teks.

## Technical SEO

- Title, meta description, Open Graph, dan canonical dirender di server.
- Setiap halaman publik menggunakan satu H1; artikel mendukung hierarki H2/H3.
- JSON-LD VideoObject atau Article tersedia di `<head>` detail. Schema diselaraskan saat navigasi client dan di-escape untuk mencegah injeksi script.
- `/sitemap.xml` memuat route publik dan detail Published dari database.
- `/robots.txt` melarang `/admin` serta `/api/admin`; proteksi akses tetap memakai autentikasi.
- Query publik menggunakan strategi dinamis/no-store agar perubahan publikasi tidak menunggu ISR.
- Perubahan slug belum memiliki redirect history; URL lama menghasilkan 404.

## Media dan keamanan

- Bucket `thumbnails` dan `worksheets` bersifat privat. Record menyimpan referensi `storage:bucket/uuid.ext` atau URL eksternal yang diizinkan.
- `/media/[id]/thumbnail` dan `/media/[id]/worksheet` memeriksa Published sebelum mengarahkan ke media. Signed URL Storage berlaku 60 detik.
- `/media/[id]/download` mengirim PDF sebagai attachment setelah memeriksa status Published dan tipe Worksheet. Sumber dapat berupa Storage, PDF demo lokal yang diizinkan, atau URL HTTPS eksternal.
- Pengambilan PDF eksternal membatasi ukuran 2 MB, waktu request 10 detik per hop, redirect, protokol/port, dan alamat jaringan privat. Alamat IPv4 hasil DNS dipakai langsung untuk koneksi agar tidak terjadi DNS rebinding antara pemeriksaan dan request.
- `/article-images/[name]` dan RLS mengendalikan akses gambar upload berdasarkan artikel Published yang mereferensikannya.
- Upload gambar mendukung PNG/JPG/WebP dan PDF dengan pemeriksaan signature file, maksimal 2 MB per file. Form dibatasi 4 MiB + 128 KiB.
- Mutasi memeriksa origin, session, role admin, serta input di server. HTML artikel disanitasi dengan allowlist.
- Upload baru yang gagal disimpan melalui form konten dibersihkan. File lama yang diganti/dihapus dan gambar artikel yang batal dipakai belum memiliki garbage collector otomatis.

Signed URL yang sudah diterbitkan dapat tetap berlaku hingga 60 detik setelah unpublish. URL media eksternal dan aset demo statis tetap berada di luar kontrol publikasi Storage; unpublish tidak menghapus file sumber tersebut. Pembatasan percobaan login menggunakan Supabase Auth, tanpa rate limiter terdistribusi tambahan pada aplikasi.

## Skema database

```text
auth.users
  id uuid PK
    └── admin_users.user_id uuid PK/FK → auth.users.id

categories
  id uuid PK
  name UNIQUE (juga unik tanpa membedakan huruf besar/kecil)
  created_at

contents
  id uuid PK
  title, slug UNIQUE
  category FK → categories.name (UPDATE CASCADE, DELETE RESTRICT)
  type (Video / Worksheet / Artikel), description
  thumbnail, alt_text, media_url, duration
  is_new, published
  meta_title (1..60), meta_description (1..160)
  canonical_url, focus_keyword
  created_at, updated_at
```

Keanggotaan `admin_users` diberikan melalui SQL tepercaya, bukan registrasi frontend. RLS membatasi mutasi konten/kategori pada admin dan pembacaan konten publik pada status Published.

## Pengujian

```powershell
npm run typecheck
npm test
npm run test:db
npm run test:http
```

| Perintah | Cakupan |
| --- | --- |
| `typecheck` | Pemeriksaan TypeScript |
| `test` | Validasi, slug/filter, embed, sanitasi artikel, JSON-LD, kontras, respons API, dan pembatasan URL PDF |
| `test:db` | Migration, constraint dan RLS melalui PostgreSQL PGlite dengan stub Auth/Storage |
| `test:http` | Build produksi terisolasi di `.next-http`, SSR/SEO, sitemap/robots, proteksi akses, unduh PDF, dan render CMS dengan fixture pada port 3101 |

Tes fixture tidak menggantikan Supabase Auth/Storage nyata atau pemeriksaan browser. Jangan menjalankan build/test HTTP secara bersamaan karena Next.js dapat memperbarui file tipe/konfigurasi saat build.

Status verifikasi lokal per 24 November 2026:

- Pemeriksaan akhir 24 November 2026: typecheck, 21 tes unit, tes database/RLS, build produksi terisolasi, dan tes HTTP lulus.
- Pengguna mengonfirmasi tes manual login/logout, CRUD tiga tipe, kategori, upload, validasi, editor artikel/link/gambar/TOC, publish/unpublish, serta checklist keamanan lulus.
- Pengguna mengonfirmasi search header (buka/tutup, Escape, fokus, submit, mobile), responsive/zoom, keyboard, loading/retry, simpan gagal, dan SEO setelah edit/navigasi antar-detail telah diperiksa dan sesuai.
- Playback/audio/fullscreen pada perangkat nyata dan hasil cetak PDF juga telah dikonfirmasi pengguna.

## Deployment dan pengumpulan

1. Push perubahan repository ke [GitHub](https://github.com/alwi2022/show-kids). Remote `origin` sudah terkonfigurasi.
2. Hubungkan repository ke Vercel sebagai aplikasi Next.js.
3. Siapkan empat migration dan akun admin pada project Supabase tujuan bila memakai project baru.
4. Isi tiga environment aplikasi, set `NEXT_PUBLIC_SITE_URL` ke origin HTTPS final, dan cocokkan Auth Site URL Supabase.
5. Deploy ulang setelah environment berubah. Untuk preview domain, gunakan konfigurasi origin yang sesuai agar mutasi tidak ditolak.
6. Smoke test login, CRUD/upload, publish/unpublish, download PDF, metadata, sitemap, dan logout pada deployment.

Deployment produksi Vercel tersedia di https://show-kids.vercel.app. Environment produksi menggunakan origin tersebut serta URL/publishable key Supabase; konfigurasi lokal tetap terpisah. Smoke test HTTP produksi pada 24 November 2026 lulus untuk halaman publik, tiga tipe detail SSR/SEO, sitemap/robots, unduh PDF attachment, proteksi admin/API anonim, login admin, render CMS terautentikasi, dan logout. Pemeriksaan ini tidak mengubah konten dan tidak menggantikan tes browser atau CRUD/upload pada deployment. Assessment sangat merekomendasikan live demo dan meminta tautan repository dengan riwayat commit bertahap, README, serta live code review/modification 45 menit.

## Aset dan dokumentasi

- [Sumber aset dan lisensi](public/assets/SOURCES.md): logo/thumbnail SHOW untuk testing, foto pendukung, dan lisensi font.

PDF worksheet demo adalah materi contoh, bukan worksheet resmi SHOW. Deskripsi contoh bukan transkrip video resmi. Migration, seed, test, dan sumber/lisensi aset disertakan dalam repository.
