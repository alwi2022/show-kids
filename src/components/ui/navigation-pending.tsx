"use client";
import { useLinkStatus } from "next/link";
export function NavigationPending({ floating = false }: { floating?: boolean }) {
  const { pending } = useLinkStatus();
  return pending ? (
    <span
      className={
        floating ? "navigation-pending navigation-feedback" : "navigation-pending"
      }
      role="status"
    >
      Memuat konten...
    </span>
  ) : null;
}
