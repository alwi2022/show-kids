import { z } from "zod";
import { categories, contentTypes, slugify, videoEmbed } from "@/lib/content";

export function plainText(value: unknown) {
  return typeof value === "string"
    ? value
        .replace(/<[^>]*>/g, "")
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
        .trim()
    : "";
}
export function httpsUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch {
    return false;
  }
}
export function storageRef(value: string, bucket: "thumbnails" | "worksheets") {
  return new RegExp(
    `^storage:${bucket}/[a-f0-9-]+\\.(?:${bucket === "thumbnails" ? "png|jpg|webp" : "pdf"})$`,
  ).test(value);
}
export const contentSchema = z
  .object({
    title: z
      .string()
      .min(1, "Judul wajib diisi.")
      .max(160, "Judul maksimal 160 karakter."),
    slug: z
      .string()
      .min(1, "Slug wajib diisi.")
      .max(120)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Gunakan huruf kecil, angka, dan tanda hubung.",
      ),
    category: z.enum(categories, { error: "Pilih kategori yang tersedia." }),
    type: z.enum(contentTypes, { error: "Pilih tipe konten." }),
    description: z
      .string()
      .min(1, "Deskripsi wajib diisi.")
      .max(20000, "Deskripsi maksimal 20.000 karakter."),
    thumbnail: z
      .string()
      .refine(
        (v) => httpsUrl(v) || storageRef(v, "thumbnails"),
        "Upload thumbnail atau masukkan URL HTTPS.",
      ),
    alt_text: z.string().min(1, "Alt text wajib diisi.").max(250),
    media_url: z.string().max(2000),
    duration: z.number().int().positive().max(86400).nullable(),
    is_new: z.boolean(),
    published: z.boolean(),
    meta_title: z
      .string()
      .min(1, "Meta title wajib diisi.")
      .max(60, "Meta title maksimal 60 karakter."),
    meta_description: z
      .string()
      .min(1, "Meta description wajib diisi.")
      .max(160, "Meta description maksimal 160 karakter."),
    canonical_url: z
      .string()
      .max(2000)
      .refine(
        (v) => !v || httpsUrl(v),
        "Canonical URL harus menggunakan HTTPS.",
      ),
    focus_keyword: z.string().max(100),
  })
  .superRefine((data, ctx) => {
    if (data.type === "Video" && !videoEmbed(data.media_url))
      ctx.addIssue({
        code: "custom",
        path: ["media_url"],
        message: "Gunakan URL YouTube atau Vimeo yang valid.",
      });
    if (
      data.type === "Worksheet" &&
      !(
        storageRef(data.media_url, "worksheets") ||
        (httpsUrl(data.media_url) && /\.pdf(?:\?|$)/i.test(data.media_url))
      )
    )
      ctx.addIssue({
        code: "custom",
        path: ["media_url"],
        message: "Upload PDF atau masukkan URL HTTPS berakhiran .pdf.",
      });
  });
export function parseContent(form: FormData) {
  const text = (key: string) => plainText(form.get(key));
  const title = text("title");
  return contentSchema.safeParse({
    title,
    slug: text("slug") || slugify(title),
    category: text("category"),
    type: text("type"),
    description: text("description"),
    thumbnail: text("thumbnail"),
    alt_text: text("alt_text"),
    media_url: text("media_url"),
    duration: text("duration") ? Number(text("duration")) : null,
    is_new: form.get("is_new") === "1",
    published: form.get("published") === "1",
    meta_title: text("meta_title"),
    meta_description: text("meta_description"),
    canonical_url: text("canonical_url"),
    focus_keyword: text("focus_keyword"),
  });
}
