import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/server/services/auth-service";
import { isSupabaseConfigured } from "@/lib/config";
import { Wordmark } from "@/components/public/header";
import { LoginForm } from "@/components/admin/login-form";
export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main id="main" className="login-page">
      <div className="login-brand">
        <Link href="/" aria-label="SHOW Kids beranda">
          <Wordmark />
        </Link>
        <h1>
          Ruang untuk
          <br />
          cerita berikutnya.
        </h1>
        <p>Kelola konten yang mengajak si kecil mengenal dunia.</p>
        <img
          src="/assets/show/show-token.png"
          alt=""
          width="360"
          height="350"
        />
      </div>
      <div className="login-panel">
        <Link className="back-link" href="/">
          Kembali ke website
        </Link>
        <div>
          <p className="section-label">SHOW Kids CMS</p>
          <h2>Selamat datang kembali</h2>
          <p>Masuk untuk mengelola dan menerbitkan konten.</p>
          <LoginForm available={isSupabaseConfigured()} />
        </div>
      </div>
    </main>
  );
}
