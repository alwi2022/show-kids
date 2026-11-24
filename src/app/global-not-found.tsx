import type { Metadata } from "next";
import NotFound from "./not-found";
import "./globals.css";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan | SHOW Kids",
  robots: { index: false, follow: false },
  icons: { icon: "/assets/show/show-kids-avatar.jpg" },
};

export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body>
        <a href="#main" className="skip-link">Lewati ke konten</a>
        <NotFound />
      </body>
    </html>
  );
}
