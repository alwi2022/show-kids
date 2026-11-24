import Link from "next/link";
import {
  categories,
  contentTypes,
  catalogUrl,
  type Content,
  type Filters,
} from "@/lib/content";
import { Icon } from "@/components/ui/icon";
import { ContentCard } from "./content-card";
export function Catalogue({
  contents,
  count,
  filters,
}: {
  contents: Content[];
  count: number;
  filters: Filters;
}) {
  const filtered = Boolean(
    filters.q || filters.category || filters.type || filters.page > 1,
  );
  return (
    <section className="container catalogue" id="catalog">
      <div className="section-heading">
        <div>
          <p className="section-label">Temukan kesukaan baru</p>
          <h2>Popular Series</h2>
        </div>
        <p>Untuk ditonton, dicoba, dan dibicarakan bersama.</p>
      </div>
      <form action="/#catalog" className="search-bar" id="search" role="search">
        <label className="sr-only" htmlFor="content-search">
          Cari judul atau kategori
        </label>
        <Icon name="search" />
        <input
          id="content-search"
          name="q"
          defaultValue={filters.q}
          placeholder="Cari judul atau kategori"
          maxLength={160}
        />
        {filters.category && (
          <input type="hidden" name="category" value={filters.category} />
        )}
        <label className="sr-only" htmlFor="type-filter">
          Tipe konten
        </label>
        <select id="type-filter" name="type" defaultValue={filters.type}>
          <option value="">Semua konten</option>
          {contentTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <button className="button green" type="submit">
          Cari
        </button>
      </form>
      <nav className="category-filters" aria-label="Filter kategori">
        <Link
          className={!filters.category ? "selected" : ""}
          aria-current={!filters.category ? "page" : undefined}
          href={catalogUrl(filters, { category: "", page: 1 })}
        >
          Semua
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            className={filters.category === category ? "selected" : ""}
            aria-current={filters.category === category ? "page" : undefined}
            href={catalogUrl(filters, { category, page: 1 })}
          >
            {category}
          </Link>
        ))}
      </nav>
      {filtered && (
        <div className="result-summary">
          <p>
            {count} konten ditemukan{filters.q ? ` untuk “${filters.q}”` : ""}
          </p>
          <Link href="/#catalog">Hapus filter</Link>
        </div>
      )}
      {contents.length ? (
        <div className="content-grid">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="book" width="42" height="42" />
          <h3>
            {filtered
              ? "Belum ada yang cocok"
              : "Petualangan belajar segera hadir"}
          </h3>
          <p>
            {filtered
              ? "Coba judul lain atau pilih kategori yang berbeda."
              : "Video, worksheet, dan bacaan akan tampil di sini setelah diterbitkan."}
          </p>
          {filtered && (
            <Link className="button outline" href="/#catalog">
              Lihat semua konten
            </Link>
          )}
        </div>
      )}
      {count > 12 && (
        <nav className="pagination" aria-label="Halaman katalog">
          {filters.page > 1 && (
            <Link
              className="button outline"
              href={catalogUrl(filters, { page: filters.page - 1 })}
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
              href={catalogUrl(filters, { page: filters.page + 1 })}
            >
              Berikutnya
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}
