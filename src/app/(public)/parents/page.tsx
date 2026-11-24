import { LibraryPage } from "@/components/public/library-page";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tips for Parents | SHOW Kids",
  description: "Ide kegiatan dan bacaan untuk waktu bersama keluarga.",
  alternates: { canonical: "/parents" },
};
export default function Parents({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <LibraryPage
      searchParams={searchParams}
      type="Artikel"
      path="/parents"
      title="Ruang kecil untuk orang tua."
      description="Ide percakapan, permainan, dan kegiatan sehari-hari untuk menemani rasa ingin tahu anak."
    />
  );
}
