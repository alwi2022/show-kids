import { ContentImage } from "@/components/ui/content-image";
import Link from "next/link";
import type { Content } from "@/lib/content";
import { Icon } from "@/components/ui/icon";
import { DeleteButton } from "./delete-button";
export function ContentTable({
  contents,
  thumbnails,
}: {
  contents: Content[];
  thumbnails: Record<string, string | null>;
}) {
  return (
    <div className="cms-table-wrap">
      <table className="cms-table">
        <caption className="sr-only">Daftar konten SHOW Kids</caption>
        <thead>
          <tr>
            <th scope="col">Judul</th>
            <th scope="col">Tipe / kategori</th>
            <th scope="col">Status</th>
            <th scope="col">Diperbarui</th>
            <th scope="col">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((content) => (
            <tr key={content.id}>
              <td data-label="Judul">
                <div className="cms-table-title">
                  {thumbnails[content.id] ? (
                    <ContentImage
                      className="cms-table-thumbnail"
                      src={thumbnails[content.id]!}
                      alt={content.alt_text}
                      width="80"
                      height="50"
                      loading="lazy"
                    />
                  ) : (
                    <span className="cms-type-icon">
                      <Icon
                        name={
                          content.type === "Video"
                            ? "play"
                            : content.type === "Worksheet"
                              ? "file"
                              : "book"
                        }
                      />
                    </span>
                  )}
                  <div>
                    <span className="cms-record-link">{content.title}</span>
                    <span className="cms-record-slug">/{content.slug}</span>
                  </div>
                </div>
              </td>
              <td data-label="Tipe / kategori">
                <span className="cms-cell-primary">{content.type}</span>
                <span className="cms-cell-secondary">{content.category}</span>
              </td>
              <td data-label="Status">
                <span
                  className={`cms-status ${content.published ? "published" : ""}`}
                >
                  {content.published ? "Published" : "Draft"}
                </span>
                {content.is_new && <span className="cms-new">New</span>}
              </td>
              <td data-label="Diperbarui">
                <time dateTime={content.updated_at}>
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "Asia/Jakarta",
                  }).format(new Date(content.updated_at))}
                </time>
              </td>
              <td data-label="Tindakan">
                <div className="cms-table-actions">
                  <Link
                    href={`/admin/content/${content.id}/edit`}
                    className="text-button"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={content.id} title={content.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
