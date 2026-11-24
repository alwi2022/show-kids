import "server-only";
import { cache } from "react";
import { z } from "zod";
import { categories } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/config";
import { publicClient } from "@/lib/supabase/server";
import { CategoryRepository } from "@/server/repositories/category-repository";
import { AppError, requireAdmin } from "./auth-service";
import { plainText } from "@/server/validators/content";
export const categoryNames = cache(async () => {
  if (!isSupabaseConfigured()) return [...categories] as string[];
  try {
    return (await new CategoryRepository(publicClient()).all()).map(
      (row) => row.name,
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      ["42P01", "PGRST205"].includes(String(error.code))
    )
      return [...categories];
    throw error;
  }
});
export async function adminCategories(page = 1) {
  const { client } = await requireAdmin();
  return new CategoryRepository(client).list(page);
}
export async function mutateCategory(
  name: unknown,
  id?: string,
  remove = false,
) {
  const { client } = await requireAdmin();
  if (id && !z.uuid().safeParse(id).success)
    throw new AppError("Kategori tidak ditemukan.", 404);
  const repo = new CategoryRepository(client);
  try {
    if (remove) {
      if (!id || !(await repo.remove(id)))
        throw new AppError("Kategori tidak ditemukan.", 404);
      return { deleted: true };
    }
    const parsed = z
      .string()
      .min(1, "Nama kategori wajib diisi.")
      .max(80, "Nama kategori maksimal 80 karakter.")
      .safeParse(plainText(name));
    if (!parsed.success)
      throw new AppError(parsed.error.issues[0].message, 422);
    const result = await repo.save(parsed.data, id);
    if (!result) throw new AppError("Kategori tidak ditemukan.", 404);
    return result;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "23505")
        throw new AppError("Nama kategori sudah digunakan.", 409);
      if (error.code === "23503")
        throw new AppError(
          "Kategori masih digunakan konten. Pindahkan konten ke kategori lain sebelum menghapusnya.",
          409,
        );
      if (["42P01", "PGRST205"].includes(String(error.code)))
        throw new AppError(
          "Kategori belum siap. Jalankan migration kategori di Supabase terlebih dahulu.",
          503,
        );
    }
    throw error;
  }
}
