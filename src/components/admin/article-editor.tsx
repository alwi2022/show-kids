"use client";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import { articleHtml } from "@/lib/article";
export function ArticleEditor({
  value,
  onChange,
  disabled,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  invalid: boolean;
}) {
  const [panel, setPanel] = useState<"link" | "image" | null>(null);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const panelInput = useRef<HTMLInputElement>(null);
  const panelTrigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (panel) panelInput.current?.focus();
  }, [panel]);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        code: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          defaultProtocol: "https",
          HTMLAttributes: { target: null, rel: "noopener noreferrer" },
        },
        strike: false,
        blockquote: false,
        underline: false,
      }),
      Image.configure({ allowBase64: false }),
    ],
    immediatelyRender: false,
    content: articleHtml(value),
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        id: "description",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "Isi artikel",
        "aria-invalid": String(invalid),
      },
    },
  });
  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold"),
      italic: editor?.isActive("italic"),
      h2: editor?.isActive("heading", { level: 2 }),
      h3: editor?.isActive("heading", { level: 3 }),
      bullet: editor?.isActive("bulletList"),
      ordered: editor?.isActive("orderedList"),
      link: editor?.isActive("link"),
      undo: editor?.can().undo(),
      redo: editor?.can().redo(),
    }),
  });
  return (
    <div className="article-editor">
      <input type="hidden" name="description" value={value} />
      <div
        className="article-editor-toolbar"
        role="group"
        aria-label="Format artikel"
      >
        {[
          {
            label: "Urungkan",
            icon: "undo",
            enabled: state?.undo,
            run: () => editor?.chain().focus().undo().run(),
          },
          {
            label: "Ulangi",
            icon: "redo",
            enabled: state?.redo,
            run: () => editor?.chain().focus().redo().run(),
          },
          {
            label: "Paragraf",
            icon: "paragraph",
            run: () => editor?.chain().focus().setParagraph().run(),
          },
          {
            label: "Heading 2",
            icon: "h2",
            active: state?.h2,
            run: () =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run(),
          },
          {
            label: "Heading 3",
            icon: "h3",
            active: state?.h3,
            run: () =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run(),
          },
          {
            label: "Tebal",
            icon: "bold",
            active: state?.bold,
            run: () => editor?.chain().focus().toggleBold().run(),
          },
          {
            label: "Miring",
            icon: "italic",
            active: state?.italic,
            run: () => editor?.chain().focus().toggleItalic().run(),
          },
          {
            label: "Daftar bullet",
            icon: "bullet",
            active: state?.bullet,
            run: () => editor?.chain().focus().toggleBulletList().run(),
          },
          {
            label: "Daftar bernomor",
            icon: "ordered",
            active: state?.ordered,
            run: () => editor?.chain().focus().toggleOrderedList().run(),
          },
          {
            label: "Sisipkan link",
            icon: "link",
            active: state?.link,
            run: () => {
              setPanel("link");
              setUrl(editor?.getAttributes("link").href || "");
              setMessage("");
            },
          },
          {
            label: "Sisipkan gambar",
            icon: "image",
            run: () => {
              setPanel("image");
              setUrl("");
              setAlt("");
              setMessage("");
            },
          },
        ].map((tool) => (
          <button
            key={tool.icon}
            type="button"
            aria-label={tool.label}
            title={tool.label}
            disabled={
              !editor || disabled || uploading || tool.enabled === false
            }
            aria-pressed={tool.active}
            onClick={(event) => {
              if (tool.icon === "link" || tool.icon === "image")
                panelTrigger.current = event.currentTarget;
              tool.run();
              if (panel === tool.icon) panelInput.current?.focus();
            }}
          >
            <EditorIcon name={tool.icon} />
          </button>
        ))}
      </div>
      {panel && (
        <div
          className="article-insert-panel"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              setPanel(null);
              panelTrigger.current?.focus();
            }
          }}
          role="group"
          aria-label={
            panel === "link" ? "Pengaturan link" : "Pengaturan gambar"
          }
        >
          <label htmlFor="article-insert-url">
            {panel === "link" ? "URL tujuan (HTTPS)" : "URL gambar (HTTPS)"}
          </label>
          <input
            ref={panelInput}
            id="article-insert-url"
            type="url"
            value={url}
            disabled={disabled || uploading}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://"
          />
          {panel === "image" && (
            <>
              <label htmlFor="article-image-alt">Alt text gambar</label>
              <input
                id="article-image-alt"
                value={alt}
                maxLength={250}
                disabled={disabled || uploading}
                onChange={(event) => setAlt(event.target.value)}
              />
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={disabled || uploading}
                aria-label="Upload gambar artikel"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file || !editor) return;
                  if (!alt.trim()) {
                    setMessage("Isi alt text sebelum mengunggah gambar.");
                    event.target.value = "";
                    return;
                  }
                  if (
                    file.size > 2 * 1024 * 1024 ||
                    !["image/jpeg", "image/png", "image/webp"].includes(
                      file.type,
                    )
                  ) {
                    setMessage("Gunakan JPG, PNG, atau WebP maksimal 2 MB.");
                    event.target.value = "";
                    return;
                  }
                  setUploading(true);
                  setMessage("");
                  try {
                    const body = new FormData();
                    body.set("image", file);
                    const response = await fetch("/api/admin/article-images", {
                      method: "POST",
                      body,
                    });
                    const result = await response.json();
                    if (!response.ok)
                      throw new Error(result.message || "Upload gagal.");
                    if (!editor.isDestroyed)
                      editor
                        .chain()
                        .focus()
                        .setImage({ src: result.src, alt: alt.trim() })
                        .run();
                    setPanel(null);
                  } catch (error) {
                    setMessage(
                      error instanceof Error
                        ? error.message
                        : "Koneksi terputus.",
                    );
                  } finally {
                    setUploading(false);
                    if (fileInput.current) fileInput.current.value = "";
                  }
                }}
              />
              <p className="field-hint">
                JPG, PNG, WebP maksimal 2 MB. Simpan artikel untuk menyimpan
                perubahan isi.
              </p>
            </>
          )}
          <div className="button-row">
            <button
              type="button"
              className="button outline"
              disabled={disabled || uploading}
              onClick={() => {
                setPanel(null);
                editor?.commands.focus();
              }}
            >
              Batal
            </button>
            {panel === "link" && (
              <button
                type="button"
                className="button outline"
                disabled={disabled || uploading}
                onClick={() => {
                  editor
                    ?.chain()
                    .focus()
                    .extendMarkRange("link")
                    .unsetLink()
                    .run();
                  setPanel(null);
                }}
              >
                Hapus link
              </button>
            )}
            <button
              type="button"
              className="button green"
              disabled={disabled || uploading}
              onClick={() => {
                if (!/^https:\/\//.test(url.trim())) {
                  setMessage("Masukkan URL HTTPS yang valid.");
                  return;
                }
                try {
                  const parsed = new URL(url);
                  if (parsed.username || parsed.password) throw new Error();
                } catch {
                  setMessage("URL tidak valid.");
                  return;
                }
                if (panel === "image") {
                  if (!alt.trim()) {
                    setMessage("Alt text gambar wajib diisi.");
                    return;
                  }
                  editor
                    ?.chain()
                    .focus()
                    .setImage({ src: url.trim(), alt: alt.trim() })
                    .run();
                } else if (
                  editor?.state.selection.empty &&
                  !editor.isActive("link")
                )
                  editor
                    ?.chain()
                    .focus()
                    .insertContent({
                      type: "text",
                      text: url.trim(),
                      marks: [{ type: "link", attrs: { href: url.trim() } }],
                    })
                    .run();
                else
                  editor
                    ?.chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: url.trim() })
                    .run();
                setPanel(null);
                setMessage("");
              }}
            >
              Sisipkan {panel === "link" ? "link" : "gambar"}
            </button>
          </div>
        </div>
      )}
      {uploading && (
        <p role="status" className="field-hint">
          Mengunggah gambar...
        </p>
      )}
      {message && (
        <p role="alert" className="form-error">
          {message}
        </p>
      )}
      {!editor && <p className="field-hint">Memuat editor artikel...</p>}
      <EditorContent editor={editor} />
    </div>
  );
}

function EditorIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    link: (
      <>
        <path d="m10 13 4-4m-6 6-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 3 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8" cy="8" r="2" />
        <path d="m3 17 5-5 4 4 4-6 5 7" />
      </>
    ),
    undo: <path d="M4 9h10a6 6 0 0 1 0 12M4 9l5-5M4 9l5 5" />,
    redo: <path d="M20 9H10a6 6 0 0 0 0 12m10-12-5-5m5 5-5 5" />,
    paragraph: <path d="M14 21V3H9a5 5 0 0 0 0 10h5m5-10v18M14 3h7" />,
    h2: (
      <>
        <path d="M3 5v14m10-14v14M3 12h10m4 1c0-4 5-4 5-1 0 2-5 3-5 7h5" />
      </>
    ),
    h3: (
      <path d="M3 5v14m10-14v14M3 12h10m4-2h3a2 2 0 0 1 0 4h-2m2 0a2.5 2.5 0 0 1 0 5h-3" />
    ),
    bold: <path d="M6 4h7a4 4 0 0 1 0 8H6V4Zm0 8h8a4 4 0 0 1 0 8H6v-8Z" />,
    italic: <path d="M10 4h10M4 20h10m1-16-6 16" />,
    bullet: (
      <>
        <circle cx="4" cy="6" r="1" />
        <circle cx="4" cy="12" r="1" />
        <circle cx="4" cy="18" r="1" />
        <path d="M9 6h12M9 12h12M9 18h12" />
      </>
    ),
    ordered: (
      <path d="M3 3h1v6M2 9h4m-4 5c0-3 4-3 4-1 0 2-4 3-4 6h4M10 6h11M10 12h11M10 18h11" />
    ),
  };
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
