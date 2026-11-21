import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="container-page py-10 lg:py-16"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[10px] border-2 border-ink bg-surface p-6 shadow-offset-sm">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-5 h-10 w-3/4" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-6 h-11 w-44 rounded-full" />
        </div>
        <Skeleton className="h-72 rounded-[10px] border-2 border-ink" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="rounded-[10px] border-2 border-ink bg-surface p-4 shadow-offset-sm"
          >
            <Skeleton className="h-40 w-full rounded-[6px]" />
            <Skeleton className="mt-4 h-4 w-4/5" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
