import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BookingAssurance, BookingForm } from "@/components/equipment/booking-form";
import { StatusBadge } from "@/components/site/status-badge";
import { getSessionUser } from "@/lib/api.server";
import { getEquipmentById, getEquipmentDetail, isAvailableNow } from "@/lib/data/equipment";
import { getProfile } from "@/lib/data/users";

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
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/equipment/${id}/book`)}`);
  }
  if (user.role !== "customer") {
    redirect(`/equipment/${id}`);
  }

  const [detail, profile, query] = await Promise.all([
    getEquipmentDetail(id),
    getProfile(),
    searchParams,
  ]);

  if (!detail) notFound();

  const { item, owner, holds, nextAvailable, today } = detail;
  const nextOpen = nextAvailable && nextAvailable > today ? nextAvailable : undefined;
  const one = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

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
                {item.name} in {item.location}. Confirm the window and delivery details, then
                send a request to the owner. No payment is taken yet — once the owner
                confirms, you will pay securely through Stripe.
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
          <BookingForm
            item={item}
            owner={owner ?? undefined}
            holds={holds}
            today={today}
            nextOpen={nextOpen}
            defaults={{
              start: one(query.start),
              end: one(query.end),
              qty: one(query.qty),
            }}
            customer={{ contact: profile.phone, address: profile.address }}
          />
        </div>
      </section>
    </>
  );
}
