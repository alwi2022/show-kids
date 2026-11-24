import { publicCatalogue } from "@/server/services/content-service";
import { categoryNames } from "@/server/services/category-service";
import type { Filters } from "@/lib/content";
import { Catalogue } from "./catalogue";
import { LoadFailure } from "@/components/ui/load-failure";
export async function CatalogueData({
  filters,
  basePath = "/",
  title,
}: {
  filters: Filters;
  basePath?: string;
  title?: string;
}) {
  try {
    const [result, categoryOptions] = await Promise.all([
      publicCatalogue(filters),
      categoryNames(),
    ]);
    return (
      <Catalogue
        {...result}
        categoryOptions={categoryOptions}
        filters={{ ...filters, page: result.page || filters.page }}
        basePath={basePath}
        title={title}
      />
    );
  } catch {
    return (
      <section id="catalog" className="container catalogue">
        <LoadFailure
          title="Katalog sedang sulit dijangkau"
          description="Pilihan tontonan dan aktivitas belum bisa ditampilkan. Coba muat kembali sebentar lagi."
        />
      </section>
    );
  }
}
