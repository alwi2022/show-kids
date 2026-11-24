"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
export function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <button
        className="button outline"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const response = await fetch("/api/admin/logout", {
              method: "POST",
            });
            if (!response.ok) throw new Error();
            router.replace("/admin/login");
            router.refresh();
          } catch {
            setError("Logout gagal. Coba kembali.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <Icon name="logout" />
        {busy ? "Keluar..." : "Keluar"}
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
