"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
export function DeleteButton({ id, title }: { id: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <button
        ref={trigger}
        className="text-button danger"
        onClick={() => {
          setError("");
          dialog.current?.showModal();
        }}
      >
        Hapus
      </button>
      <dialog
        ref={dialog}
        className="confirm-dialog"
        aria-labelledby={`delete-${id}`}
        onClose={() => trigger.current?.focus()}
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
      >
        <h2 id={`delete-${id}`}>Hapus konten?</h2>
        <p>“{title}” akan dihapus dari katalog dan CMS.</p>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="button-row">
          <button
            className="button outline"
            disabled={busy}
            onClick={() => dialog.current?.close()}
          >
            Batal
          </button>
          <button
            className="button destructive"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const response = await fetch(`/api/admin/content/${id}`, {
                  method: "DELETE",
                });
                const result = await response.json();
                if (!response.ok) {
                  setError(result.message);
                  return;
                }
                dialog.current?.close();
                router.refresh();
              } catch {
                setError(
                  "Konten belum terhapus. Periksa koneksi dan coba kembali.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Menghapus..." : "Hapus konten"}
          </button>
        </div>
      </dialog>
    </>
  );
}
