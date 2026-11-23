import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardCheck,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { AvailabilityCalendar } from "@/components/equipment/availability-calendar";
import { BookingPanel } from "@/components/equipment/booking-panel";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { FavoriteButton } from "@/components/equipment/favorite-button";
import { MobileBookingBar } from "@/components/equipment/mobile-booking-bar";
import { StarRating } from "@/components/site/star-rating";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/api.server";
import { getCategory } from "@/lib/data/categories";
import {
  getEquipmentById,
  getEquipmentDetail,
  getRelatedEquipment,
  isAvailableNow,
} from "@/lib/data/equipment";
import { listFavorites } from "@/lib/data/favorites";
import { getProfile } from "@/lib/data/users";
import { formatBDT, formatDate, formatRating, formatShortDate } from "@/lib/format";
import { bypassImageOptimization } from "@/lib/images";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/equipment/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = await getEquipmentById(id);
  return {
    title: item ? item.name : "Equipment",
    description: item?.description,
  };
}

const RENTAL_LABEL = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
} as const;

export default async function EquipmentDetailPage({
  params,
}: PageProps<"/equipment/[id]">) {
  const { id } = await params;

  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/equipment/${id}`)}`);
  }

  const detail = await getEquipmentDetail(id);
  if (!detail) notFound();

  const { item, owner, holds, nextAvailable, today } = detail;

  const [categoryResult, relatedResult, favoritesResult, profileResult] =
    await Promise.allSettled([
      getCategory(item.category),
      getRelatedEquipment(item.id, 3),
      listFavorites(),
      getProfile(),
    ]);

  const category = categoryResult.status === "fulfilled" ? categoryResult.value : null;
  const related = relatedResult.status === "fulfilled" ? relatedResult.value : [];
  const favorites = favoritesResult.status === "fulfilled" ? favoritesResult.value : [];
  const profile = profileResult.status === "fulfilled" ? profileResult.value : null;

  const booking = {
    owner: owner ?? undefined,
    holds,
    customer: { contact: profile?.phone ?? "", address: profile?.address ?? "" },
  };
  const available = isAvailableNow(item);
  const categoryName = category?.name ?? "Equipment";
  const itemReviews = detail.reviews.slice(0, 2);
  const saved = favorites.some((favorite) => favorite.equipmentId === item.id);
  const nextOpen = nextAvailable && nextAvailable > today ? nextAvailable : undefined;

  const specs: [string, string][] = [
    ["Brand", item.brand],
    ["Model", item.model],
    ["Category", categoryName],
    ["Condition", `${item.condition}-grade`],
    ["Quantity", `${item.quantity} in the yard`],
    ["Location", item.location],
    ["Rental", item.rentalTypes.map((type) => RENTAL_LABEL[type]).join(" · ")],
    ["Listed", formatDate(item.createdAt)],
  ];

  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="container-page py-6 lg:py-9">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span aria-hidden="true" className="px-1 text-ink/30">/</span>
            <Link
              href="/equipment"
              className="transition-colors hover:text-foreground"
            >
              Equipment
            </Link>
            <span aria-hidden="true" className="px-1 text-ink/30">/</span>
            <span className="truncate text-foreground">{item.name}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/equipment?category=${item.category}`}>
                  <StatusBadge tone="neutral">{categoryName}</StatusBadge>
                </Link>
                <StatusBadge tone={available ? "green" : "amber"}>
                  {available ? "Available now" : "On rent"}
                </StatusBadge>
                <span className="yc-chip">{item.condition}-grade</span>
              </div>

              <h1 className="display-2 mt-3 max-w-[22ch]">{item.name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
                <span>
                  {item.brand} · {item.model}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" aria-hidden="true" />
                  {item.location}
                </span>
                <span>Listed {formatDate(item.createdAt)}</span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <StarRating value={item.rating} />
                <span className="font-mono text-xs tabular-nums">
                  {formatRating(item.rating)}
                </span>
                <span className="text-xs text-ink-soft">
                  ({item.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="shrink-0 sm:text-right">
              <p className="eyebrow">Owner rate</p>
              <p className="mt-1 font-mono text-3xl font-medium tabular-nums">
                {formatBDT(item.pricePerDay)}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                per day · BDT
              </p>
              <div className="mt-3 sm:flex sm:justify-end">
                <FavoriteButton
                  equipmentId={item.id}
                  initialSaved={saved}
                  name={item.name}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="container-page py-8 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
            <div className="min-w-0">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] border-2 border-ink bg-secondary">
                <Image
                  src={item.image}
                  alt={`${item.name} in ${item.location}`}
                  fill
                  unoptimized={bypassImageOptimization(item.image)}
                  priority
                  sizes="(min-width: 1024px) 68vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#060605]/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#f9f9f6] backdrop-blur-sm">
                  <MapPin className="size-3" aria-hidden="true" />
                  {item.location}
                </span>
              </div>

              <div className="mt-5 lg:hidden">
                <BookingPanel
                  item={item}
                  nextOpen={nextOpen}
                  today={today}
                  available={available}
                  anchor="book-mobile"
                  booking={booking}
                />
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-2 border-ink bg-ink/15 sm:grid-cols-4">
                {specs.map(([label, value]) => (
                  <div key={label} className="bg-surface p-3">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold leading-snug">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 grid gap-7">
                <div>
                  <p className="eyebrow">The brief</p>
                  <h2 className="display-3 mt-1.5">What you’re renting.</h2>
                  <p className="mt-3 max-w-[72ch] text-sm leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                </div>

                <div>
                  <p className="eyebrow">In the case / on the machine</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {item.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 rounded-[6px] border border-ink/15 bg-surface px-3 py-2 text-sm"
                      >
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-success"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[10px] border-2 border-ink bg-secondary/50 p-4 sm:p-5">
                  <p className="eyebrow">Rental terms</p>
                  <p className="mt-2 max-w-[72ch] text-sm leading-relaxed text-ink-soft">
                    {item.terms}
                  </p>
                </div>
              </div>

              <div className="mt-9">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="eyebrow">Availability</p>
                    <h2 className="display-3 mt-1.5">When it’s free.</h2>
                  </div>
                  {nextOpen ? (
                    <StatusBadge tone="green">
                      Next open {formatShortDate(nextOpen)}
                    </StatusBadge>
                  ) : (
                    <StatusBadge tone="green">Free to book</StatusBadge>
                  )}
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,320px)_1fr] sm:items-start">
                  <AvailabilityCalendar
                    holds={holds}
                    nextOpen={nextOpen}
                    today={today}
                  />
                  <div className="rounded-[10px] border border-ink/15 bg-surface p-4">
                    <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em]">
                      <ClipboardCheck
                        className="size-4 text-lime-hover"
                        aria-hidden="true"
                      />
                      Handover sheet
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      The owner logs condition, quantity and accessories at
                      pickup. You sign the same sheet at return, so the deposit
                      is settled on facts rather than a phone call.
                    </p>
                    <p className="mt-3 border-t border-ink/15 pt-3 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                      {item.quantity} unit{item.quantity === 1 ? "" : "s"} on this
                      listing · {item.rentalTypes.join(" / ")} rates
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-9">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow">Reviews</p>
                    <h2 className="display-3 mt-1.5">What renters said.</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-medium tabular-nums">
                      {formatRating(item.rating)}
                    </span>
                    <StarRating value={item.rating} size="md" />
                    <span className="text-xs text-ink-soft">
                      ({item.reviewCount})
                    </span>
                  </div>
                </div>

                {itemReviews.length > 0 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {itemReviews.map((review) => (
                      <article
                        key={review.id}
                        className="flex h-full flex-col rounded-[10px] border-2 border-ink bg-surface p-4"
                      >
                        <StarRating value={review.rating} />
                        <blockquote className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-soft">
                          “{review.comment}”
                        </blockquote>
                        <div className="mt-4 flex items-center gap-2.5 border-t border-ink/15 pt-3">
                          <span className="grid size-8 place-items-center rounded-full border-2 border-ink bg-lime-soft font-mono text-[9px] font-bold text-lime-ink">
                            {review.initials}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold">
                              {review.name}
                            </p>
                            <p className="truncate font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
                              {review.location} · {formatDate(review.date)}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-[10px] border border-ink/15 bg-surface p-4 text-sm text-ink-soft">
                    No written reviews on this listing yet. The owner has a {formatRating(item.rating)}
                    {" "}average across {item.reviewCount} completed rentals.
                  </p>
                )}
              </div>
            </div>

            <aside className="lg:sticky lg:top-[92px]">
              <div className="grid gap-4">
                <div className="hidden lg:block">
                  <BookingPanel
                    item={item}
                    nextOpen={nextOpen}
                    today={today}
                    available={available}
                    booking={booking}
                  />
                </div>

                {owner && (
                  <section className="rounded-[10px] border-2 border-ink bg-surface p-4 shadow-offset-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="eyebrow">The owner</p>
                      {owner.verified && (
                        <StatusBadge tone="green">Verified</StatusBadge>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-[8px] border-2 border-ink bg-lime font-mono text-sm font-bold text-primary-foreground">
                        {owner.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-heading text-lg font-extrabold tracking-[-0.03em]">
                          {owner.name}
                        </p>
                        <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
                          {owner.location}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                      {owner.bio}
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-ink/15 pt-3">
                      <div>
                        <dt className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                          Rating
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs tabular-nums">
                          {owner.rating != null ? owner.rating.toFixed(1) : "New"} {owner.reviewCount != null ? `(${owner.reviewCount})` : ""}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                          Replies
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs">
                          {owner.responseTime || "under 30 min"}
                        </dd>
                      </div>
                    </dl>
                    <Link
                      href={`/owners/${owner.id}`}
                      className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
                    >
                      Full owner profile
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    </Link>
                  </section>
                )}

                <div className="rounded-[10px] border border-ink/20 bg-secondary/40 p-4">
                  <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em]">
                    <ShieldCheck className="size-4 text-success" aria-hidden="true" />
                    Request first
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                    Send your dates and quantity, then let the owner confirm.
                    The quote and handover details stay with the booking.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-b-2 border-ink bg-surface">
          <div className="container-page py-10 lg:py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">More in {categoryName}</p>
                <h2 className="display-2 mt-2 max-w-[18ch]">
                  Keep the same crew.
                </h2>
              </div>
              <Link
                href={`/equipment?category=${item.category}`}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
              >
                All {categoryName.toLowerCase()} equipment
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((entry) => (
                <EquipmentCard
                  key={entry.id}
                  item={entry}
                  owner={entry.owner ?? undefined}
                  categoryName={categoryName}
                  available={isAvailableNow(entry)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-lime text-[#060605]">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em]">
            Questions before you book? The owner replies {owner?.responseTime ?? "the same day"}.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              className="border-[#060605] bg-[#060605] text-[#f9f9f6] shadow-[3px_3px_0_rgba(6,6,5,0.25)] hover:bg-[#292925] hover:text-[#f9f9f6]"
            >
              <Link href="/contact">
                Ask about this listing
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="h-16 lg:hidden" aria-hidden="true" />
      <MobileBookingBar item={item} />
    </>
  );
}
