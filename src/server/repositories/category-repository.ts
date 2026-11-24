import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
export type CategoryRecord = { id: string; name: string; created_at: string };
export class CategoryRepository {
  constructor(private client: SupabaseClient) {}
  async list(
    page: number,
  ): Promise<{ rows: CategoryRecord[]; count: number; page: number }> {
    const { data, error, count } = await this.client
      .from("categories")
      .select("*", { count: "exact" })
      .order("name")
      .order("id")
      .range((page - 1) * 12, page * 12 - 1);
    const lastPage = Math.max(1, Math.ceil((count || 0) / 12));
    if ((!error || error.code === "PGRST103") && page > lastPage)
      return this.list(lastPage);
    if (error) throw error;
    return { rows: data as CategoryRecord[], count: count || 0, page };
  }
  async all() {
    const rows: CategoryRecord[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await this.client
        .from("categories")
        .select("*")
        .order("name")
        .range(offset, offset + 999);
      if (error) throw error;
      rows.push(...(data as CategoryRecord[]));
      if (data.length < 1000) return rows;
    }
  }
  async save(name: string, id?: string) {
    const query = id
      ? this.client.from("categories").update({ name }).eq("id", id)
      : this.client.from("categories").insert({ name });
    const { data, error } = await query.select("*").maybeSingle();
    if (error) throw error;
    return data as CategoryRecord | null;
  }
  async remove(id: string) {
    const { data, error } = await this.client
      .from("categories")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    return data;
  }
}
