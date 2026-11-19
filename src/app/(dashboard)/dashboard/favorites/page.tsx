"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  DashboardHeading,
  DataTable,
  EmptyState,
} from "@/components/dashboard/parts";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import { isAvailableNow } from "@/lib/data/equipment";
import { formatBDT } from "@/lib/format";
import { favorites } from "@/lib/mock/favorites";
import { equipment as allEquipment } from "@/lib/mock/equipment";
import type { Equipment } from "@/lib/types";

type FavRow = { id: string; item: Equipment };

const favRows: FavRow[] = favorites
  .filter((f) => f.customerId === "u-01")
  .map((f) => ({
    id: f.id,
    item: allEquipment.find((e) => e.id === f.equipmentId)!,
  }))
  .filter((r) => Boolean(r.item));

export default function CustomerFavouritesPage() {
  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Customer"
          title="Saved for the next job"
          description="Equipment you starred. Availability updates in real time."
        />

        {favRows.length === 0 ? (
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
            {favRows.map(({ id, item }) => {
              const avail = isAvailableNow(item);
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
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <span className="font-semibold leading-tight">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 capitalize text-ink-soft">
                    {item.category}
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-[12px] tabular-nums">
                    {formatBDT(item.pricePerDay)}
                  </td>
                  <td className="px-3 py-3">
                    {avail ? (
                      <StatusBadge tone="green">Available</StatusBadge>
                    ) : (
                      <StatusBadge tone="amber">On rent</StatusBadge>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm">
                        <Link href={`/equipment/${item.id}`}>View</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toast.success("Removed from favourites", {
                            description: item.name,
                          })
                        }
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Remove
                      </Button>
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
