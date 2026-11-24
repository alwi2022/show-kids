import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdminPage } from "@/server/services/auth-service";
import { adminContent } from "@/server/services/content-service";
import { AdminHeader } from "@/components/admin/admin-header";
import { ContentForm } from "@/components/admin/content-form";
export default async function EditContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const content = await adminContent(id);
  if (!content) notFound();
  return (
    <>
      <AdminHeader />
      <main id="main" className="container admin-main">
        <div className="admin-page-heading">
          <div>
            <p className="section-label">Content library</p>
            <h1>Edit konten</h1>
          </div>
        </div>
        <ContentForm content={content} />
      </main>
    </>
  );
}
