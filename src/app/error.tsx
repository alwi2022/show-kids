"use client";
import { LoadFailure } from "@/components/ui/load-failure";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container status-page">
      <h1>Ada sedikit gangguan</h1>
      <LoadFailure retry={reset} backHref="/" />
    </main>
  );
}
