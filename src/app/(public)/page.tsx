import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { parseFilters } from "@/lib/content";
import { CatalogueData } from "@/components/public/catalogue-data";
import { CatalogueSkeleton } from "@/components/ui/catalogue-skeleton";
import { Icon } from "@/components/ui/icon";
import { ExploreStories, SingAlong } from "@/components/public/discovery";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  return (
    <main id="main" className="landing-page">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>
              Rasa ingin tahu
              <br />
              <span>mulai dari sini.</span>
            </h1>
            <p className="hero-description">
              Video dan aktivitas dari SHOW Kids untuk menemani si kecil
              mengenal dunia, satu cerita setiap hari.
            </p>
            <Link className="button green hero-cta" href="#catalog">
              <Icon name="play" />
              Pilih tontonan
            </Link>
          </div>
          <div className="hero-dragon">
            <img
              src="/assets/show/hero-dragon.png"
              alt="Naga kecil biru yang ramah menyapa anak-anak"
              width="1024"
              height="1024"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>
      {!filters.q &&
        !filters.category &&
        !filters.type &&
        filters.page === 1 && (
          <Suspense fallback={null}>
            <ExploreStories />
          </Suspense>
        )}
      <Suspense
        key={JSON.stringify(filters)}
        fallback={
          <section
            id="catalog"
            className="container catalogue"
            aria-busy="true"
            aria-live="polite"
          >
            <CatalogueSkeleton />
          </section>
        }
      >
        <CatalogueData filters={filters} />
      </Suspense>
      <section
        className="container quick-access"
        aria-label="Aktivitas dan bacaan"
      >
        <Link className="resource-link worksheet-link" href="/worksheet">
          <span className="resource-icon">
            <Icon name="file" width="36" height="36" />
          </span>
          <div>
            <h2>Waktunya mencoba sendiri</h2>
            <p>Worksheet untuk dicetak dan dikerjakan bersama.</p>
            <span className="text-action">Pilih worksheet</span>
          </div>
        </Link>
        <Link className="resource-link parent-link" href="/parents">
          <span className="resource-icon">
            <Icon name="book" width="36" height="36" />
          </span>
          <div>
            <h2>Sudut untuk orang tua</h2>
            <p>Bacaan singkat untuk menemani tumbuh kembang anak.</p>
            <span className="text-action">Baca tips parenting</span>
          </div>
        </Link>
      </section>
      {!filters.q &&
        !filters.category &&
        !filters.type &&
        filters.page === 1 && (
          <Suspense fallback={null}>
            <SingAlong />
          </Suspense>
        )}
    </main>
  );
}
