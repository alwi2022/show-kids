import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container status-page">
      <p className="section-label">404</p>
      <h1>Halaman belum ditemukan</h1>
      <p>Konten mungkin belum diterbitkan atau alamatnya sudah berubah.</p>
      <Link href="/" className="button green">
        Kembali ke beranda
      </Link>
    </main>
  );
}
