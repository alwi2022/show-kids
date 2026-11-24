import { redirect } from "next/navigation";
import { requireAdminPage } from "@/server/services/auth-service";
export default async function RecordRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  redirect(`/admin/content/${encodeURIComponent(id)}/edit`);
}
