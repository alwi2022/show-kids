import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Content, ContentInput, Filters } from "@/lib/content";

export class ContentRepository {
  constructor(private client: SupabaseClient) {}
  async featured(
    slugs: string[],
    page: number,
  ): Promise<{ contents: Content[]; count: number; page: number }> {
    const { data, error } = await this.client
      .from("contents")
      .select("*")
      .eq("published", true)
      .in("slug", slugs);
    if (error) throw error;
    const pinned = slugs.flatMap((slug) =>
      (data as Content[]).filter((item) => item.slug === slug),
    );
    let query = this.client
      .from("contents")
      .select("*", { count: "exact" })
      .eq("published", true);
    if (pinned.length)
      query = query.not(
        "slug",
        "in",
        `(${pinned.map((item) => item.slug).join(",")})`,
      );
    const start = (page - 1) * 12;
    const offset = Math.max(0, start - pinned.length);
    const {
      data: rest,
      error: restError,
      count,
    } = await query
      .order("created_at", { ascending: false })
      .order("id")
      .range(offset, offset + 11);
    const total = pinned.length + (count || 0);
    const last = Math.max(1, Math.ceil(total / 12));
    if ((!restError || restError.code === "PGRST103") && page > last)
      return this.featured(slugs, last);
    if (restError) throw restError;
    const first = pinned.slice(start, start + 12);
    return {
      contents: [...first, ...(rest as Content[]).slice(0, 12 - first.length)],
      count: total,
      page,
    };
  }
  async list(
    filters: Filters,
    admin = false,
  ): Promise<{ contents: Content[]; count: number; page: number }> {
    let query = this.client.from("contents").select("*", { count: "exact" });
    if (!admin) query = query.eq("published", true);
    if (admin && filters.status)
      query = query.eq("published", filters.status === "published");
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.type) query = query.eq("type", filters.type);
    if (filters.q) {
      const q = filters.q.replace(/[^\p{L}\p{N}\s&'-]/gu, " ").trim();
      if (q) query = query.or(`title.ilike.%${q}%,category.ilike.%${q}%`);
    }
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .order("id")
      .range((filters.page - 1) * 12, filters.page * 12 - 1);
    const lastPage = Math.max(1, Math.ceil((count || 0) / 12));
    if ((!error || error.code === "PGRST103") && filters.page > lastPage)
      return this.list({ ...filters, page: lastPage }, admin);
    if (error) throw error;
    return {
      contents: data as Content[],
      count: count || 0,
      page: filters.page,
    };
  }
  async bySlug(slug: string) {
    const { data, error } = await this.client
      .from("contents")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    return data as Content | null;
  }
  async byId(id: string) {
    const { data, error } = await this.client
      .from("contents")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as Content | null;
  }
  async save(input: ContentInput, id?: string) {
    const query = id
      ? this.client.from("contents").update(input).eq("id", id)
      : this.client.from("contents").insert(input);
    const { data, error } = await query.select("*").single();
    if (error) throw error;
    return data as Content;
  }
  async remove(id: string) {
    const { data, error } = await this.client
      .from("contents")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    return data;
  }
  async sitemap() {
    const rows: Pick<Content, "slug" | "updated_at">[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await this.client
        .from("contents")
        .select("slug,updated_at")
        .eq("published", true)
        .order("id")
        .range(offset, offset + 999);
      if (error) throw error;
      rows.push(...data);
      if (data.length < 1000) return rows;
    }
  }
}
