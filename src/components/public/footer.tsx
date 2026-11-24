import Link from "next/link";
import { Wordmark } from "./header";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" aria-label="SHOW Kids beranda">
              <Wordmark />
            </Link>
            <p>Belajar bersama, tumbuh penuh rasa ingin tahu.</p>
          </div>
          <nav className="footer-column" aria-label="Jelajahi konten">
            <h2>Jelajahi</h2>
            <Link href="/video">Video</Link>
            <Link href="/worksheet">Worksheet</Link>
            <Link href="/parents">Tips for Parents</Link>
          </nav>
          <nav
            className="footer-column"
            aria-label="SHOW Kids di platform lain"
          >
            <h2>SHOW</h2>
            <a
              href="https://www.youtube.com/@showkidsofficial"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
            <a
              href="https://showtoken.io/kids"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tentang SHOW
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SHOW Kids</span>
        </div>
      </div>
    </footer>
  );
}
