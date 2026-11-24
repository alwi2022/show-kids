"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container status-page">
      <h1>Halaman belum dapat dimuat</h1>
      <p>Coba kembali beberapa saat lagi.</p>
      <div className="button-row">
        <button className="button green" onClick={reset}>
          Coba kembali
        </button>
        <Link href="/" className="button outline">
          Ke beranda
        </Link>
      </div>
    </main>
  );
}
