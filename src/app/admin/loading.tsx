import { CatalogueSkeleton } from "@/components/ui/catalogue-skeleton";
export default function Loading() {
  return (
    <main
      id="main"
      className="container admin-main"
      aria-live="polite"
      aria-busy="true"
    >
      <CatalogueSkeleton admin />
    </main>
  );
}
