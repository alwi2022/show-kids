import Link from "next/link";
export function pageNumbers(
  current: number,
  total: number,
): (number | "gap")[] {
  if (total <= 7)
    return Array.from({ length: Math.max(0, total) }, (_, index) => index + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((page) => page > 0 && page <= total)
    .sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  for (const page of sorted) {
    const previous = result.at(-1);
    if (typeof previous === "number" && page - previous > 1) result.push("gap");
    result.push(page);
  }
  return result;
}
export function Pagination({
  count,
  page,
  pageSize = 12,
  href,
  label = "Halaman konten",
}: {
  count: number;
  page: number;
  pageSize?: number;
  href: (page: number) => string;
  label?: string;
}) {
  const total = Math.ceil(count / pageSize);
  if (total <= 1) return null;
  return (
    <nav className="pagination pagination-numbered" aria-label={label}>
      <span className="pagination-summary">
        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, count)} dari{" "}
        {count}
      </span>
      <div className="pagination-pages">
        {page > 1 ? (
          <Link
            className="page-control"
            href={href(page - 1)}
            aria-label="Halaman sebelumnya"
          >
            <PageArrow previous />
          </Link>
        ) : (
          <span className="page-control disabled" aria-disabled="true">
            <PageArrow previous />
          </span>
        )}
        {pageNumbers(page, total).map((item, index) =>
          item === "gap" ? (
            <span className="page-gap" key={`gap-${index}`}>
              …
            </span>
          ) : (
            <Link
              key={item}
              className={`page-control ${item === page ? "current" : ""}`}
              href={href(item)}
              aria-label={`Halaman ${item}`}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Link>
          ),
        )}
        {page < total ? (
          <Link
            className="page-control"
            href={href(page + 1)}
            aria-label="Halaman berikutnya"
          >
            <PageArrow />
          </Link>
        ) : (
          <span className="page-control disabled" aria-disabled="true">
            <PageArrow />
          </span>
        )}
      </div>
    </nav>
  );
}
function PageArrow({ previous = false }: { previous?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d={previous ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} />
    </svg>
  );
}
