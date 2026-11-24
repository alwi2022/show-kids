import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { serverClient } from "@/lib/supabase/server";
import { adminMembership } from "@/server/repositories/admin-repository";

export class AppError extends Error {
  constructor(
    message: string,
    public status = 400,
    public errors?: Record<string, string>,
  ) {
    super(message);
  }
}
export async function getAdmin() {
  if (!isSupabaseConfigured()) return null;
  const client = await serverClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) return null;
  try {
    return (await adminMembership(client, user.id)) ? { user, client } : null;
  } catch {
    throw new AppError("Hak akses belum dapat diperiksa. Coba kembali.", 503);
  }
}
export async function authenticate(credentials: {
  email: string;
  password: string;
}) {
  if (!isSupabaseConfigured())
    throw new AppError("Login belum tersedia. Hubungi pengelola situs.", 503);
  const client = await serverClient();
  const { data, error } = await client.auth.signInWithPassword(credentials);
  if (error || !data.user)
    throw new AppError(
      error?.status === 429
        ? "Terlalu banyak percobaan. Coba beberapa saat lagi."
        : "Email atau password tidak sesuai.",
      error?.status === 429 ? 429 : 401,
    );
  try {
    if (!(await adminMembership(client, data.user.id)))
      throw new AppError("Akun tidak memiliki akses admin.", 403);
  } catch (error) {
    await client.auth.signOut();
    throw error;
  }
}
export async function logout() {
  const client = await serverClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin)
    throw new AppError(
      "Sesi berakhir atau akun tidak memiliki akses admin.",
      401,
    );
  return admin;
}
export async function requireAdminPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
