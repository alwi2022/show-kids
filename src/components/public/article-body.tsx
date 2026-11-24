import { articleDocument } from "@/lib/article";
export function ArticleBody({ value }: { value: string }) {
  const { html, toc } = articleDocument(value);
  return (
    <>
      {toc.length > 0 && (
        <nav className="article-toc" aria-label="Daftar isi artikel">
          <h2>Daftar isi</h2>
          <ol>
            {toc.map((item) => (
              <li
                key={item.id}
                className={item.level === 3 ? "toc-subheading" : undefined}
              >
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
