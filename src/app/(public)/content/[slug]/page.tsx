import { ArticleBody } from "@/components/public/article-body";
import { ContentImage } from "@/components/ui/content-image";
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
import { VideoDescription } from "@/components/public/video-description";
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
    await publicCatalogue(
      parseFilters({ category: content.category, type: content.type }),
    ).catch(() => ({ contents: [] }))
  ).contents
    .filter((c) => c.id !== content.id)
    .slice(0, 3);
  const embed = videoEmbed(content.media_url);
  const library =
    content.type === "Video"
      ? { href: "/video", label: "Video" }
      : content.type === "Worksheet"
        ? { href: "/worksheet", label: "Worksheet" }
        : { href: "/parents", label: "Tips for Parents" };
  const browseLabel =
    content.type === "Video"
      ? "Semua video"
      : content.type === "Worksheet"
        ? "Semua worksheet"
        : "Semua tips parenting";
  const paragraphs = content.description.split(/\n\s*\n/).filter(Boolean);
  return (
    <main
      id="main"
      className={`container detail-page detail-${content.type.toLowerCase()}`}
    >
      <StructuredData json={jsonLd(contentSchema(content))} />
      <article className="detail-document">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/">Beranda</Link>
          <span aria-hidden="true">/</span>
          <Link href={library.href}>{library.label}</Link>
          <span aria-hidden="true">/</span>
          <span>{content.category}</span>
        </nav>
        {content.type === "Video" && embed && (
          <div className="video-frame">
            <iframe
              src={embed}
              title={content.title}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        )}
        <header className="detail-heading">
          <p className="category-label">
            {content.category} · {content.type}
            {content.type === "Video" && content.duration
              ? ` · ${formatDuration(content.duration)}`
              : ""}
          </p>
          <h1>{content.title}</h1>
        </header>
        <div className="detail-content-layout">
          {content.type !== "Video" && (
            <div className="detail-media-column">
              <div className="detail-cover">
                <ContentImage
                  src={content.thumbnail}
                  alt={content.alt_text}
                  width="1200"
                  height="700"
                />
              </div>
              {content.type === "Worksheet" && (
                <div className="worksheet-action">
                  <a
                    href={content.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button green"
                    aria-describedby="worksheet-action-hint"
                  >
                    <Icon name="file" />
                    Buka worksheet (PDF)
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M14 4h6v6m0-6-11 11M10 4H4v16h16v-6" />
                    </svg>
                  </a>
                  <p id="worksheet-action-hint">
                    Terbuka di tab baru. Unduh atau cetak melalui pembaca PDF.
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="detail-body">
            {content.type === "Video" ? (
              <VideoDescription description={content.description} />
            ) : content.type === "Artikel" ? (
              <ArticleBody value={content.description} />
            ) : (
              <>
                <h2>Tentang worksheet</h2>
                <p className="detail-intro">{paragraphs[0]}</p>
                <div className="detail-prose">
                  {paragraphs.slice(1).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </article>
      <nav className="detail-return" aria-label="Kembali ke daftar konten">
        <Link href={library.href}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
          {browseLabel}
        </Link>
      </nav>
      {related.length > 0 && (
        <section className="related">
          <div className="related-heading">
            <h2>
              {content.type === "Video"
                ? "Video terkait"
                : content.type === "Worksheet"
                  ? "Worksheet terkait"
                  : "Bacaan terkait"}
            </h2>
          </div>
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
