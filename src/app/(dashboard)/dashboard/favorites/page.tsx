import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RemoveFavoriteButton } from "@/components/dashboard/remove-favorite-button";
import {
  DashboardHeading,
  DataTable,
  EmptyState,
} from "@/components/dashboard/parts";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/api.server";
import { isAvailableNow } from "@/lib/data/equipment";
import { listFavorites } from "@/lib/data/favorites";
import { formatBDT } from "@/lib/format";
import { bypassImageOptimization } from "@/lib/images";
import type { Equipment } from "@/lib/types";

export const metadata: Metadata = { title: "Favourites" };

export default async function CustomerFavouritesPage() {
  await requireRole("customer", "/dashboard/favorites");
  const favorites = await listFavorites();
  const rows = favorites
    .filter((favorite): favorite is typeof favorite & { equipment: Equipment } =>
      Boolean(favorite.equipment),
    )
    .map((favorite) => ({ id: favorite.id, item: favorite.equipment }));

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Customer"
          title="Saved for the next job"
          description="Equipment you starred. Availability and rates come straight from the live catalogue."
        />

        {rows.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            description="Star a listing to keep it here for quick access."
            action={
              <Button asChild>
                <Link href="/equipment">Browse equipment</Link>
              </Button>
            }
          />
        ) : (
          <DataTable
            minWidth={780}
            head={[
              { label: "Equipment" },
              { label: "Category" },
              { label: "Price / day", align: "right" },
              { label: "Availability" },
              { label: "Actions" },
            ]}
          >
            {rows.map(({ id, item }) => {
              const available = isAvailableNow(item);
              return (
                <tr
                  key={id}
                  className="border-b border-ink/10 text-sm last:border-b-0 hover:bg-secondary/40"
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-[6px] border-2 border-ink">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized={bypassImageOptimization(item.image)}
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <span className="font-semibold leading-tight">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 capitalize text-ink-soft">{item.category}</td>
                  <td className="px-3 py-3 text-right font-mono text-[12px] tabular-nums">
                    {formatBDT(item.pricePerDay)}
                  </td>
                  <td className="px-3 py-3">
                    {available ? (
                      <StatusBadge tone="green">Available</StatusBadge>
                    ) : (
                      <StatusBadge tone="amber">On rent</StatusBadge>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm">
                        <Link href={`/equipment/${item.slug ?? item.id}`}>View</Link>
                      </Button>
                      <RemoveFavoriteButton equipmentId={item.id} name={item.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </DataTable>
        )}
      </div>
    </DashboardShell>
  );
}
