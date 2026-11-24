// Global 404s bypass the app layout, so recovery links use document navigation.
export default function NotFound() {
  return (
    <main id="main" className="not-found-page">
      <div className="container not-found-inner">
        <div className="not-found-layout">
          <div className="not-found-art" aria-hidden="true">
            <span className="not-found-number">404</span>
            <img src="/assets/show/hero-dragon.png" alt="" width="640" height="640" />
          </div>
          <div className="not-found-copy">
            <a href="/" className="not-found-brand" aria-label="SHOW Kids beranda">
              <span className="wordmark">
                <img src="/assets/show/show-logo.png" alt="SHOW" width="146" height="40" />
                <span>kids</span>
              </span>
            </a>
            <p className="section-label">404 · Halaman tidak ditemukan</p>
            <h1>Ups, jalan ini<br />belum ada ceritanya.</h1>
            <p>Halaman yang kamu cari mungkin sudah berpindah atau belum tersedia. Yuk, kembali mencari tontonan dan aktivitas untuk si kecil.</p>
            <div className="not-found-actions">
              <a href="/" className="button green">Kembali ke beranda</a>
              <a href="/video" className="button outline">Lihat video anak</a>
            </div>
            <p className="not-found-library">Mau mencoba aktivitas lain? <a href="/worksheet">Pilih worksheet</a></p>
          </div>
        </div>
      </div>
    </main>
  );
}
