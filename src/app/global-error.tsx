"use client";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          background: "#f7f8fc",
          color: "#182044",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main
          style={{
            maxWidth: 520,
            margin: "15vh auto",
            padding: "40px 28px",
            background: "white",
            border: "1px solid #dce2f1",
            borderRadius: 12,
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="8" y="10" width="48" height="40" rx="6" />
            <path d="M8 22h48M24 34l-5 5 5 5m16-10 5 5-5 5" />
          </svg>
          <h1 style={{ fontSize: 26, lineHeight: 1.3 }}>
            Ada sedikit gangguan
          </h1>
          <p style={{ lineHeight: 1.7, color: "#526080" }}>
            Halaman belum bisa dimuat. Coba lagi untuk melanjutkan ke SHOW Kids.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 24,
              marginTop: 28,
            }}
          >
            <button
              style={{
                minHeight: 44,
                padding: "12px 20px",
                background: "#2552d9",
                color: "white",
                border: 0,
                borderRadius: 6,
                fontSize: 16,
                cursor: "pointer",
              }}
              onClick={reset}
            >
              Coba lagi
            </button>
            <a style={{ color: "#182044", padding: "12px 0" }} href="/">
              Ke beranda
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
