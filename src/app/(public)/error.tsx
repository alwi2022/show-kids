"use client";
import { LoadFailure } from "@/components/ui/load-failure";
export default function PublicError({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container status-page">
      <h1>Ada sedikit gangguan</h1>
      <LoadFailure
        title="Halaman belum bisa dimuat"
        retry={reset}
        backHref="/"
      />
    </main>
  );
}
