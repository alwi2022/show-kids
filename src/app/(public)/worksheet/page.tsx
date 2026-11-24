import { LibraryPage } from "@/components/public/library-page";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Worksheet anak | SHOW Kids",
  description: "Aktivitas cetak untuk belajar dan bermain bersama.",
  alternates: { canonical: "/worksheet" },
};
export default function Worksheets({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <LibraryPage
      searchParams={searchParams}
      type="Worksheet"
      path="/worksheet"
      title="Cetak, coba, ceritakan."
      description="Pilihan aktivitas sederhana untuk dikerjakan si kecil bersama orang tua. Pilih worksheet lalu buka PDF-nya."
    />
  );
}
