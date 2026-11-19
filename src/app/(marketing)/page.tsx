import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ClipboardCheck,
  MapPin,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import {
  HeroIn,
  HeroMedia,
  SectionIn,
  StaggerCard,
  StaggerGrid,
  WordReveal,
} from "@/components/motion/home-motion";
import { StarRating } from "@/components/site/star-rating";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import { getAdminAnalytics } from "@/lib/data/analytics";
import { getNextAvailableDate } from "@/lib/data/bookings";
import { getFeaturedEquipment, isAvailableNow } from "@/lib/data/equipment";
import { listCategories } from "@/lib/data/categories";
import { listOwners } from "@/lib/data/owners";
import { getFeaturedReviews } from "@/lib/data/reviews";
import { formatBDT, formatShortDate } from "@/lib/format";

export const metadata: Metadata = {
  title: {
    absolute: "Yardclub — equipment rental in Dhaka and Chattogram",
  },
  description:
    "Rent excavators, cinema kits, trailers, generators and farm equipment from verified owners in Dhaka and Chattogram. Daily and weekly rates in BDT.",
};

const ticker = [
  "CAT 320 booked for a foundation job in Bashundhara",
  "Sony FX6 back in the kit on 4 December",
  "250kVA generator booked for a launch in Gulshan",
  "10m scissor lift open in Tejgaon",
  "Massey Ferguson 385 free from 28 November",
  "10m pagoda tent awaiting approval",
  "14ft trailer returned this morning",
];

const benefits = [
  {
    icon: Wallet,
    title: "Owner set rates",
    copy: "The number on the listing is the owner's rate. No broker markup and no fee invented at pickup.",
  },
  {
    icon: ClipboardCheck,
    title: "Checked at both ends",
    copy: "Condition, quantity and accessories are logged at handover. Both sides sign the same sheet.",
  },
  {
    icon: CalendarDays,
    title: "Daily, weekly, monthly",
    copy: "Book a day when the job is small, a week when it is not. Extend from your dashboard if it runs long.",
  },
  {
    icon: ShieldCheck,
    title: "Payment on record",
    copy: "Checkout runs through Stripe. The payment and deposit stay attached to the booking, not a message thread.",
  },
] as const;

const steps = [
  {
    title: "Find the machine",
    copy: "Filter by category, city and rate. Every listing carries the owner's response time and review history.",
  },
  {
    title: "Hold the dates",
    copy: "Choose start and end dates, quantity and delivery address. The total updates before you reach checkout.",
  },
  {
    title: "Inspect and go",
    copy: "Meet the owner, walk the checklist and take the keys. Return the same way, with the same sheet.",
  },
] as const;

export default async function HomePage() {
  const [featured, categories, owners, reviews, analytics] = await Promise.all([
    getFeaturedEquipment(6),
    listCategories(),
    listOwners(),
    getFeaturedReviews(4),
    getAdminAnalytics(),
  ]);

  const topOwners = [...owners]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 4);

  /* The hero photo is the 20-tonne CAT, so the card has to be the CAT.
     Keep the pairing explicit instead of relying on rating order. */
  const heroItem =
    featured.find((item) => item.id === "cat-320-excavator") ?? featured[0];
  const heroOwner = owners.find((owner) => owner.id === heroItem.ownerId);
  const heroNextOpen = await getNextAvailableDate(heroItem.id);

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--ink) 15%, transparent) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage: "linear-gradient(to bottom, black, transparent 78%)",
          }}
        />
        <div className="container-page relative py-10 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <HeroIn>
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusBadge tone="lime">Dhaka · Chattogram</StatusBadge>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                  {analytics.totals.equipment} machines listed today
                </span>
              </div>

              <h1 className="display-1 mt-5 max-w-[13ch]">
                Rent the gear.
                <br />
                Keep the <span className="yc-marker">capital.</span>
              </h1>

              <p className="lede mt-5 max-w-[54ch]">
                Excavators, cinema bodies, trailers and generators from verified
                owners in Dhaka and Chattogram. Book by the day or week, with a
                handover checklist at pickup and return.
              </p>

              <form
                action="/equipment"
                method="get"
                className="mt-7 flex flex-col gap-2 sm:flex-row"
              >
                <div className="relative flex-1">
                  <label htmlFor="hero-search" className="sr-only">
                    Search equipment
                  </label>
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
                    aria-hidden="true"
                  />
                  <input
                    id="hero-search"
                    name="q"
                    type="search"
                    placeholder="Excavator, cinema body, generator…"
                    className="h-12 w-full rounded-[6px] border-2 border-ink bg-surface pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-ink-soft/70 focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-ring/25"
                  />
                </div>
                <Button type="submit" className="h-12 shrink-0 px-6">
                  Search the yard
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </form>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
                <span>Popular</span>
                {[
                  ["Excavator", "/equipment?q=Excavator"],
                  ["Cinema", "/equipment?q=Cinema"],
                  ["Generator", "/equipment?q=Generator"],
                  ["Tractor", "/equipment?q=Tractor"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-full border border-ink/20 px-2.5 py-1 transition-colors hover:border-ink hover:bg-secondary"
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t-2 border-ink pt-5">
                <div className="flex items-center">
                  {topOwners.slice(0, 3).map((owner, index) => (
                    <span
                      key={owner.id}
                      className={`grid size-8 place-items-center rounded-full border-2 border-ink bg-lime-soft font-mono text-[9px] font-bold text-lime-ink ${
                        index > 0 ? "-ml-2" : ""
                      }`}
                    >
                      {owner.initials}
                    </span>
                  ))}
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
                    +{owners.length - 3} owners
                  </span>
                </div>
                <p className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                  <StarRating value={4.8} />
                  <span className="font-mono text-[11px]">4.8</span>
                  <span>from {analytics.totals.completedRentals} completed rentals</span>
                </p>
              </div>
            </HeroIn>

            <HeroMedia className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border-2 border-ink lg:aspect-[5/6]">
                <Image
                  src="/images/hero-yard.jpg"
                  alt="An excavator working on a construction site in Dhaka"
                  fill
                  priority
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#060605]/55 via-transparent to-[#060605]/10" />

                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#060605]/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#f9f9f6] backdrop-blur-sm">
                  <i className="size-1.5 rounded-full bg-lime" aria-hidden="true" />
                  On site in Mirpur
                </span>

                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-lime px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#060605]">
                  <ShieldCheck className="size-3" aria-hidden="true" />
                  Verified owners
                </span>

                {heroItem && (
                  <div className="absolute inset-x-3 bottom-3 rounded-[8px] border-2 border-ink bg-surface p-3.5 shadow-offset-sm sm:inset-x-auto sm:left-3 sm:max-w-[320px]">
                    <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                      <span>
                        {heroNextOpen
                          ? `Next open · ${formatShortDate(heroNextOpen)}`
                          : "Free today"}
                      </span>
                      <StatusBadge
                        tone={heroNextOpen ? "amber" : "green"}
                        dot={false}
                      >
                        {heroNextOpen ? "On rent" : "Available"}
                      </StatusBadge>
                    </div>
                    <p className="mt-1.5 font-heading text-lg font-extrabold leading-tight tracking-[-0.03em]">
                      {heroItem.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3 border-t border-ink/15 pt-2">
                      <span className="font-mono text-sm tabular-nums">
                        {formatBDT(heroItem.pricePerDay)}
                        <span className="text-[10px] text-ink-soft"> /day</span>
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                        {heroOwner?.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </HeroMedia>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b-2 border-ink bg-lime text-[#060605]">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center"
            >
              {ticker.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-5 whitespace-nowrap px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.08em]"
                >
                  <i className="size-1.5 shrink-0 rounded-full bg-[#060605]" aria-hidden="true" />
                  {item}
                  <span aria-hidden="true" className="text-black/35">
                    /
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="border-b-2 border-ink">
        <div className="container-page py-14 lg:py-20">
          <SectionIn className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">Featured this week</p>
              <h2 className="display-2 mt-2 max-w-[18ch]">
                Six machines with open dates.
              </h2>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <p className="max-w-[38ch] text-sm leading-relaxed text-ink-soft sm:text-right">
                A rotating pick from the yard. Every listing is checked by an
                admin before it goes live.
              </p>
              <Link
                href="/equipment"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
              >
                All {analytics.totals.equipment} machines
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </SectionIn>

          <StaggerGrid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item, index) => (
              <StaggerCard key={item.id} className="h-full">
                <EquipmentCard
                  item={item}
                  owner={owners.find((owner) => owner.id === item.ownerId)}
                  categoryName={
                    categories.find((category) => category.id === item.category)
                      ?.name ?? "Equipment"
                  }
                  priority={index === 0}
                  available={isAvailableNow(item)}
                />
              </StaggerCard>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section className="border-b-2 border-ink bg-surface">
        <div className="container-page py-14 lg:py-20">
          <SectionIn className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">Browse by category</p>
              <h2 className="display-2 mt-2 max-w-[18ch]">
                Start with the work, not the aisle.
              </h2>
            </div>
            <Link
              href="/equipment"
              className="inline-flex items-center gap-1.5 rounded-[6px] border-2 border-ink bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              View all equipment
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </SectionIn>

          <StaggerGrid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <StaggerCard key={category.id} className="h-full">
                <Link
                  href={`/equipment?category=${category.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[10px] border-2 border-ink bg-background transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-offset-sm"
                >
                  <div className="relative aspect-[16/9] overflow-hidden border-b-2 border-ink bg-secondary">
                    <Image
                      src={`/images/categories/${category.id}.jpg`}
                      alt={`${category.name} equipment`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 rounded-[4px] border border-ink/20 bg-background/92 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] backdrop-blur-sm">
                      {category.code} · {String(category.count).padStart(2, "0")} listed
                    </span>
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-4 p-4">
                    <div>
                      <h3 className="font-heading text-xl font-extrabold tracking-[-0.035em]">
                        {category.name}
                      </h3>
                      <p className="mt-1.5 max-w-[30ch] text-sm leading-relaxed text-ink-soft">
                        {category.description}
                      </p>
                    </div>
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-surface transition-colors group-hover:bg-lime">
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </StaggerCard>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="container-page py-16 lg:py-24">
          <SectionIn>
            <p className="eyebrow">The idea</p>
            <WordReveal
              lines={["The machine is already", "out there. Put it to work."]}
              className="display-2 mt-4 max-w-[24ch]"
            />
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
              <span>{analytics.totals.equipment} machines</span>
              <span className="text-ink/20">/</span>
              <span>{owners.length} verified owners</span>
              <span className="text-ink/20">/</span>
              <span>2 cities</span>
              <span className="text-ink/20">/</span>
              <span>Every rate in BDT</span>
            </div>
          </SectionIn>
        </div>
      </section>

      <section className="border-b-2 border-ink bg-[#060605] text-[#f9f9f6]">
        <div className="container-page py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <SectionIn>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-lime">
                Why Yardclub
              </p>
              <h2 className="mt-3 max-w-[13ch] font-heading text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                No broker.
                <br />
                No storage unit.
              </h2>
              <p className="mt-5 max-w-[40ch] text-sm leading-relaxed text-white/60">
                The machine you need is usually a few kilometres away, sitting
                between jobs. Yardclub puts a rate, a date and a name against it.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-white/70">
                  <ShieldCheck className="size-3 text-lime" aria-hidden="true" />
                  Verified owners
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-white/70">
                  <ClipboardCheck className="size-3 text-lime" aria-hidden="true" />
                  Handover sheet
                </span>
              </div>
            </SectionIn>

            <StaggerGrid className="grid gap-x-8 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <StaggerCard key={benefit.title} className="h-full">
                  <div className="flex h-full flex-col border-t-2 border-white/15 py-5">
                    <benefit.icon className="size-5 text-lime" aria-hidden="true" />
                    <h3 className="mt-4 font-heading text-xl font-extrabold tracking-[-0.03em]">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-white/60">
                      {benefit.copy}
                    </p>
                  </div>
                </StaggerCard>
              ))}
            </StaggerGrid>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="container-page py-14 lg:py-20">
          <SectionIn className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="display-2 mt-2 max-w-[17ch]">
                Three steps, no site visit.
              </h2>
            </div>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
            >
              The full process
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </SectionIn>

          <StaggerGrid className="mt-8 grid gap-px overflow-hidden rounded-[10px] border-2 border-ink bg-ink md:grid-cols-3">
            {steps.map((step, index) => (
              <StaggerCard key={step.title} className="h-full">
                <div className="flex h-full flex-col bg-surface p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
                      Step {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="grid size-8 place-items-center rounded-full border-2 border-ink bg-lime font-mono text-[10px] font-bold text-primary-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 font-heading text-2xl font-extrabold tracking-[-0.035em]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {step.copy}
                  </p>
                </div>
              </StaggerCard>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section className="border-b-2 border-ink bg-surface">
        <div className="container-page py-14 lg:py-20">
          <SectionIn className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">Trusted owners</p>
              <h2 className="display-2 mt-2 max-w-[18ch]">
                The people behind the machines.
              </h2>
            </div>
            <p className="max-w-[36ch] text-sm leading-relaxed text-ink-soft">
              You can see how fast each owner replies and what renters said
              before you book.
            </p>
          </SectionIn>

          <StaggerGrid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topOwners.map((owner) => (
              <StaggerCard key={owner.id} className="h-full">
                <Link
                  href={`/owners/${owner.id}`}
                  className="group flex h-full flex-col rounded-[10px] border-2 border-ink bg-background p-4 transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-offset-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-12 place-items-center rounded-[8px] border-2 border-ink bg-lime font-mono text-sm font-bold text-primary-foreground">
                      {owner.initials}
                    </span>
                    {owner.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-success/25 bg-success-soft px-2 py-1 font-mono text-[8px] uppercase tracking-[0.08em] text-success-text">
                        <ShieldCheck className="size-2.5" aria-hidden="true" />
                        Verified
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-extrabold tracking-[-0.03em]">
                    {owner.name}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                    <MapPin className="size-3" aria-hidden="true" />
                    {owner.location}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <StarRating value={owner.rating} />
                    <span className="font-mono text-[10px] tabular-nums">
                      {owner.rating.toFixed(1)}
                    </span>
                    <span className="font-mono text-[9px] text-ink-soft">
                      ({owner.reviewCount})
                    </span>
                  </div>
                  <p className="mt-auto pt-4 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                    Replies in {owner.responseTime}
                  </p>
                </Link>
              </StaggerCard>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="container-page py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
            <SectionIn>
              <p className="eyebrow">Reviews</p>
              <h2 className="display-2 mt-2 max-w-[14ch]">
                {analytics.totals.completedRentals} rentals completed.
              </h2>
              <p className="lede mt-4">
                Every review below is tied to a closed booking, not a mailing
                list.
              </p>
              <div className="mt-6 flex items-center gap-3 border-t-2 border-ink pt-5">
                <span className="font-mono text-4xl font-medium tabular-nums">4.8</span>
                <div>
                  <StarRating value={4.8} size="md" />
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                    Average across {analytics.totals.completedRentals} rentals
                  </p>
                </div>
              </div>
            </SectionIn>

            <StaggerGrid className="grid gap-4 sm:grid-cols-2">
              {reviews.map((review) => (
                <StaggerCard key={review.id} className="h-full">
                  <article className="flex h-full flex-col rounded-[10px] border-2 border-ink bg-surface p-5">
                    <StarRating value={review.rating} />
                    <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                      “{review.comment}”
                    </blockquote>
                    <div className="mt-5 flex items-center gap-2.5 border-t border-ink/15 pt-4">
                      <span className="grid size-8 place-items-center rounded-full border-2 border-ink bg-lime-soft font-mono text-[9px] font-bold text-lime-ink">
                        {review.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold">{review.name}</p>
                        <p className="truncate font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
                          {review.location}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 truncate font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                      {review.equipment}
                    </p>
                  </article>
                </StaggerCard>
              ))}
            </StaggerGrid>
          </div>
        </div>
      </section>

      <section className="bg-lime text-[#060605]">
        <div className="container-page py-14 lg:py-20">
          <div className="grid items-end gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <SectionIn>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/55">
                Ready when the job is
              </p>
              <h2 className="mt-3 max-w-[17ch] font-heading text-4xl font-extrabold leading-[0.96] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Find the machine. Get the job done.
              </h2>
              <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-black/65">
                {analytics.totals.equipment} listings across Dhaka and
                Chattogram, with rates in BDT and owners who answer.
              </p>
            </SectionIn>

            <SectionIn delay={0.08} className="flex flex-col gap-3 lg:items-end">
              <Button
                asChild
                size="lg"
                className="border-[#060605] bg-[#060605] text-[#f9f9f6] shadow-[3px_3px_0_rgba(6,6,5,0.25)] hover:bg-[#292925] hover:text-[#f9f9f6]"
              >
                <Link href="/equipment">
                  Browse all equipment
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#060605] bg-transparent text-[#060605] hover:bg-black/10"
              >
                <Link href="/register">List your gear</Link>
              </Button>
              <p className="mt-1 max-w-[36ch] font-mono text-[9px] leading-relaxed uppercase tracking-[0.08em] text-black/50 lg:text-right">
                No account needed to browse. Sign in when you book.
              </p>
            </SectionIn>
          </div>
        </div>
      </section>
    </>
  );
}
