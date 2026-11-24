import { CatalogueSkeleton } from "@/components/ui/catalogue-skeleton";
export default function Loading() {
  return (
    <main
      id="main"
      className="container status-page"
      aria-live="polite"
      aria-busy="true"
    >
      <CatalogueSkeleton admin />
    </main>
  );
}
