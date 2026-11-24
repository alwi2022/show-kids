"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { NavigationPending } from "@/components/ui/navigation-pending";
import { HeaderSearch } from "./header-search";
export function Wordmark() {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <span className="wordmark">
      {logoFailed ? (
        <strong>SHOW</strong>
      ) : (
        <img
          src="/assets/show/show-logo.png"
          alt="SHOW"
          width="146"
          height="40"
          onError={() => setLogoFailed(true)}
        />
      )}
      <span>kids</span>
    </span>
  );
}
const links = [
  { label: "Video", href: "/video" },
  { label: "Worksheet", href: "/worksheet" },
  { label: "Tips for Parents", href: "/parents" },
];
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const changeSearch = useCallback((value: boolean) => {
    setSearchOpen(value);
    if (value) setOpen(false);
  }, []);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => { setOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      toggle.current?.focus();
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" aria-label="SHOW Kids beranda" className="brand-link">
          <Wordmark />
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
              <NavigationPending floating />
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <HeaderSearch open={searchOpen} onOpenChange={changeSearch} />
          <Link href="/admin" className="admin-login-link" aria-label="Login Admin">
            <Icon name="admin" />
            <span>Login Admin</span>
            <NavigationPending floating />
          </Link>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => { setOpen(!open); setSearchOpen(false); }}
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
          >
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => {
                  if (pathname === link.href) setOpen(false);
                }}
              >
                {link.label}
                <NavigationPending floating />
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
