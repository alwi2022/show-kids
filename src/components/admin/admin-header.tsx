import Link from "next/link";
import { Wordmark } from "@/components/public/header";
import { LogoutButton } from "./logout-button";
export function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="container">
        <Link href="/admin" aria-label="SHOW Kids CMS">
          <Wordmark />
        </Link>
        <span className="cms-label">Content management</span>
        <div className="admin-header-actions">
          <Link href="/" className="back-link">
            Lihat website
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
