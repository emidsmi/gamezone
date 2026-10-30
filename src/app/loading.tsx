import { Skeleton } from "@/components/StateMessage";

export default function HomeLoading() {
  return (
    <div role="status" aria-label="Carregando a loja">
      <Skeleton className="h-[26rem] w-full !rounded-none sm:h-[32rem]" />
      {[0, 1].map((r) => (
        <div key={r} className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          <Skeleton className="mb-4 h-7 w-48" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-72 w-40 shrink-0 sm:w-48" />)}
          </div>
        </div>
      ))}
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
