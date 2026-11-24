import Link from "next/link";
import { Wordmark } from "./header";
export function Footer() {
  return (
    <footer className="container site-footer">
      <Link href="/" aria-label="SHOW Kids beranda">
        <Wordmark />
      </Link>
      <p>Belajar bersama, tumbuh penuh rasa ingin tahu.</p>
      <nav className="footer-links" aria-label="SHOW Kids di platform lain">
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
    </footer>
  );
}
