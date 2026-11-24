import type { Content } from "./content";
import { videoEmbed } from "./content";
import { siteUrl } from "./config";
export function contentSchema(content: Content) {
  const url = `${siteUrl}/content/${content.slug}`;
  const common = {
    "@context": "https://schema.org",
    name: content.title,
    description: content.meta_description,
    url,
  };
  return content.type === "Video"
    ? {
        ...common,
        "@type": "VideoObject",
        thumbnailUrl: [`${siteUrl}/media/${content.id}/thumbnail`],
        uploadDate: content.created_at,
        embedUrl: videoEmbed(content.media_url),
        ...(content.duration ? { duration: `PT${content.duration}S` } : {}),
      }
    : {
        ...common,
        "@type": "Article",
        headline: content.title,
        image: `${siteUrl}/media/${content.id}/thumbnail`,
        datePublished: content.created_at,
        dateModified: content.updated_at,
        mainEntityOfPage: url,
      };
}
export function jsonLd(data: unknown) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
