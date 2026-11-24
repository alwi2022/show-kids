export function VideoDescription({ description }: { description: string }) {
  const paragraphs = description.split(/\n\s*\n/).filter(Boolean);
  return (
    <section
      className="video-description"
      aria-labelledby="video-description-heading"
    >
      <h2 id="video-description-heading">Tentang video ini</h2>
      <p>{paragraphs[0]}</p>
      {paragraphs.length > 1 && (
        <details className="video-description-more">
          <summary>
            <span className="description-expand">Baca deskripsi lengkap</span>
            <span className="description-collapse">Tutup deskripsi</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div>
            {paragraphs.slice(1).map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
