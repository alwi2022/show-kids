"use client";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/icon";

export function HeaderSearch({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const query = new URLSearchParams(window.location.search).get("q");
    if (input.current && query) input.current.value = query.slice(0, 160);
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) onOpenChange(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onOpenChange(false);
      trigger.current?.focus();
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, onOpenChange]);

  return (
    <div className="header-search-control" ref={root} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onOpenChange(false);
    }}>
      <button ref={trigger} type="button" className="header-search-trigger" aria-label="Cari konten" aria-expanded={open} aria-controls="header-search-panel" onClick={() => onOpenChange(!open)}>
        <Icon name="search" /><span>Cari</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div id="header-search-panel" className="header-search-panel" initial={reduced ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <form action="/#catalog" role="search" aria-label="Pencarian seluruh konten">
              <label htmlFor="header-content-search">Cari judul atau kategori</label>
              <div className="header-search-fields">
                <input ref={input} id="header-content-search" name="q" type="search" maxLength={160} placeholder="Contoh: lagu atau hewan" />
                <button type="submit">Cari</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
