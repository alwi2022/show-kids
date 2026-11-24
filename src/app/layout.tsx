import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { MotionProvider } from "@/components/ui/motion";
import { siteUrl } from "@/lib/config";
import { publicContent } from "@/server/services/content-service";
import { contentSchema, jsonLd } from "@/lib/seo";
import "./globals.css";
import "./public-mobile.css";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export const metadata: Metadata = {
  icons: { icon: "/assets/show/show-kids-avatar.jpg" },
  metadataBase: new URL(siteUrl),
  title: "SHOW Kids | Belajar sambil menemukan hal baru",
  description:
    "Temukan video, worksheet, dan bacaan untuk menemani anak belajar bersama orang tua.",
  openGraph: {
    title: "SHOW Kids",
    description: "Temukan video, worksheet, dan bacaan untuk belajar bersama.",
    locale: "id_ID",
    siteName: "SHOW Kids",
    type: "website",
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const slug = (await headers()).get("x-content-slug");
  const content = slug ? await publicContent(slug) : null;
  return (
    <html lang="id">
      <head>
        {content && (
          <script
            id="content-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(contentSchema(content)) }}
          />
        )}
      </head>
      <body>
        <MotionProvider>
          <a href="#main" className="skip-link">
            Lewati ke konten
          </a>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
