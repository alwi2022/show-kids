import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  publicContent,
  publicCatalogue,
} from "@/server/services/content-service";
import { formatDuration, parseFilters, videoEmbed } from "@/lib/content";
import { ContentCard } from "@/components/public/content-card";
import { Icon } from "@/components/ui/icon";
import { siteUrl } from "@/lib/config";
import { contentSchema, jsonLd } from "@/lib/seo";
import { StructuredData } from "@/components/public/structured-data";
export const dynamic = "force-dynamic";
const getContent = cache(publicContent);
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getContent((await params).slug);
  if (!content) notFound();
  return {
    title: content.meta_title,
    description: content.meta_description,
    alternates: {
      canonical: content.canonical_url || `/content/${content.slug}`,
    },
    openGraph: {
      title: content.meta_title,
      description: content.meta_description,
      type: content.type === "Video" ? "video.other" : "article",
      url: `/content/${content.slug}`,
      images: [
        {
          url: `${siteUrl}/media/${content.id}/thumbnail`,
          alt: content.alt_text,
        },
      ],
    },
  };
}
export default async function Detail({ params }: Props) {
  const content = await getContent((await params).slug);
  if (!content) notFound();
  const related = (
    await publicCatalogue(parseFilters({ category: content.category }))
  ).contents
    .filter((c) => c.id !== content.id)
    .slice(0, 3);
  const embed = videoEmbed(content.media_url);
  return (
    <main id="main" className="container detail-page">
      <StructuredData json={jsonLd(contentSchema(content))} />
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href="/#catalog">Semua konten</Link>
        <span>/</span>
        <span>{content.category}</span>
      </nav>
      <header className="detail-heading">
        <p className="category-label">
          {content.category} · {content.type}
          {content.duration ? ` · ${formatDuration(content.duration)}` : ""}
        </p>
        <h1>{content.title}</h1>
      </header>
      {content.type === "Video" && embed ? (
        <div className="video-frame">
          <iframe
            src={embed}
            title={content.title}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : (
        <div className="detail-cover">
          <img
            src={content.thumbnail}
            alt={content.alt_text}
            width="1200"
            height="700"
          />
        </div>
      )}
      <div className="detail-body">
        {content.type === "Worksheet" && (
          <a
            href={content.media_url}
            target="_blank"
            rel="noopener noreferrer"
            className="button green"
          >
            <Icon name="download" />
            Buka dan unduh PDF
          </a>
        )}
        <h2>
          {content.type === "Artikel"
            ? "Bacaan untuk orang tua"
            : "Tentang konten ini"}
        </h2>
        {content.description.split(/\n\s*\n/).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {related.length > 0 && (
        <section className="related">
          <h2>Masih ingin tahu?</h2>
          <div className="content-grid">
            {related.map((c) => (
              <ContentCard key={c.id} content={c} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
