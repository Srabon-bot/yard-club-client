import { Skeleton } from "@/components/ui/skeleton";

export function CatalogSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading equipment…</span>

      <div aria-hidden="true">
        <div className="overflow-hidden rounded-[10px] border-2 border-ink bg-background">
          <div className="flex items-center justify-between gap-3 border-b-2 border-ink bg-surface px-4 py-3 sm:px-5">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="grid gap-5 p-4 sm:p-5">
            <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr]">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="grid gap-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-11 w-full rounded-[6px]" />
                </div>
              ))}
            </div>
            <div className="grid gap-5 border-t border-ink/15 pt-5 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="grid gap-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-11 w-full rounded-[6px]" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-ink/15 pt-4">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-11 w-36 rounded-[6px]" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-3 w-52" />
          </div>
          <Skeleton className="h-10 w-72 rounded-[6px]" />
        </div>

        <div className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[10px] border-2 border-ink bg-surface"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-none border-b-2 border-ink" />
              <div className="grid gap-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="grid gap-1.5">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-ink/15 pt-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t-2 border-ink pt-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-56 rounded-[6px]" />
        </div>
      </div>
    </div>
  );
}
