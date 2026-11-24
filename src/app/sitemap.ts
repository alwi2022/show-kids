import type { MetadataRoute } from "next";
import { publicSitemap } from "@/server/services/content-service";
import { siteUrl } from "@/lib/config";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: `${siteUrl}/` },
    ...(await publicSitemap()).map((c) => ({
      url: `${siteUrl}/content/${c.slug}`,
      lastModified: c.updated_at,
    })),
  ];
}
