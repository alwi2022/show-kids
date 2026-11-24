import { requireAdminPage } from "@/server/services/auth-service";
import { adminCategories } from "@/server/services/category-service";
import { CategoryManager } from "@/components/admin/category-manager";
import { Pagination } from "@/components/ui/pagination";
import { parseFilters } from "@/lib/content";
import { LoadFailure } from "@/components/ui/load-failure";
export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminPage();
  const filters = parseFilters(await searchParams);
  let result;
  try {
    result = await adminCategories(filters.page);
  } catch {
    return (
      <main id="main" className="container admin-main">
        <h1>Kategori</h1>
        <LoadFailure
          title="Kategori belum bisa dimuat"
          description="Periksa koneksi dan pastikan migration kategori sudah dijalankan di Supabase."
          backHref="/admin"
          backLabel="Ke daftar konten"
        />
      </main>
    );
  }
  const { rows, count, page } = result;
  return (
    <main id="main" className="container admin-main">
      <CategoryManager rows={rows} />
      <Pagination
        count={count}
        page={page}
        label="Halaman kategori"
        href={(page) => `/admin/categories?page=${page}`}
      />
    </main>
  );
}
