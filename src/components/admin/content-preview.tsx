"use client";
import { articleHtml } from "@/lib/article";
import { ContentImage } from "@/components/ui/content-image";
import type { ContentInput } from "@/lib/content";
import { formatDuration, videoEmbed, demoAsset } from "@/lib/content";
import { Icon } from "@/components/ui/icon";

export function SeoPreview({
  data,
  origin,
}: {
  data: ContentInput;
  origin: string;
}) {
  const url =
    data.canonical_url || `${origin}/content/${data.slug || "slug-konten"}`;
  return (
    <div className="cms-seo-preview" aria-label="Preview hasil pencarian">
      <span className="cms-preview-label">Preview hasil pencarian</span>
      <div className="cms-search-site">
        <span className="cms-search-mark" aria-hidden="true">
          S
        </span>
        <div>
          <strong>SHOW Kids</strong>
          <span>{url}</span>
        </div>
      </div>
      <h3>{data.meta_title || data.title || "Judul konten"}</h3>
      <p>
        {data.meta_description || "Meta description akan ditampilkan di sini."}
      </p>
    </div>
  );
}

export function ContentPreview({
  data,
  thumbnail,
  mediaPreviewUrl,
}: {
  data: ContentInput;
  thumbnail: string | null;
  mediaPreviewUrl?: string | null;
}) {
  const embed = data.type === "Video" ? videoEmbed(data.media_url) : null;
  const pdf =
    mediaPreviewUrl ||
    (demoAsset(data.media_url, "pdf") || /^https:\/\//.test(data.media_url)
      ? data.media_url
      : null);
  return (
    <aside className="cms-live-preview" aria-label="Preview konten">
      <div className="cms-preview-toolbar">
        <strong>Preview konten</strong>
        <span>Tampilan isian</span>
      </div>
      <article className="cms-preview-page">
        <p className="cms-preview-category">
          {data.category} · {data.type}
          {data.duration ? ` · ${formatDuration(data.duration)}` : ""}
        </p>
        <h2>{data.title || "Judul konten"}</h2>
        {embed ? (
          <iframe
            className="cms-preview-media"
            src={embed}
            title={`Preview ${data.title || "video"}`}
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : thumbnail ? (
          <ContentImage
            className="cms-preview-media"
            src={thumbnail}
            alt={data.alt_text || ""}
            width="640"
            height="360"
          />
        ) : (
          <div className="cms-preview-placeholder">
            <Icon name="file" />
            <span>Thumbnail konten</span>
          </div>
        )}
        {data.type === "Worksheet" && pdf && (
          <a
            className="cms-preview-download"
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="file" />
            Buka worksheet (PDF)
          </a>
        )}
        <h3>
          {data.type === "Artikel"
            ? "Bacaan untuk orang tua"
            : "Tentang konten ini"}
        </h3>
        {data.type === "Artikel" ? (
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: articleHtml(data.description) }}
          />
        ) : (
          <>
            {(data.description || "Deskripsi konten akan ditampilkan di sini.")
              .split(/\n\s*\n/)
              .map((paragraph, index) => (
                <p className="cms-preview-paragraph" key={index}>
                  {paragraph}
                </p>
              ))}
          </>
        )}
      </article>
    </aside>
  );
}
