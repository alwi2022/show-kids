import Link from "next/link";
import { Suspense } from "react";
import { parseFilters, type ContentType } from "@/lib/content";
import { CatalogueData } from "./catalogue-data";
import { CatalogueSkeleton } from "@/components/ui/catalogue-skeleton";
export async function LibraryPage({
  searchParams,
  type,
  path,
  title,
  description,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  type: ContentType;
  path: string;
  title: string;
  description: string;
}) {
  const filters = { ...parseFilters(await searchParams), type };
  return (
    <main id="main" className="library-page">
      <header className="container library-heading">
        <Link href="/" className="back-link">
          Beranda
        </Link>
        <p className="section-label">SHOW Kids Library</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <Suspense
        key={JSON.stringify(filters)}
        fallback={
          <div className="container catalogue">
            <CatalogueSkeleton />
          </div>
        }
      >
        <CatalogueData
          filters={filters}
          basePath={path}
          title={
            type === "Video"
              ? "Semua video"
              : type === "Worksheet"
                ? "Pilih aktivitas"
                : "Bacaan untuk orang tua"
          }
        />
      </Suspense>
    </main>
  );
}
