"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  DashboardHeading,
  DataTable,
  EmptyState,
  EquipmentStatusBadge,
  FilterTabs,
} from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/format";
import { equipment as allEquipment } from "@/lib/mock/equipment";
import type { EquipmentStatus } from "@/lib/types";
import { useSearchParams } from "next/navigation";

const OWNER_ID = "rafiul-islam";
const ownerEquipment = allEquipment.filter((e) => e.ownerId === OWNER_ID);

function EquipmentTable({ status }: { status: EquipmentStatus | "all" }) {
  const rows =
    status === "all"
      ? ownerEquipment
      : ownerEquipment.filter((e) => e.status === status);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No equipment"
        description={
          status === "all"
            ? "You have not added any equipment yet."
            : `No ${status} listings.`
        }
        action={
          <Button asChild>
            <Link href="/owner/add-equipment">Add equipment</Link>
          </Button>
        }
      />
    );
  }

  return (
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
      {rows.map((e) => (
        <tr
          key={e.id}
          className="border-b border-ink/10 text-sm last:border-b-0 hover:bg-secondary/40"
        >
          <td className="px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-[6px] border-2 border-ink">
                <Image
                  src={e.image}
                  alt={e.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="font-semibold leading-tight">{e.name}</p>
                <p className="font-mono text-[10px] text-ink-soft">
                  {e.brand} · {e.model}
                </p>
              </div>
            </div>
          </td>
          <td className="px-3 py-3 capitalize text-ink-soft">{e.category}</td>
          <td className="px-3 py-3 text-right font-mono text-[12px] tabular-nums">
            {formatBDT(e.pricePerDay)}
          </td>
          <td className="px-3 py-3 text-center font-mono text-sm">
            {e.quantity}
          </td>
          <td className="px-3 py-3">
            <EquipmentStatusBadge status={e.status} />
          </td>
          <td className="px-3 py-3">
            <div className="flex items-center gap-1.5">
              <Button asChild size="sm" variant="outline">
                <Link href={`/equipment/${e.id}`}>View</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.info("Edit coming soon")}
              >
                <Pencil className="size-3.5" aria-hidden="true" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={() =>
                  toast.error("Delete coming soon", {
                    description: "Confirm dialog will appear here.",
                  })
                }
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

function OwnerEquipmentContent() {
  const sp = useSearchParams();
  const rawStatus = sp.get("status") ?? "all";
  const status = rawStatus as EquipmentStatus | "all";

  const counts = {
    all: ownerEquipment.length,
    approved: ownerEquipment.filter((e) => e.status === "approved").length,
    pending: ownerEquipment.filter((e) => e.status === "pending").length,
    rejected: ownerEquipment.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="grid gap-6">
      <DashboardHeading
        eyebrow="Owner"
        title="Manage the fleet"
        description="Every listing with status, rate and booking actions."
        actions={
          <Button asChild>
            <Link href="/owner/add-equipment">Add equipment</Link>
          </Button>
        }
      />

      <FilterTabs
        options={[
          { value: "all", label: "All", count: counts.all },
          { value: "approved", label: "Approved", count: counts.approved },
          { value: "pending", label: "Pending", count: counts.pending },
          { value: "rejected", label: "Rejected", count: counts.rejected },
        ]}
        current={status}
        basePath="/owner/equipment"
        label="Filter by status"
      />

      <EquipmentTable status={status} />
    </div>
  );
}

export default function OwnerEquipmentPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<div className="p-8 font-mono text-xs">Loading fleet...</div>}>
        <OwnerEquipmentContent />
      </Suspense>
    </DashboardShell>
  );
}
