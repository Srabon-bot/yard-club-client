"use client";

import { Suspense } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
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
import { bypassImageOptimization } from "@/lib/images";
import { equipment as allEquipment } from "@/lib/mock/equipment";
import { oneOf } from "@/lib/search-params";
import { useSearchParams } from "next/navigation";

const STATUSES = ["all", "approved", "pending", "rejected"] as const;

const counts = {
  all: allEquipment.length,
  approved: allEquipment.filter((e) => e.status === "approved").length,
  pending: allEquipment.filter((e) => e.status === "pending").length,
  rejected: allEquipment.filter((e) => e.status === "rejected").length,
};

function AdminEquipmentContent() {
  const sp = useSearchParams();
  const rawStatus = sp.get("status") ?? "all";
  const status = oneOf(rawStatus, STATUSES, "all");

  const rows =
    status === "all"
      ? allEquipment
      : allEquipment.filter((e) => e.status === status);

  return (
    <div className="grid gap-6">
      <DashboardHeading
        eyebrow="Admin"
        title="Equipment approvals"
        description="Approve, reject or remove any listing on the platform."
      />

      <FilterTabs
        options={[
          { value: "all", label: "All", count: counts.all },
          { value: "approved", label: "Approved", count: counts.approved },
          { value: "pending", label: "Pending", count: counts.pending },
          { value: "rejected", label: "Rejected", count: counts.rejected },
        ]}
        current={status}
        basePath="/admin/equipment"
        label="Filter by status"
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No equipment"
          description={`No ${status} listings.`}
        />
      ) : (
        <DataTable
          minWidth={900}
          head={[
            { label: "Equipment" },
            { label: "Owner" },
            { label: "Category" },
            { label: "Price / day", align: "right" },
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
                      unoptimized={bypassImageOptimization(e.image)}
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold leading-tight">{e.name}</p>
                    <p className="font-mono text-[10px] text-ink-soft">
                      {e.brand} {e.model}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 font-mono text-[11px] text-ink-soft">
                {e.ownerId}
              </td>
              <td className="px-3 py-3 capitalize text-ink-soft">
                {e.category}
              </td>
              <td className="px-3 py-3 text-right font-mono text-[12px] tabular-nums">
                {formatBDT(e.pricePerDay)}
              </td>
              <td className="px-3 py-3">
                <EquipmentStatusBadge status={e.status} />
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    onClick={() =>
                      toast.success(`Approved: ${e.name}`)
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.error(`Rejected: ${e.name}`)
                    }
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() =>
                      toast.error(`Deleted: ${e.name}`, {
                        description: "This action cannot be undone.",
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}

export default function AdminEquipmentPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<div className="p-8 font-mono text-xs">Loading approvals...</div>}>
        <AdminEquipmentContent />
      </Suspense>
    </DashboardShell>
  );
}
