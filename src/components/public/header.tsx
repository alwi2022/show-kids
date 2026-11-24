"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
export function Wordmark() {
  return (
    <span className="wordmark">
      SHOW<span>kids</span>
      <i aria-hidden="true">.</i>
    </span>
  );
}
const links = [
  { label: "Video", href: "/?type=Video#catalog" },
  { label: "Worksheet", href: "/?type=Worksheet#catalog" },
  { label: "Tips for Parents", href: "/?type=Artikel#catalog" },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" aria-label="SHOW Kids beranda" className="brand-link">
          <Wordmark />
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href="/#search"
            className="icon-button"
            aria-label="Cari konten"
          >
            <Icon name="search" />
          </Link>
          <Link href="/admin" className="admin-link">
            <Icon name="admin" />
            <span>Admin</span>
          </Link>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
            Menu
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Navigasi mobile"
            initial={reduced ? false : { height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.15 }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
                toggle.current?.focus();
              }
            }}
          >
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
