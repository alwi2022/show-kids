"use client";
import { LoadFailure } from "@/components/ui/load-failure";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container admin-main">
      <h1>Workspace</h1>
      <LoadFailure
        title="Data belum bisa ditampilkan"
        description="Koneksi ke penyimpanan sedang terganggu. Coba lagi untuk membuka workspace."
        retry={reset}
        backHref="/admin"
        backLabel="Ke daftar konten"
      />
    </main>
  );
}
