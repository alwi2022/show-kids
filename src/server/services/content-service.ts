import "server-only";
import { cache } from "react";
import { randomUUID } from "node:crypto";
import { publicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { ContentRepository } from "@/server/repositories/content-repository";
import { parseContent } from "@/server/validators/content";
import { AppError, requireAdmin } from "@/server/services/auth-service";
import type { Content, Filters } from "@/lib/content";
import type { SupabaseClient } from "@supabase/supabase-js";
import { categoryNames } from "./category-service";
import { featuredSlugs } from "@/lib/featured-content";

export function splitStorageRef(value: string) {
  const match =
    /^storage:(thumbnails|worksheets)\/([a-f0-9-]+\.(?:png|jpg|webp|pdf))$/.exec(
      value,
    );
  return match ? { bucket: match[1], path: match[2] } : null;
}
function resolvedMedia(content: Content) {
  const result = { ...content };
  for (const key of ["thumbnail", "media_url"] as const) {
    const ref = splitStorageRef(result[key]);
    if (!ref) continue;
    result[key] =
      `/media/${content.id}/${key === "thumbnail" ? "thumbnail" : "worksheet"}`;
  }
  return result;
}
export async function publicCatalogue(filters: Filters, featured = false) {
  if (!isSupabaseConfigured())
    return { contents: [] as Content[], count: 0, page: 1 };
  const client = publicClient();
  const repo = new ContentRepository(client);
  const result =
    featured && !filters.q && !filters.category && !filters.type
      ? await repo.featured(featuredSlugs, filters.page)
      : await repo.list(filters);
  return {
    ...result,
    contents: result.contents.map((item) => resolvedMedia(item)),
  };
}
export const publicContent = cache(async (slug: string) => {
  if (!isSupabaseConfigured()) return null;
  const client = publicClient();
  const content = await new ContentRepository(client).bySlug(slug);
  return content ? resolvedMedia(content) : null;
});
export async function publicMedia(id: string, kind: string) {
  if (!isSupabaseConfigured()) return null;
  const client = publicClient();
  const content = await new ContentRepository(client).byId(id);
  if (!content?.published) return null;
  const value =
    kind === "thumbnail"
      ? content.thumbnail
      : content.type === "Worksheet"
        ? content.media_url
        : "";
  if (!value) return null;
  const ref = splitStorageRef(value);
  if (!ref) return value;
  const { data, error } = await client.storage
    .from(ref.bucket)
    .createSignedUrl(ref.path, 60);
  if (error) throw error;
  return data.signedUrl;
}
export async function publicSitemap() {
  return isSupabaseConfigured()
    ? new ContentRepository(publicClient()).sitemap()
    : [];
}
export async function adminCatalogue(filters: Filters) {
  const { client } = await requireAdmin();
  const result = await new ContentRepository(client).list(filters, true);
  const thumbnails = Object.fromEntries(
    await Promise.all(
      result.contents.map(async (content) => [
        content.id,
        await signedAdminMedia(client, content.thumbnail),
      ]),
    ),
  );
  return { ...result, thumbnails };
}
export async function adminContent(id: string) {
  const { client } = await requireAdmin();
  return new ContentRepository(client).byId(id);
}
export async function adminThumbnail(content: Content) {
  const { client } = await requireAdmin();
  return signedAdminMedia(client, content.thumbnail);
}
export async function adminWorksheet(content: Content) {
  const { client } = await requireAdmin();
  return content.type === "Worksheet"
    ? signedAdminMedia(client, content.media_url)
    : null;
}
async function signedAdminMedia(client: SupabaseClient, value: string) {
  const ref = splitStorageRef(value);
  if (!ref) return value;
  const { data, error } = await client.storage
    .from(ref.bucket)
    .createSignedUrl(ref.path, 300);
  if (error) return null;
  return data.signedUrl;
}
function inspectFile(buffer: Buffer, pdf: boolean) {
  if (pdf)
    return buffer.subarray(0, 5).toString() === "%PDF-"
      ? { ext: "pdf", mime: "application/pdf" }
      : null;
  if (
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return { ext: "png", mime: "image/png" };
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255)
    return { ext: "jpg", mime: "image/jpeg" };
  if (
    buffer.subarray(0, 4).toString() === "RIFF" &&
    buffer.subarray(8, 12).toString() === "WEBP"
  )
    return { ext: "webp", mime: "image/webp" };
  return null;
}
export async function saveContent(form: FormData, id?: string) {
  const { client } = await requireAdmin();
  if (!(await categoryNames()).includes(String(form.get("category") || "")))
    throw new AppError("Pilih kategori yang tersedia.", 422, {
      category:
        "Kategori tidak ditemukan. Muat ulang untuk memperbarui pilihan.",
    });
  const repo = new ContentRepository(client);
  const previous = id ? await repo.byId(id) : null;
  if (id && !previous) throw new AppError("Konten tidak ditemukan.", 404);
  const uploaded: { bucket: string; path: string }[] = [];
  try {
    for (const field of ["thumbnail_file", "pdf_file"] as const) {
      const file = form.get(field);
      if (!(file instanceof File) || !file.size) continue;
      if (field === "pdf_file" && form.get("type") !== "Worksheet") continue;
      if (file.size > 2 * 1024 * 1024)
        throw new AppError("Ukuran setiap file maksimal 2 MB.", 422, {
          [field]: "Ukuran file maksimal 2 MB.",
        });
      const buffer = Buffer.from(await file.arrayBuffer());
      const format = inspectFile(buffer, field === "pdf_file");
      if (!format)
        throw new AppError("Format file tidak valid.", 422, {
          [field]:
            field === "pdf_file"
              ? "Pilih file PDF yang valid."
              : "Pilih gambar PNG, JPG, atau WebP yang valid.",
        });
      const bucket = field === "pdf_file" ? "worksheets" : "thumbnails";
      const path = `${randomUUID()}.${format.ext}`;
      const { error } = await client.storage
        .from(bucket)
        .upload(path, buffer, { contentType: format.mime, upsert: false });
      if (error) throw new AppError("Upload gagal. Coba kembali.", 502);
      uploaded.push({ bucket, path });
      form.set(
        field === "pdf_file" ? "media_url" : "thumbnail",
        `storage:${bucket}/${path}`,
      );
    }
    const result = parseContent(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues)
        errors[String(issue.path[0])] ||= issue.message;
      throw new AppError("Periksa kembali isian yang ditandai.", 422, errors);
    }
    if (result.data.type !== "Video") result.data.duration = null;
    if (result.data.type === "Artikel") result.data.media_url = "";
    return await repo.save(result.data, id);
  } catch (error) {
    await Promise.all(
      uploaded.map((ref) => client.storage.from(ref.bucket).remove([ref.path])),
    );
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    )
      throw new AppError("Slug sudah digunakan.", 409, {
        slug: "Slug sudah digunakan. Pilih slug lain.",
      });
    throw error;
  }
}
export async function deleteContent(id: string) {
  const { client } = await requireAdmin();
  if (!(await new ContentRepository(client).remove(id)))
    throw new AppError("Konten tidak ditemukan.", 404);
}
