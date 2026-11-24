import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import "./admin.css";
import { getAdmin } from "@/server/services/auth-service";
export const metadata: Metadata = {
  title: "SHOW Kids CMS",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdmin().catch(() => null);
  return <AdminShell email={admin?.user.email}>{children}</AdminShell>;
}
