import Link from "next/link";
import { Wordmark } from "@/components/public/header";
export default function NotFound() {
  return (
    <main id="main" className="not-found-page">
      <div className="container not-found-inner">
        <Link href="/" className="not-found-brand" aria-label="SHOW Kids beranda">
          <Wordmark />
        </Link>
        <div className="not-found-layout">
          <div className="not-found-art" aria-hidden="true">
            <span className="not-found-number">404</span>
            <img src="/assets/show/hero-dragon.png" alt="" width="640" height="640" />
          </div>
          <div className="not-found-copy">
            <p className="section-label">404 · Halaman tidak ditemukan</p>
            <h1>Ups, jalan ini<br />belum ada ceritanya.</h1>
            <p>Halaman yang kamu cari mungkin sudah berpindah atau belum tersedia. Yuk, kembali mencari tontonan dan aktivitas untuk si kecil.</p>
            <div className="not-found-actions">
              <Link href="/" className="button green">Kembali ke beranda</Link>
              <Link href="/video" className="button outline">Lihat video anak</Link>
            </div>
            <p className="not-found-library">Mau mencoba aktivitas lain? <Link href="/worksheet">Pilih worksheet</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}
