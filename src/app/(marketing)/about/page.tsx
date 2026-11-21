import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlatformStats } from "@/lib/data/stats";
import { formatCompactBDT } from "@/lib/format";

export const metadata: Metadata = {
  title: "About Yardclub",
  description:
    "Yardclub is Dhaka and Chattogram's equipment-rental network. Find the story, the trust model and the numbers behind the platform.",
};

const PRINCIPLES = [
  {
    icon: Shield,
    title: "Verified owners",
    body: "Every owner on Yardclub has a verified phone number, a government-issued ID on file and at least one completed booking before listing new equipment.",
  },
  {
    icon: Star,
    title: "Real reviews only",
    body: "Reviews are only unlocked after a confirmed and completed booking. No star-rating games, no anonymous noise.",
  },
  {
    icon: Zap,
    title: "Fast response",
    body: "Owners commit to a response-time SLA when they list. Customers see the target on every card. Miss it twice and listing privileges pause.",
  },
  {
    icon: MapPin,
    title: "Dhaka & Chattogram",
    body: "We have stayed focused on two cities so we can maintain quality in a market where logistics make or break a rental.",
  },
];

export default async function AboutPage() {
  const stats = await getPlatformStats();

  const statsCards = [
    { label: "Equipment listings", value: String(stats.equipment.approved) },
    {
      label: "Rental requests",
      value: String(stats.bookings.total),
    },
    {
      label: "Booking value",
      value: formatCompactBDT(stats.bookings.revenue),
    },
    { label: "Registered users", value: stats.users.total.toLocaleString() },
  ];

  return (
    <>
      {/* Hero */}
      <section className="border-b-2 border-ink bg-lime">
        <div className="container-page py-16 lg:py-24">
          <p className="eyebrow">About Yardclub</p>
          <h1 className="display-1 mt-3 max-w-[18ch]">
            A yard, not a warehouse.
          </h1>
          <p className="mt-5 max-w-[56ch] text-base leading-relaxed">
            Yardclub connects equipment owners in Dhaka and Chattogram with the
            people who need that equipment for a day, a week or a month. No
            middlemen, no mystery pricing, no two-week minimum.
          </p>
        </div>
      </section>

      {/* Founding story */}
      <section className="border-b-2 border-ink">
        <div className="container-page py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">The story</p>
              <h2 className="display-2 mt-3">
                Built out of frustration with one excavator.
              </h2>
              <div className="mt-5 grid gap-4 text-sm leading-relaxed text-ink-soft">
                <p>
                  In 2023, Rafiul Islam needed a concrete mixer for a two-day
                  pour. He called eight numbers from a Facebook group. Three
                  were disconnected. Four wanted a one-week minimum. One quoted
                  a price, then raised it on the morning of delivery.
                </p>
                <p>
                  Yardclub launched six months later with eight pieces of
                  equipment, a single neighbourhood in Mirpur, and one rule: the
                  price shown is the price charged.
                </p>
                <p>
                  Today the network covers both Dhaka and Chattogram with
                  construction, photography, event and agricultural equipment —
                  all rented by the day.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {statsCards.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[10px] border-2 border-ink bg-surface p-5 shadow-offset-sm"
                >
                  <p className="font-mono text-[clamp(1.4rem,2.6vw,2rem)] font-medium tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b-2 border-ink bg-secondary/30">
        <div className="container-page py-12 lg:py-16">
          <p className="eyebrow">Operating principles</p>
          <h2 className="display-2 mt-3 max-w-[22ch]">
            Four things we will not compromise on.
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-[10px] border-2 border-ink bg-surface p-5 shadow-offset-sm"
                >
                  <span className="grid size-10 place-items-center rounded-[6px] border-2 border-ink bg-lime">
                    <Icon className="size-5 text-[#060605]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-extrabold tracking-[-0.03em]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="border-b-2 border-ink">
        <div className="container-page py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Coverage</p>
              <h2 className="display-2 mt-3">
                Two cities, one platform.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                Listings in Dhaka cover Gulshan, Dhanmondi, Mirpur, Uttara,
                Tejgaon, Bashundhara and Banani. In Chattogram, Agrabad and
                surrounding industrial areas. Owners outside these zones can
                apply for the waitlist.
              </p>
            </div>
            <div className="grid gap-4 content-start">
              {["Dhaka", "Chattogram"].map((city) => (
                <div
                  key={city}
                  className="flex items-center gap-4 rounded-[10px] border-2 border-ink bg-surface px-5 py-4 shadow-offset-sm"
                >
                  <MapPin className="size-5 shrink-0 text-lime" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">{city}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
                      {city === "Dhaka" ? "Active · 20+ listings" : "Active · 4+ listings"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-background">
        <div className="container-page py-12 text-center lg:py-16">
          <h2 className="display-2 max-w-[22ch] mx-auto">
            Ready to rent — or list your gear?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-background/70">
            Customers start browsing in under a minute. Owners can list a first
            piece of equipment in under five.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-lime text-[#060605] hover:bg-lime/90">
              <Link href="/equipment">
                Browse equipment
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-background/40 text-background hover:bg-background/10"
            >
              <Link href="/register">Create an account</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
