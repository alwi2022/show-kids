import "server-only";
import { randomUUID } from "node:crypto";
import { AppError, getAdmin, requireAdmin } from "./auth-service";
import { publicClient } from "@/lib/supabase/server";
export async function uploadArticleImage(form: FormData) {
  const { client } = await requireAdmin();
  const file = form.get("image");
  if (!(file instanceof File) || !file.size || file.size > 2 * 1024 * 1024)
    throw new AppError("Pilih gambar JPG, PNG, atau WebP maksimal 2 MB.", 422);
  const buffer = Buffer.from(await file.arrayBuffer());
  let ext = "",
    mime = "";
  if (
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    ext = "png";
    mime = "image/png";
  } else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    ext = "jpg";
    mime = "image/jpeg";
  } else if (
    buffer.subarray(0, 4).toString() === "RIFF" &&
    buffer.subarray(8, 12).toString() === "WEBP"
  ) {
    ext = "webp";
    mime = "image/webp";
  } else
    throw new AppError("Isi file bukan JPG, PNG, atau WebP yang valid.", 422);
  const name = `${randomUUID()}.${ext}`;
  const { error } = await client.storage
    .from("thumbnails")
    .upload(name, buffer, { contentType: mime, upsert: false });
  if (error)
    throw new AppError(
      "Gambar belum terunggah. Periksa koneksi dan coba kembali.",
      502,
    );
  return { src: `/article-images/${name}` };
}
export async function articleImageUrl(name: string) {
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(name)) return null;
  const admin = await getAdmin();
  const client = admin?.client || publicClient();
  if (!admin) {
    const { data, error } = await client
      .from("contents")
      .select("id")
      .eq("published", true)
      .eq("type", "Artikel")
      .like("description", `%/article-images/${name}%`)
      .limit(1);
    if (error) throw error;
    if (!data?.length) return null;
  }
  const { data, error } = await client.storage
    .from("thumbnails")
    .createSignedUrl(name, 60);
  if (error) throw error;
  return data.signedUrl;
}
