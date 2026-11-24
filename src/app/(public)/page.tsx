import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { publicCatalogue } from "@/server/services/content-service";
import { parseFilters, type Filters } from "@/lib/content";
import { Catalogue } from "@/components/public/catalogue";
import { Icon } from "@/components/ui/icon";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/" } };
async function CatalogueData({ filters }: { filters: Filters }) {
  const result = await publicCatalogue(filters);
  return <Catalogue {...result} filters={filters} />;
}
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  return (
    <main id="main">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-intro">Dunia kecil, penemuan besar.</p>
            <h1>
              Rasa ingin tahu
              <br />
              mulai dari <span>sini.</span>
            </h1>
            <p className="hero-description">
              Dari lagu pertama sampai pertanyaan tentang dunia. Temukan hal
              baru dan nikmati waktu belajar bersama si kecil.
            </p>
            <Link className="button yellow hero-cta" href="#catalog">
              <Icon name="play" />
              Jelajahi konten
            </Link>
          </div>
          <div className="hero-art">
            <div className="art-backdrop" />
            <img
              src="/assets/discovery.svg"
              alt="Dua karakter bersahabat dari ilustrasi penjelajahan"
              width="520"
              height="510"
              fetchPriority="high"
            />
            <div className="art-caption">
              <Icon name="leaf" />
              <span>
                Banyak hal kecil
                <br />
                <strong>untuk ditemukan.</strong>
              </span>
            </div>
          </div>
        </div>
        <div className="hero-bottom" aria-hidden="true" />
      </section>
      <Suspense
        key={JSON.stringify(filters)}
        fallback={
          <section
            id="catalog"
            className="container catalogue"
            aria-busy="true"
            aria-live="polite"
          >
            <h2>Popular Series</h2>
            <p>Memuat katalog konten...</p>
          </section>
        }
      >
        <CatalogueData filters={filters} />
      </Suspense>
      <section
        className="container quick-access"
        aria-label="Aktivitas dan bacaan"
      >
        <Link
          className="resource-link worksheet-link"
          href="/?type=Worksheet#catalog"
        >
          <span className="resource-icon">
            <Icon name="file" width="36" height="36" />
          </span>
          <div>
            <h2>Waktunya mencoba sendiri</h2>
            <p>Worksheet untuk dicetak dan dikerjakan bersama.</p>
            <span className="text-action">Pilih worksheet</span>
          </div>
        </Link>
        <Link
          className="resource-link parent-link"
          href="/?type=Artikel#catalog"
        >
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
    </main>
  );
}
