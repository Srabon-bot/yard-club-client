import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import {
  BookingAssurance,
  BookingForm,
} from "@/components/equipment/booking-form";
import { StatusBadge } from "@/components/site/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getEquipmentHolds,
  getNextAvailableDate,
} from "@/lib/data/bookings";
import { getEquipmentById, isAvailableNow } from "@/lib/data/equipment";
import { getOwner } from "@/lib/data/owners";
import { equipment } from "@/lib/mock/equipment";
import { currentUser } from "@/lib/mock/users";
import { TODAY_ISO } from "@/lib/today";
import type { Equipment, Owner } from "@/lib/types";

export function generateStaticParams() {
  return equipment.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/equipment/[id]/book">): Promise<Metadata> {
  const { id } = await params;
  const item = await getEquipmentById(id);
  return { title: item ? `Book ${item.name}` : "Book equipment" };
}

export default async function BookEquipmentPage({
  params,
  searchParams,
}: PageProps<"/equipment/[id]/book">) {
  const { id } = await params;
  const item = await getEquipmentById(id);
  if (!item) notFound();

  const [owner, nextOpen, holds] = await Promise.all([
    getOwner(item.ownerId),
    getNextAvailableDate(item.id),
    getEquipmentHolds(item.id),
  ]);

  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="container-page py-6 lg:py-9">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft"
          >
            <Link href="/equipment" className="transition-colors hover:text-foreground">
              Equipment
            </Link>
            <span aria-hidden="true" className="px-1 text-ink/30">/</span>
            <Link
              href={`/equipment/${item.id}`}
              className="max-w-[34ch] truncate transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
            <span aria-hidden="true" className="px-1 text-ink/30">/</span>
            <span className="text-foreground">Book</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={isAvailableNow(item) ? "green" : "amber"}>
                  {isAvailableNow(item) ? "Available" : "On rent"}
                </StatusBadge>
                <span className="yc-chip">{item.brand} · {item.model}</span>
              </div>
              <h1 className="display-2 mt-3 max-w-[18ch]">Hold the dates.</h1>
              <p className="lede mt-3 max-w-[56ch]">
                {item.name} in {item.location}. Confirm the window and delivery
                details, then pay through Stripe.
              </p>
              <BookingAssurance item={item} />
            </div>

            <Link
              href={`/equipment/${item.id}`}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back to listing
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container-page py-8 lg:py-10">
          <Suspense fallback={<BookingSkeleton />}>
            <BookingBody
              item={item}
              owner={owner}
              holds={holds}
              nextOpen={nextOpen}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function BookingBody({
  item,
  owner,
  holds,
  nextOpen,
  searchParams,
}: {
  item: Equipment;
  owner?: Owner;
  holds: Awaited<ReturnType<typeof getEquipmentHolds>>;
  nextOpen?: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const one = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  return (
    <BookingForm
      item={item}
      owner={owner}
      holds={holds}
      today={TODAY_ISO}
      nextOpen={nextOpen}
      defaults={{
        start: one(params.start),
        end: one(params.end),
        qty: one(params.qty),
      }}
      customer={{ contact: currentUser.phone, address: currentUser.address }}
    />
  );
}

function BookingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]" role="status">
      <span className="sr-only">Loading booking form…</span>
      <div className="grid gap-4 rounded-[10px] border-2 border-ink bg-surface p-5">
        <Skeleton className="h-4 w-32" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-11 rounded-[6px]" />
          ))}
        </div>
        <Skeleton className="mt-4 h-4 w-40" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-11 rounded-[6px]" />
          <Skeleton className="h-11 rounded-[6px]" />
        </div>
        <Skeleton className="h-24 rounded-[6px]" />
      </div>
      <Skeleton className="h-80 rounded-[10px]" />
    </div>
  );
}
