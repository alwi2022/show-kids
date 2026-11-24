import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdminPage } from "@/server/services/auth-service";
import {
  adminContent,
  adminThumbnail,
  adminWorksheet,
} from "@/server/services/content-service";
import { ContentForm } from "@/components/admin/content-form";
import Link from "next/link";
import { categoryNames } from "@/server/services/category-service";
import { siteUrl } from "@/lib/config";
export default async function EditContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const categoryOptions = await categoryNames();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const content = await adminContent(id);
  if (!content) notFound();
  const previewUrl = await adminThumbnail(content);
  const mediaPreviewUrl = await adminWorksheet(content);
  return (
    <>
      <main id="main" className="container admin-main">
        <div className="admin-page-heading">
          <div>
            <p className="section-label">Content library</p>
            <h1>Edit konten</h1>
            <p>{content.title}</p>
          </div>
          <Link className="button outline" href="/admin">
            Kembali ke daftar
          </Link>
        </div>
        <ContentForm
          content={content}
          previewUrl={previewUrl}
          mediaPreviewUrl={mediaPreviewUrl}
          siteOrigin={siteUrl}
          categoryOptions={categoryOptions}
        />
      </main>
    </>
  );
}
