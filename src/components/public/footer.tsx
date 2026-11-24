import Link from "next/link";
import { Wordmark } from "./header";
export function Footer() {
  return (
    <footer className="container site-footer">
      <Link href="/" aria-label="SHOW Kids beranda">
        <Wordmark />
      </Link>
      <p>Belajar bersama, tumbuh penuh rasa ingin tahu.</p>
      <a
        href="https://showtoken.io/kids"
        target="_blank"
        rel="noopener noreferrer"
      >
        SHOW Kids
      </a>
    </footer>
  );
}
