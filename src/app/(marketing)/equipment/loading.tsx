import { CatalogSkeleton } from "@/components/equipment/catalog-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function EquipmentLoading() {
  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="container-page py-8 lg:py-14">
          <div className="grid items-end gap-10 lg:grid-cols-[1.12fr_0.88fr]">
            <div>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-5 h-3 w-48" />
              <div className="mt-4 grid gap-2">
                <Skeleton className="h-14 w-full max-w-[520px]" />
                <Skeleton className="h-14 w-3/4 max-w-[420px]" />
              </div>
              <div className="mt-5 grid gap-2">
                <Skeleton className="h-4 w-full max-w-[560px]" />
                <Skeleton className="h-4 w-2/3 max-w-[380px]" />
              </div>
              <Skeleton className="mt-5 h-7 w-64 rounded-full" />
            </div>
            <Skeleton className="h-64 w-full max-w-[380px] rounded-[10px] lg:justify-self-end" />
          </div>
        </div>
      </section>

      <section className="border-b-2 border-ink bg-surface">
        <div className="container-page py-6 lg:py-8">
          <CatalogSkeleton />
        </div>
      </section>
    </>
  );
}
