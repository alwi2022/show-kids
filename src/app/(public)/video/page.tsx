import { LibraryPage } from "@/components/public/library-page";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Video anak | SHOW Kids",
  description: "Lagu dan cerita untuk menemani rasa ingin tahu si kecil.",
  alternates: { canonical: "/video" },
};
export default function Videos({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <LibraryPage
      searchParams={searchParams}
      type="Video"
      path="/video"
      title="Satu video, cerita baru."
      description="Bernyanyi, mengenal alam, dan menemukan hal kecil yang menarik bersama SHOW Kids."
    />
  );
}
