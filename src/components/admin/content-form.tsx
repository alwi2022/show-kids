"use client";
import { ContentImage } from "@/components/ui/content-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  contentTypes,
  slugify,
  demoAsset,
  type Content,
  type ContentInput,
} from "@/lib/content";
import { Icon } from "@/components/ui/icon";
import { ContentPreview, SeoPreview } from "./content-preview";
const initial: ContentInput = {
  title: "",
  slug: "",
  category: "Education Learning",
  type: "Video",
  description: "",
  thumbnail: "",
  alt_text: "",
  media_url: "",
  duration: null,
  is_new: false,
  published: false,
  meta_title: "",
  meta_description: "",
  canonical_url: "",
  focus_keyword: "",
};
export function ContentForm({
  content,
  previewUrl,
  mediaPreviewUrl,
  siteOrigin,
  categoryOptions,
}: {
  content?: Content;
  previewUrl?: string | null;
  mediaPreviewUrl?: string | null;
  siteOrigin: string;
  categoryOptions: string[];
}) {
  const [data, setData] = useState<ContentInput>(
    content || { ...initial, category: categoryOptions[0] || "" },
  );
  const [slugEdited, setSlugEdited] = useState(Boolean(content));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [busy, setBusy] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [localThumbnail, setLocalThumbnail] = useState<string | null>(null);
  useEffect(() => {
    if (!thumbnailFile) {
      setLocalThumbnail(null);
      return;
    }
    const url = URL.createObjectURL(thumbnailFile);
    setLocalThumbnail(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);
  const thumbnail =
    localThumbnail ||
    (data.thumbnail === content?.thumbnail
      ? previewUrl || null
      : /^https:\/\//.test(data.thumbnail) || demoAsset(data.thumbnail, "svg")
        ? data.thumbnail
        : null);
  const formRef = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const update = (
    key: keyof ContentInput,
    value: string | boolean | number | null,
  ) => setData((prev) => ({ ...prev, [key]: value }));
  const error = (key: string) =>
    errors[key] ? (
      <p id={`${key}-error`} className="field-error">
        {errors[key]}
      </p>
    ) : null;
  const input = (
    key:
      | "title"
      | "slug"
      | "thumbnail"
      | "alt_text"
      | "media_url"
      | "meta_title"
      | "canonical_url"
      | "focus_keyword",
    label: string,
    maxLength: number,
    required = false,
  ) => (
    <div className="field">
      <label htmlFor={key}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={key}
        name={key}
        value={data[key]}
        maxLength={maxLength}
        required={required}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        onChange={(event) => {
          const value = event.target.value;
          if (key === "title")
            setData((prev) => ({
              ...prev,
              title: value,
              ...(!slugEdited ? { slug: slugify(value) } : {}),
            }));
          else {
            if (key === "slug") setSlugEdited(true);
            update(key, value);
          }
        }}
      />
      {key === "meta_title" && (
        <span className="character-count">{data.meta_title.length}/60</span>
      )}
      {error(key)}
    </div>
  );
  return (
    <form
      ref={formRef}
      className="content-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setErrors({});
        setMessage("");
        try {
          const response = await fetch(
            content ? `/api/admin/content/${content.id}` : "/api/admin/content",
            {
              method: content ? "PUT" : "POST",
              body: new FormData(event.currentTarget),
            },
          );
          const result = await response.json();
          if (!response.ok) {
            setErrors(result.errors || {});
            setMessage(result.message || "Konten belum tersimpan.");
            requestAnimationFrame(() => summary.current?.focus());
            return;
          }
          router.push("/admin?saved=1");
          router.refresh();
        } catch {
          setMessage(
            "Koneksi terputus. Isian tetap tersedia. Coba simpan kembali.",
          );
          requestAnimationFrame(() => summary.current?.focus());
        } finally {
          setBusy(false);
        }
      }}
    >
      {message && (
        <div ref={summary} tabIndex={-1} className="error-summary" role="alert">
          <strong>{message}</strong>
          {Object.entries(errors).length > 0 && (
            <ul>
              {Object.entries(errors).map(([key, text]) => (
                <li key={key}>
                  <a href={`#${key}`}>{text}</a>
                </li>
              ))}
            </ul>
          )}
          {content && <Link href="/admin/login">Ke halaman login</Link>}
        </div>
      )}
      <div className="cms-editor-toolbar">
        <span>{content ? "Edit dokumen" : "Dokumen baru"}</span>
        <button
          type="button"
          className="button outline"
          aria-expanded={showPreview}
          aria-controls="editor-preview"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Tutup preview" : "Buka preview"}
        </button>
        <div className="editor-actions">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="button green"
            type="submit"
            disabled={busy}
          >
            <Icon name="check" />
            {busy ? "Menyimpan konten..." : "Simpan konten"}
          </motion.button>
        </div>
      </div>
      <div className={`cms-editor-layout ${showPreview ? "with-preview" : ""}`}>
        <fieldset disabled={busy} className="editor-fields">
          <section className="editor-section" id="editor-info">
            <div className="editor-section-title">
              <h2>Informasi konten</h2>
              <p>Judul dan deskripsi yang dilihat pengunjung.</p>
            </div>
            <div className="editor-section-fields">
              {input("title", "Judul", 160, true)}
              {input("slug", "Slug", 120, true)}
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="category">Kategori *</label>
                  <select
                    id="category"
                    name="category"
                    value={data.category}
                    onChange={(e) => update("category", e.target.value)}
                  >
                    {categoryOptions.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  {error("category")}
                </div>
                <div className="field">
                  <label htmlFor="type">Tipe konten *</label>
                  <select
                    id="type"
                    name="type"
                    value={data.type}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        type: e.target.value as ContentInput["type"],
                        media_url: "",
                        duration: null,
                      }))
                    }
                  >
                    {contentTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  {error("type")}
                </div>
              </div>
              <div className="field">
                <label htmlFor="description">Deskripsi / isi artikel *</label>
                <textarea
                  id="description"
                  name="description"
                  rows={10}
                  required
                  maxLength={20000}
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                />
                {error("description")}
              </div>
            </div>
          </section>
          <section className="editor-section" id="editor-media">
            <div className="editor-section-title">
              <h2>Media</h2>
              <p>Thumbnail untuk katalog dan media sesuai tipe konten.</p>
            </div>
            <div className="editor-section-fields">
              {thumbnail && (
                <figure className="cms-editor-preview">
                  <ContentImage
                    src={thumbnail}
                    alt={data.alt_text || "Thumbnail konten"}
                    width="640"
                    height="360"
                  />
                  <figcaption>Thumbnail</figcaption>
                </figure>
              )}
              <div className="field">
                <label htmlFor="thumbnail_file">Upload thumbnail</label>
                <input
                  id="thumbnail_file"
                  name="thumbnail_file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setThumbnailFile(
                      file &&
                        ["image/png", "image/jpeg", "image/webp"].includes(
                          file.type,
                        ) &&
                        file.size <= 2 * 1024 * 1024
                        ? file
                        : null,
                    );
                  }}
                />
                <p className="field-hint">
                  PNG, JPG, atau WebP. Maksimal 2 MB. Upload menggantikan URL
                  thumbnail.
                </p>
                {error("thumbnail_file")}
              </div>
              {input("thumbnail", "URL thumbnail", 2000)}
              {input("alt_text", "Alt text thumbnail", 250, true)}
              {data.type === "Worksheet" && (
                <div className="field">
                  <label htmlFor="pdf_file">Upload worksheet PDF</label>
                  <input
                    id="pdf_file"
                    name="pdf_file"
                    type="file"
                    accept="application/pdf"
                  />
                  <p className="field-hint">
                    PDF maksimal 2 MB. Upload menggantikan URL PDF.
                  </p>
                  {error("pdf_file")}
                </div>
              )}
              {data.type !== "Artikel" &&
                input(
                  "media_url",
                  data.type === "Video"
                    ? "URL video YouTube / Vimeo"
                    : "URL PDF",
                  2000,
                  data.type === "Video",
                )}
              {data.type === "Video" && (
                <div className="field">
                  <label htmlFor="duration">Durasi dalam detik</label>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min={1}
                    max={86400}
                    value={data.duration ?? ""}
                    onChange={(e) =>
                      update(
                        "duration",
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                  />
                  {error("duration")}
                </div>
              )}
            </div>
          </section>
          <section className="editor-section" id="editor-seo">
            <div className="editor-section-title">
              <h2>Pengaturan SEO</h2>
              <p>Judul dan ringkasan untuk hasil pencarian.</p>
            </div>
            <div className="editor-section-fields">
              {input("meta_title", "Meta title", 60, true)}
              <div className="field">
                <label htmlFor="meta_description">Meta description *</label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  rows={3}
                  value={data.meta_description}
                  maxLength={160}
                  required
                  onChange={(e) => update("meta_description", e.target.value)}
                  aria-invalid={Boolean(errors.meta_description)}
                  aria-describedby={
                    errors.meta_description
                      ? "meta_description-error"
                      : undefined
                  }
                />
                <span className="character-count">
                  {data.meta_description.length}/160
                </span>
                {error("meta_description")}
              </div>
              {input("canonical_url", "Canonical URL", 2000)}
              {input("focus_keyword", "Focus keyword", 100)}
              <SeoPreview data={data} origin={siteOrigin} />
            </div>
          </section>
          <section
            className="editor-section cms-publication"
            id="editor-publish"
          >
            <div className="editor-section-title">
              <h2>Publikasi</h2>
            </div>
            <div className="editor-section-fields">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="published"
                  value="1"
                  checked={data.published}
                  onChange={(e) => update("published", e.target.checked)}
                />
                Terbitkan ke halaman publik
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_new"
                  value="1"
                  checked={data.is_new}
                  onChange={(e) => update("is_new", e.target.checked)}
                />
                Tampilkan badge New
              </label>
            </div>
          </section>
        </fieldset>
        {showPreview && (
          <div className="cms-preview-column" id="editor-preview">
            <ContentPreview
              data={data}
              thumbnail={thumbnail}
              mediaPreviewUrl={
                data.media_url === content?.media_url
                  ? mediaPreviewUrl
                  : undefined
              }
            />
          </div>
        )}
      </div>
    </form>
  );
}
