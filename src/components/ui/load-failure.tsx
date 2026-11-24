"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export function LoadFailure({
  title = "Konten belum bisa dimuat",
  description = "Koneksi sedang terganggu. Coba muat kembali untuk melanjutkan.",
  backHref,
  backLabel = "Ke beranda",
  retry,
}: {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  retry?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <section className="load-failure" aria-label={title}>
      <div className="load-failure-art" aria-hidden="true">
        <svg width="92" height="76" viewBox="0 0 92 76" fill="none">
          <rect
            x="12"
            y="10"
            width="68"
            height="52"
            rx="8"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 24h68M22 17h1m6 0h1m6 0h1M33 40l-7 6 7 6m26-12 7 6-7 6m-13-17-5 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="load-failure-copy">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="button-row">
          <button
            className="button green"
            disabled={pending}
            onClick={() =>
              startTransition(() => {
                router.refresh();
                retry?.();
              })
            }
          >
            {pending ? "Memuat kembali..." : "Coba lagi"}
          </button>
          {backHref && (
            <Link href={backHref} className="load-failure-back">
              {backLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
