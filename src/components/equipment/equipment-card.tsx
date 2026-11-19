import Image from "next/image";
import { ArrowUpRight, MapPin, ShieldCheck, Star } from "lucide-react";
import { CompareToggle } from "@/components/compare/compare-toggle";
import { DetailLink } from "@/components/equipment/detail-link";
import { StatusBadge } from "@/components/site/status-badge";
import { formatBDT } from "@/lib/format";
import type { Equipment, Owner } from "@/lib/types";

const RENTAL_LABEL = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
} as const;

export function EquipmentCard({
  item,
  owner,
  categoryName,
  priority = false,
  available = item.quantity > 0,
}: {
  item: Equipment;
  owner?: Owner;
  categoryName: string;
  priority?: boolean;
  available?: boolean;
}) {
  const availabilityTone = available
    ? "green"
    : item.quantity > 0
      ? "amber"
      : "red";
  const availabilityLabel = available
    ? "Available"
    : item.quantity > 0
      ? "On rent"
      : "Booked out";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[10px] border-2 border-ink bg-surface transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-offset-sm">
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink bg-secondary">
        <Image
          src={item.image}
          alt={`${item.name} in ${item.location}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3">
          <StatusBadge tone={availabilityTone}>{availabilityLabel}</StatusBadge>
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-ink/20 bg-background/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] backdrop-blur-sm">
          {item.condition}-grade
        </span>
        <span className="absolute bottom-3 right-3">
          <CompareToggle id={item.id} name={item.name} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
          <span>{categoryName}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" aria-hidden="true" />
            {item.location}
          </span>
        </div>

        <h3 className="mt-2 font-heading text-xl font-extrabold leading-[1.06] tracking-[-0.035em]">
          <DetailLink id={item.id} className="transition-colors hover:text-link">
            {item.name}
          </DetailLink>
        </h3>

        <div className="mt-3 flex items-center gap-2 text-xs">
          {owner ? (
            <>
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-ink bg-lime-soft font-mono text-[8px] font-bold text-lime-ink">
                {owner.initials}
              </span>
              <span className="inline-flex min-w-0 items-center gap-1 truncate text-ink-soft">
                {owner.name}
                {owner.verified && (
                  <ShieldCheck
                    className="size-3 shrink-0 text-success"
                    aria-label="Verified owner"
                  />
                )}
              </span>
            </>
          ) : (
            <span className="text-ink-soft">Owner details on listing</span>
          )}
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 font-mono text-[10px]">
            <Star className="size-3 fill-lime text-ink" aria-hidden="true" />
            {item.rating.toFixed(1)}
            <span className="text-ink-soft">({item.reviewCount})</span>
          </span>
        </div>

        <div className="mt-auto pt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
            {item.rentalTypes.map((type) => RENTAL_LABEL[type]).join(" · ")}
          </p>
          <div className="mt-1.5 flex items-end justify-between gap-2 border-t border-ink/15 pt-3">
            <p>
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                From{" "}
              </span>
              <span className="font-mono text-base font-medium tabular-nums">
                {formatBDT(item.pricePerDay)}
              </span>
              <span className="font-mono text-[10px] text-ink-soft"> /day</span>
            </p>
            <DetailLink
              id={item.id}
              className="inline-flex shrink-0 items-center gap-1 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.08em] transition-colors hover:text-link"
            >
              View details
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </DetailLink>
          </div>
        </div>
      </div>
    </article>
  );
}
