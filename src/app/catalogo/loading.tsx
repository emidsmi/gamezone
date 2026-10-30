import { Skeleton } from "@/components/StateMessage";

export default function CatalogLoading() {
  return (
    <div role="status" aria-label="Carregando o catálogo" className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <Skeleton className="h-9 w-40" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_1fr]">
        <Skeleton className="h-96" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      </div>
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
