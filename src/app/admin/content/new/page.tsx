import { requireAdminPage } from "@/server/services/auth-service";
import Link from "next/link";
import { ContentForm } from "@/components/admin/content-form";
import { categoryNames } from "@/server/services/category-service";
import { siteUrl } from "@/lib/config";
export default async function NewContent() {
  await requireAdminPage();
  const categoryOptions = await categoryNames();
  return (
    <>
      <main id="main" className="container admin-main">
        <div className="admin-page-heading">
          <div>
            <p className="section-label">Content library</p>
            <h1>Tambah konten</h1>
          </div>
          <Link href="/admin" className="back-link">
            Kembali ke daftar
          </Link>
        </div>
        <ContentForm siteOrigin={siteUrl} categoryOptions={categoryOptions} />
      </main>
    </>
  );
}
