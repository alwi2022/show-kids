import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
export async function adminMembership(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}
