import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/format";
import { bypassImageOptimization } from "@/lib/images";
import { equipment as allEquipment } from "@/lib/mock/equipment";
import { isAvailableNow } from "@/lib/data/equipment";
import { StatusBadge } from "@/components/site/status-badge";

export const metadata: Metadata = {
  title: "Compare Equipment Side by Side",
  description:
    "Compare specifications, rental rates, condition, and availability for up to 3 pieces of equipment on Yardclub.",
};

async function CompareContent({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const sp = await searchParams;
  const idsString = typeof sp.ids === "string" ? sp.ids : "";
  const ids = idsString ? idsString.split(",").filter(Boolean) : [];

  const items = ids
    .map((id) => allEquipment.find((e) => e.id === id))
    .filter((e): e is (typeof allEquipment)[number] => Boolean(e));

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <p className="eyebrow">Compare Tray Empty</p>
        <h1 className="display-2 mt-2">No equipment selected to compare</h1>
        <p className="mx-auto mt-4 max-w-[46ch] text-sm text-ink-soft">
          Add up to 3 listings to your compare tray from the catalogue or detail
          pages to view specifications side-by-side.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/equipment">
              <ArrowLeft className="size-4" />
              Browse Catalogue
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const specRows = [
    { label: "Category", render: (item: (typeof items)[0]) => item.category },
    { label: "Brand", render: (item: (typeof items)[0]) => item.brand },
    { label: "Model", render: (item: (typeof items)[0]) => item.model },
    {
      label: "Condition",
      render: (item: (typeof items)[0]) => `${item.condition}-grade`,
    },
    { label: "Location", render: (item: (typeof items)[0]) => item.location },
    {
      label: "Available Units",
      render: (item: (typeof items)[0]) => `${item.quantity} in yard`,
    },
    {
      label: "Rental Options",
      render: (item: (typeof items)[0]) => item.rentalTypes.join(", "),
    },
  ];

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-6">
        <div>
          <p className="eyebrow">Direct Comparison</p>
          <h1 className="display-2 mt-1">Side-by-Side Equipment Specs</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Comparing {items.length} selected machine{items.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/equipment">
            <ArrowLeft className="size-4" />
            Back to catalogue
          </Link>
        </Button>
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink">
              <th className="w-1/4 p-4 font-mono text-xs uppercase tracking-wider text-ink-soft">
                Specification
              </th>
              {items.map((item) => (
                <th key={item.id} className="p-4 align-top">
                  <div className="relative mb-3 h-36 w-full overflow-hidden rounded-[8px] border-2 border-ink bg-secondary">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized={bypassImageOptimization(item.image)}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-heading text-base font-bold">
                    {item.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold tabular-nums">
                      {formatBDT(item.pricePerDay)}/day
                    </span>
                    <StatusBadge
                      tone={isAvailableNow(item) ? "green" : "amber"}
                    >
                      {isAvailableNow(item) ? "Available" : "On rent"}
                    </StatusBadge>
                  </div>
                  <div className="mt-4">
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/equipment/${item.id}`}>View Details</Link>
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink/10">
            {specRows.map((spec) => (
              <tr key={spec.label} className="hover:bg-secondary/30">
                <td className="p-4 font-semibold text-sm">{spec.label}</td>
                {items.map((item) => (
                  <td
                    key={item.id}
                    className="p-4 font-mono text-xs capitalize text-ink"
                  >
                    {spec.render(item)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="hover:bg-secondary/30">
              <td className="p-4 font-semibold text-sm align-top">Key Features</td>
              {items.map((item) => (
                <td key={item.id} className="p-4 align-top">
                  <ul className="space-y-1.5 text-xs text-ink-soft">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5">
                        <Check className="size-3 text-lime" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center font-mono text-sm">Loading comparison matrix...</div>}>
      <CompareContent searchParams={searchParams} />
    </Suspense>
  );
}
