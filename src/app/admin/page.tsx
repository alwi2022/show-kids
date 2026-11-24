import Link from "next/link";
import { requireAdminPage } from "@/server/services/auth-service";
import { adminCatalogue } from "@/server/services/content-service";
import { parseFilters, contentTypes, catalogUrl } from "@/lib/content";
import { AdminHeader } from "@/components/admin/admin-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Icon } from "@/components/ui/icon";
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const filters = parseFilters(params);
  const { contents, count } = await adminCatalogue(filters);
  return (
    <>
      <AdminHeader />
      <main id="main" className="container admin-main">
        <div className="admin-page-heading">
          <div>
            <p className="section-label">Content library</p>
            <h1>Kelola konten</h1>
            <p>Siapkan, periksa, lalu terbitkan cerita berikutnya.</p>
          </div>
          <Link href="/admin/content/new" className="button green">
            <Icon name="plus" />
            Tambah konten
          </Link>
        </div>
        {params.saved === "1" && (
          <p className="success-message" role="status">
            Konten berhasil disimpan.
          </p>
        )}
        <form action="/admin" className="admin-filters">
          <div className="search-input">
            <Icon name="search" />
            <label className="sr-only" htmlFor="admin-search">
              Cari konten
            </label>
            <input
              id="admin-search"
              name="q"
              defaultValue={filters.q}
              placeholder="Cari judul atau kategori"
              maxLength={160}
            />
          </div>
          <label className="sr-only" htmlFor="admin-type">
            Tipe konten
          </label>
          <select id="admin-type" name="type" defaultValue={filters.type}>
            <option value="">Semua tipe</option>
            {contentTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="admin-status">
            Status publikasi
          </label>
          <select id="admin-status" name="status" defaultValue={filters.status}>
            <option value="">Semua status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button type="submit" className="button outline">
            Filter
          </button>
          {(filters.q || filters.type || filters.status) && (
            <Link className="back-link" href="/admin">
              Reset
            </Link>
          )}
        </form>
        <div className="admin-list-header">
          <span>{count} konten</span>
          <span>Status / tindakan</span>
        </div>
        {contents.length ? (
          <div className="admin-content-list">
            {contents.map((content) => (
              <article key={content.id} className="admin-content-row">
                <div className="admin-content-info">
                  <span className="content-type-icon">
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
                  <div>
                    <p>
                      {content.type} · {content.category}
                    </p>
                    <h2>
                      <Link href={`/admin/content/${content.id}/edit`}>
                        {content.title}
                      </Link>
                    </h2>
                    <span className="content-slug">/{content.slug}</span>
                  </div>
                </div>
                <div className="row-actions">
                  <span
                    className={`status-badge ${content.published ? "published" : ""}`}
                  >
                    {content.published ? "Published" : "Draft"}
                  </span>
                  <Link
                    className="text-button"
                    href={`/admin/content/${content.id}/edit`}
                  >
                    Edit
                  </Link>
                  {content.published && (
                    <Link
                      className="text-button"
                      href={`/content/${content.slug}`}
                    >
                      Lihat
                    </Link>
                  )}
                  <DeleteButton id={content.id} title={content.title} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="file" width="42" height="42" />
            <h2>
              {filters.q || filters.type || filters.status
                ? "Tidak ada konten yang cocok"
                : "Mulai dengan konten pertama"}
            </h2>
            <p>
              {filters.q || filters.type || filters.status
                ? "Ubah pencarian atau hapus filter untuk melihat konten lain."
                : "Tambahkan video, worksheet, atau artikel untuk mengisi katalog."}
            </p>
            <Link
              className="button green"
              href={
                filters.q || filters.type || filters.status
                  ? "/admin"
                  : "/admin/content/new"
              }
            >
              {filters.q || filters.type || filters.status
                ? "Hapus filter"
                : "Tambah konten"}
            </Link>
          </div>
        )}
        {count > 12 && (
          <nav className="pagination" aria-label="Halaman CMS">
            {filters.page > 1 && (
              <Link
                className="button outline"
                href={catalogUrl(filters, { page: filters.page - 1 }, true)}
              >
                Sebelumnya
              </Link>
            )}
            <span>
              Halaman {filters.page} dari {Math.ceil(count / 12)}
            </span>
            {filters.page * 12 < count && (
              <Link
                className="button outline"
                href={catalogUrl(filters, { page: filters.page + 1 }, true)}
              >
                Berikutnya
              </Link>
            )}
          </nav>
        )}
      </main>
    </>
  );
}
