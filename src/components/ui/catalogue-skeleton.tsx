export function CatalogueSkeleton({ admin = false }: { admin?: boolean }) {
  return (
    <div
      className={`catalogue-skeleton ${admin ? "cms-skeleton" : ""}`}
      role="status"
      aria-label="Memuat konten"
      aria-busy="true"
    >
      <span className="sr-only">Memuat konten...</span>
      <div className="skeleton-line skeleton-heading" />
      <div className="skeleton-line skeleton-search" />
      <div className="skeleton-grid">
        {Array.from({ length: admin ? 5 : 6 }, (_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton-image" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-short" />
          </div>
        ))}
      </div>
    </div>
  );
}
