"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryRecord } from "@/server/repositories/category-repository";
import { Icon } from "@/components/ui/icon";
export function CategoryManager({ rows }: { rows: CategoryRecord[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<CategoryRecord | null>(null);
  const [mode, setMode] = useState<"edit" | "delete">("edit");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const lastTrigger = useRef<HTMLElement | null>(null);
  const router = useRouter();
  function open(
    record: CategoryRecord | null,
    action: "edit" | "delete",
    trigger: HTMLElement,
  ) {
    lastTrigger.current = trigger;
    setSelected(record);
    setName(record?.name || "");
    setMode(action);
    setError("");
    dialog.current?.showModal();
  }
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <h1>Kategori</h1>
          <p>Atur kategori untuk semua jenis konten.</p>
        </div>
        <button
          className="button green"
          onClick={(event) => open(null, "edit", event.currentTarget)}
        >
          <Icon name="plus" />
          Tambah kategori
        </button>
      </div>
      {notice && (
        <p role="status" className="success-message">
          {notice}
        </p>
      )}
      <div className="cms-table-wrap category-table">
        <table className="cms-table">
          <thead>
            <tr>
              <th scope="col">Nama kategori</th>
              <th scope="col">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td data-label="Nama kategori">
                  <strong>{row.name}</strong>
                </td>
                <td data-label="Tindakan">
                  <div className="cms-table-actions">
                    <button
                      className="text-button"
                      onClick={(event) =>
                        open(row, "edit", event.currentTarget)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="text-button danger"
                      onClick={(event) =>
                        open(row, "delete", event.currentTarget)
                      }
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="empty-state">
            <Icon name="file" />
            <h2>Belum ada kategori</h2>
            <p>Tambahkan kategori untuk mengelompokkan konten.</p>
          </div>
        )}
      </div>
      <dialog
        ref={dialog}
        className="confirm-dialog cms-category-dialog"
        aria-labelledby="category-dialog-title"
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        onClose={() => lastTrigger.current?.focus()}
      >
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            try {
              const body = new FormData();
              body.set("name", name);
              const response = await fetch(
                `/api/admin/categories${selected ? `/${selected.id}` : ""}`,
                {
                  method:
                    mode === "delete" ? "DELETE" : selected ? "PUT" : "POST",
                  ...(mode !== "delete" ? { body } : {}),
                },
              );
              const result = await response.json();
              if (!response.ok) {
                setError(result.message || "Kategori belum tersimpan.");
                return;
              }
              dialog.current?.close();
              setNotice(
                mode === "delete"
                  ? "Kategori berhasil dihapus."
                  : "Kategori berhasil disimpan.",
              );
              router.refresh();
            } catch {
              setError("Koneksi terputus. Coba kembali; isian tetap tersedia.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <h2 id="category-dialog-title">
            {mode === "delete"
              ? "Hapus kategori?"
              : selected
                ? "Edit kategori"
                : "Tambah kategori"}
          </h2>
          {mode === "delete" ? (
            <p>
              Kategori “{selected?.name}” akan dihapus. Kategori yang masih
              dipakai konten tidak dapat dihapus.
            </p>
          ) : (
            <div className="field">
              <label htmlFor="category-name">Nama kategori</label>
              <input
                id="category-name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={80}
                autoFocus
                disabled={busy}
              />
            </div>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="button-row">
            <button
              type="button"
              className="button outline"
              disabled={busy}
              onClick={() => dialog.current?.close()}
            >
              Batal
            </button>
            <button
              className={`button ${mode === "delete" ? "destructive" : "green"}`}
              disabled={busy}
            >
              {busy
                ? "Memproses..."
                : mode === "delete"
                  ? "Hapus kategori"
                  : "Simpan kategori"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
