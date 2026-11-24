"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/public/header";
import { LogoutButton } from "./logout-button";
import { Icon } from "@/components/ui/icon";
import { useEffect, useRef, useState } from "react";

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navTrigger = useRef<HTMLButtonElement>(null);
  const account = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!account.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  if (pathname === "/admin/login")
    return <div className="cms-login">{children}</div>;
  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <Link className="cms-brand" href="/admin" aria-label="SHOW Kids CMS">
          <Wordmark />
        </Link>
        <button
          ref={navTrigger}
          className="cms-nav-toggle button outline"
          type="button"
          aria-expanded={navOpen}
          aria-controls="cms-navigation"
          onClick={() => setNavOpen(!navOpen)}
        >
          <Icon name={navOpen ? "close" : "menu"} />
          Menu
        </button>
        <nav
          id="cms-navigation"
          className={navOpen ? "is-open" : ""}
          aria-label="Navigasi CMS"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setNavOpen(false);
              navTrigger.current?.focus();
            }
          }}
        >
          <p className="cms-nav-label">Koleksi</p>
          <Link
            className="cms-nav-link"
            href="/admin"
            onClick={() => setNavOpen(false)}
            aria-current={
              !pathname.startsWith("/admin/categories") ? "page" : undefined
            }
          >
            <Icon name="file" />
            Konten
          </Link>
          <Link
            className="cms-nav-link"
            href="/admin/categories"
            onClick={() => setNavOpen(false)}
            aria-current={
              pathname.startsWith("/admin/categories") ? "page" : undefined
            }
          >
            <Icon name="book" />
            Kategori
          </Link>
        </nav>
      </aside>
      <div className="cms-workspace">
        <header className="cms-topbar">
          <div className="cms-topbar-actions">
            <div
              className="cms-account"
              ref={account}
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                )
                  setOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setOpen(false);
                  trigger.current?.focus();
                }
              }}
            >
              <button
                ref={trigger}
                className="cms-account-trigger"
                type="button"
                aria-expanded={open}
                aria-controls="cms-account-panel"
                onClick={() => setOpen(!open)}
              >
                <span className="cms-avatar" aria-hidden="true">
                  <Icon name="admin" />
                </span>
                <span>Akun saya</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {open && (
                <div id="cms-account-panel" className="cms-account-panel">
                  <strong>Administrator</strong>
                  <p>{email || "Akun admin"}</p>
                  <LogoutButton />
                </div>
              )}
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
