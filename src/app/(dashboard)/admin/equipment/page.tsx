import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { EquipmentModerationActions } from "@/components/dashboard/equipment-moderation-actions";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  DashboardHeading,
  DataTable,
  EmptyState,
  EquipmentStatusBadge,
  FilterTabs,
  TablePager,
} from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/api.server";
import { listAllEquipment } from "@/lib/data/equipment";
import { formatBDT } from "@/lib/format";
import { bypassImageOptimization } from "@/lib/images";
import { oneOf, positiveInt } from "@/lib/search-params";

export const metadata: Metadata = { title: "Equipment approvals" };

const STATUSES = ["all", "approved", "pending", "rejected"] as const;
const PER_PAGE = 10;

async function AdminEquipmentContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = oneOf(sp.status ?? "all", STATUSES, "all");
  const q = typeof sp.q === "string" ? sp.q : "";
  const page = positiveInt(sp.page);

  const result = await listAllEquipment({
    status,
    q,
    page,
    perPage: PER_PAGE,
  });

  const statusParam = status === "all" ? undefined : status;
  const qParam = q || undefined;

  return (
    <div className="grid gap-6">
      <DashboardHeading
        eyebrow="Admin"
        title="Equipment approvals"
        description="Review, moderate and feature every listing on the platform."
      />

      <form method="GET" className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, brand or location…"
          className="h-10 flex-1 rounded-[6px] border-2 border-ink bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-lime focus:ring-offset-1"
        />
        <Button type="submit" variant="outline" className="h-10">
          Search
        </Button>
      </form>

      <FilterTabs
        options={[
          { value: "all", label: "All", count: result.counts.all },
          { value: "approved", label: "Approved", count: result.counts.approved },
          { value: "pending", label: "Pending", count: result.counts.pending },
          { value: "rejected", label: "Rejected", count: result.counts.rejected },
        ]}
        current={status}
        basePath="/admin/equipment"
        params={{ q: qParam }}
        label="Filter by status"
      />

      {result.items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No listings found"
          description={q ? `No results for "${q}".` : `No ${status} listings.`}
        />
      ) : (
        <DataTable
          minWidth={1060}
          head={[
            { label: "Equipment" },
            { label: "Owner" },
            { label: "Category" },
            { label: "Price / day", align: "right" },
            { label: "Status" },
            { label: "Actions" },
          ]}
          footer={
            <TablePager
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              perPage={PER_PAGE}
              basePath="/admin/equipment"
              params={{ status: statusParam, q: qParam }}
              noun="listings"
            />
          }
        >
          {result.items.map((item) => (
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
                    <Link
                      href={`/equipment/${item.slug ?? item.id}`}
                      className="font-semibold leading-tight hover:text-primary hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="font-mono text-[10px] text-ink-soft">
                      {item.brand} {item.model}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 font-mono text-[11px] text-ink-soft">
                {item.owner?.name ?? item.ownerId}
              </td>
              <td className="px-3 py-3 capitalize text-ink-soft">
                {item.category}
              </td>
              <td className="px-3 py-3 text-right font-mono text-[12px] tabular-nums">
                {formatBDT(item.pricePerDay)}
              </td>
              <td className="px-3 py-3">
                <EquipmentStatusBadge status={item.status} />
              </td>
              <td className="px-3 py-3">
                <EquipmentModerationActions
                  id={item.id}
                  name={item.name}
                  status={item.status}
                  featured={item.featured}
                />
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}

export default async function AdminEquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireRole("admin", "/admin/equipment");
  return (
    <DashboardShell>
      <Suspense fallback={<div className="p-8 font-mono text-xs">Loading approvals...</div>}>
        <AdminEquipmentContent searchParams={searchParams} />
      </Suspense>
    </DashboardShell>
  );
}
