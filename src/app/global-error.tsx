"use client";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="id">
      <body>
        <main>
          <h1>Halaman belum dapat dimuat</h1>
          <p>Coba kembali beberapa saat lagi.</p>
          <button onClick={reset}>Coba kembali</button>
          <p>
            <a href="/">Kembali ke beranda</a>
          </p>
        </main>
      </body>
    </html>
  );
}
