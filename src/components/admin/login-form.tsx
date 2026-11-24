"use client";
import { useState } from "react";
import { motion } from "framer-motion";
export function LoginForm({ available }: { available: boolean }) {
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="login-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        const form = new FormData(event.currentTarget);
        try {
          const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: form.get("email"),
              password: form.get("password"),
            }),
          });
          const result = await response.json();
          if (!response.ok) {
            setError(result.message);
            return;
          }
          setRedirecting(true);
          window.location.replace("/admin");
        } catch {
          setError("Koneksi terputus. Periksa jaringan dan coba kembali.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label htmlFor="email">Email admin</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        required
        maxLength={254}
        disabled={!available}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        maxLength={200}
        disabled={!available}
      />
      {!available && (
        <p className="form-message" role="status">
          Login belum tersedia. Hubungi pengelola situs.
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="button green"
        type="submit"
        disabled={busy || redirecting || !available}
      >
        {redirecting
          ? "Membuka workspace..."
          : busy
            ? "Memeriksa akun..."
            : "Masuk ke CMS"}
      </motion.button>
    </form>
  );
}
