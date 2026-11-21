"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DataTable,
  EquipmentStatusBadge,
} from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteEquipmentAction } from "@/lib/actions/equipment";
import { formatBDT } from "@/lib/format";
import { bypassImageOptimization } from "@/lib/images";
import type { Equipment } from "@/lib/types";

export type OwnerEquipment = Equipment & {
  ownerSlug?: string;
  slug?: string;
};

export function OwnerEquipmentTable({ items }: { items: OwnerEquipment[] }) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<OwnerEquipment | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    setDeleting(true);
    try {
      const result = await deleteEquipmentAction(pendingDelete.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Listing deleted", {
        description: `${result.name} was removed from your equipment.`,
      });
      setPendingDelete(null);
      router.refresh();
    } catch {
      toast.error("Could not delete the listing. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DataTable
        minWidth={860}
        head={[
          { label: "Equipment" },
          { label: "Category" },
          { label: "Price / day", align: "right" },
          { label: "Qty", align: "center" },
          { label: "Status" },
          { label: "Actions" },
        ]}
      >
        {items.map((item) => (
          <tr
            key={item.id}
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
                <div>
                  <p className="font-semibold leading-tight">{item.name}</p>
                  <p className="font-mono text-[10px] text-ink-soft">
                    {item.brand} · {item.model}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-3 py-3 capitalize text-ink-soft">
              {item.category}
            </td>
            <td className="px-3 py-3 text-right font-mono text-[12px] tabular-nums">
              {formatBDT(item.pricePerDay)}
            </td>
            <td className="px-3 py-3 text-center font-mono text-sm">
              {item.quantity}
            </td>
            <td className="px-3 py-3">
              <EquipmentStatusBadge status={item.status} />
            </td>
            <td className="px-3 py-3">
              <div className="flex items-center gap-1.5">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/equipment/${item.slug ?? item.id}`}>View</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/owner/equipment/${item.id}/edit`}
                    aria-label={`Edit ${item.name}`}
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => setPendingDelete(item)}
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <DialogContent className="border-2 border-ink bg-surface shadow-offset-sm">
          <DialogHeader>
            <DialogTitle>Delete this listing?</DialogTitle>
            <DialogDescription>
              <strong>{pendingDelete?.name}</strong> will be removed from the
              catalogue and from any customer favourites. Past bookings keep
              their history. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingDelete(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Deleting…
                </>
              ) : (
                "Delete listing"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
