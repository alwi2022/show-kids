import { requireAdminPage } from "@/server/services/auth-service";
import { AdminHeader } from "@/components/admin/admin-header";
import { ContentForm } from "@/components/admin/content-form";
export default async function NewContent() {
  await requireAdminPage();
  return (
    <>
      <AdminHeader />
      <main id="main" className="container admin-main">
        <div className="admin-page-heading">
          <div>
            <p className="section-label">Content library</p>
            <h1>Tambah konten</h1>
          </div>
        </div>
        <ContentForm />
      </main>
    </>
  );
}
