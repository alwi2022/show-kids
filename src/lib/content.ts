export const categories = [
  "Music & Song",
  "Education Learning",
  "Creative & DIY",
  "Animal & Nature",
  "Healthy Habits",
] as const;
export const contentTypes = ["Video", "Worksheet", "Artikel"] as const;
export type Category = string;
export function demoAsset(value: string, extension: "svg" | "pdf") {
  const names =
    extension === "pdf"
      ? "shapes|counting|patterns"
      : "shapes|counting|patterns|reading|playtime|routine";
  return new RegExp(`^/assets/demo/(?:${names})\\.${extension}$`).test(value);
}
export type ContentType = (typeof contentTypes)[number];
export type Content = {
  id: string;
  title: string;
  slug: string;
  category: Category;
  type: ContentType;
  description: string;
  thumbnail: string;
  alt_text: string;
  media_url: string;
  duration: number | null;
  is_new: boolean;
  published: boolean;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  focus_keyword: string;
  created_at: string;
  updated_at: string;
};
export type ContentInput = Omit<Content, "id" | "created_at" | "updated_at">;
export type Filters = {
  q: string;
  category: string;
  type: string;
  status: string;
  page: number;
};
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): Filters {
  const str = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  const page = Number(str("page"));
  return {
    q: str("q").trim().slice(0, 160),
    category: str("category").trim().slice(0, 80),
    type: contentTypes.includes(str("type") as ContentType) ? str("type") : "",
    status: ["published", "draft"].includes(str("status")) ? str("status") : "",
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1,
  };
}
export function catalogUrl(
  filters: Partial<Filters> = {},
  changes: Partial<Filters> = {},
  admin = false,
) {
  const values = { ...filters, ...changes };
  const params = new URLSearchParams();
  for (const key of ["q", "category", "type", "status", "page"] as const) {
    const value = values[key];
    if (
      value &&
      !(key === "page" && value === 1) &&
      (admin || key !== "status")
    )
      params.set(key, String(value));
  }
  return `${admin ? "/admin" : "/"}${params.size ? `?${params}` : ""}${admin ? "" : "#catalog"}`;
}
export function formatDuration(seconds: number | null) {
  if (!seconds) return "";
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120)
    .replace(/-$/, "");
}
export function videoEmbed(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (
      [
        "youtube.com",
        "www.youtube.com",
        "youtube-nocookie.com",
        "www.youtube-nocookie.com",
        "youtu.be",
      ].includes(url.hostname)
    ) {
      const id =
        url.hostname === "youtu.be"
          ? url.pathname.slice(1)
          : url.searchParams.get("v") || url.pathname.split("/embed/")[1];
      return /^[a-zA-Z0-9_-]{11}$/.test(id || "")
        ? `https://www.youtube-nocookie.com/embed/${id}`
        : null;
    }
    if (
      ["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)
    ) {
      const id = url.pathname.split("/").filter(Boolean).at(-1);
      return /^\d+$/.test(id || "")
        ? `https://player.vimeo.com/video/${id}`
        : null;
    }
  } catch {}
  return null;
}
