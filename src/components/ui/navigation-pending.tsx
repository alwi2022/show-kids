"use client";
import { useLinkStatus } from "next/link";
export function NavigationPending() {
  const { pending } = useLinkStatus();
  return pending ? (
    <span className="navigation-pending" role="status">
      Memuat konten...
    </span>
  ) : null;
}
