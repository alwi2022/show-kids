import Link from "next/link";
import { requireAdminPage } from "@/server/services/auth-service";
import { adminCatalogue } from "@/server/services/content-service";
import { parseFilters, contentTypes, catalogUrl } from "@/lib/content";
import { ContentTable } from "@/components/admin/content-table";
import { Pagination } from "@/components/ui/pagination";
import { LoadFailure } from "@/components/ui/load-failure";
import { Icon } from "@/components/ui/icon";
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const filters = parseFilters(params);
  let result;
  try {
    result = await adminCatalogue(filters);
  } catch {
    return (
      <main id="main" className="container admin-main">
        <h1>Kelola konten</h1>
        <LoadFailure
          title="Daftar konten belum bisa dimuat"
          description="Data belum dapat dijangkau. Coba lagi; konten yang sudah tersimpan tetap ada."
        />
      </main>
    );
  }
  const { contents, count, thumbnails, page } = result;
  filters.page = page;
  return (
    <>
      <main id="main" className="container admin-main">
        <div className="admin-page-heading">
          <div>
            <p className="section-label">Content library</p>
            <h1>Kelola konten</h1>
            <p>Kelola video, worksheet, dan artikel SHOW Kids.</p>
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
        {params.deleted === "1" && (
          <p className="success-message" role="status">
            Konten berhasil dihapus.
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
          <span>Diurutkan dari yang terbaru</span>
        </div>
        {contents.length ? (
          <ContentTable contents={contents} thumbnails={thumbnails} />
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
        <Pagination
          count={count}
          page={filters.page}
          href={(page) => catalogUrl(filters, { page }, true)}
          label="Halaman CMS"
        />
      </main>
    </>
  );
}
