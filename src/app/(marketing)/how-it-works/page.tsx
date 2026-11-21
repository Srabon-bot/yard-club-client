import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle,
  FileCheck2,
  Handshake,
  Search,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "The 5-step rental loop on Yardclub: search, check availability, book securely, inspect at handover, and return.",
};

const STEPS = [
  {
    step: "01",
    title: "Find the right equipment",
    icon: Search,
    desc: "Search by equipment name, filter by category (Construction, Photography, Vehicles, Agriculture, Electronics, Event), and narrow down by location (Dhaka or Chattogram) and daily rate.",
  },
  {
    step: "02",
    title: "Check availability & schedule",
    icon: CalendarCheck,
    desc: "Review live calendar availability. Our availability engine compares listing stock against active bookings so you only reserve machines ready for work on your target dates.",
  },
  {
    step: "03",
    title: "Secure instant booking & payment",
    icon: FileCheck2,
    desc: "Specify rental dates, required units, and site address. Transparent pricing in BDT with no surprise surcharges. Complete payments securely via integrated Stripe Checkout.",
  },
  {
    step: "04",
    title: "Delivery & joint handover inspection",
    icon: Handshake,
    desc: "Coordinate delivery or yard pickup directly with the verified owner. Complete a joint equipment condition checklist before taking possession.",
  },
  {
    step: "05",
    title: "Work & smooth return",
    icon: RotateCcw,
    desc: "Put the equipment to work for your job duration. Return it in good order, confirm receipt with the owner, and leave a genuine verified review.",
  },
];

const TRUST_FACTORS = [
  {
    title: "Transparent BDT Pricing",
    desc: "No hidden charges, operator fee surprises, or bait-and-switch quotes. Every rate is displayed per day, week, or month.",
  },
  {
    title: "Verified Equipment Owners",
    desc: "Every owner identity and business background is reviewed and vetted before listings go live.",
  },
  {
    title: "Standardized Handover Agreements",
    desc: "Clear terms and condition agreements, deposit rules, and condition inspection logs protect both parties.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b-2 border-ink bg-surface">
        <div className="container-page py-16 lg:py-20">
          <p className="eyebrow">The Rental Loop</p>
          <h1 className="display-1 mt-3 max-w-[16ch]">
            From search to handover, without the fog.
          </h1>
          <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-ink-soft">
            How Yardclub delivers reliable machinery and equipment across Dhaka
            and Chattogram with transparent terms and verified owners.
          </p>
        </div>
      </section>

      {/* 5 Steps */}
      <section className="border-b-2 border-ink">
        <div className="container-page py-16">
          <p className="eyebrow">Step by step</p>
          <h2 className="display-2 mt-2">The five-step rental lifecycle</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative flex flex-col justify-between rounded-[10px] border-2 border-ink bg-surface p-6 shadow-offset-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-bold text-lime">
                        {s.step}
                      </span>
                      <span className="grid size-10 place-items-center rounded-[6px] border-2 border-ink bg-secondary">
                        <Icon className="size-5 text-ink" />
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-bold">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col justify-center rounded-[10px] border-2 border-ink bg-lime p-6 shadow-offset-sm">
              <h3 className="font-heading text-xl font-black text-[#060605]">
                Ready to rent?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#060605]/80">
                Explore our full catalogue of 24+ heavy machines, cameras, audio
                systems, and power units.
              </p>
              <div className="mt-6">
                <Button asChild className="bg-ink text-background hover:bg-ink/90">
                  <Link href="/equipment">
                    Browse Equipment
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Protection */}
      <section className="border-b-2 border-ink bg-secondary/30">
        <div className="container-page py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">Trust & Protection</p>
              <h2 className="display-2 mt-2">
                Built for dependability on active job sites.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                Equipment delays stop entire projects. We ensure both renters and
                owners operate with total transparency, clear liabilities, and
                speedy dispute resolution.
              </p>
            </div>

            <div className="grid gap-4">
              {TRUST_FACTORS.map((tf) => (
                <div
                  key={tf.title}
                  className="rounded-[10px] border-2 border-ink bg-surface p-5 shadow-offset-sm"
                >
                  <h4 className="flex items-center gap-2 font-heading text-base font-bold">
                    <ShieldCheck className="size-5 text-lime" />
                    {tf.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                    {tf.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two Modes */}
      <section className="border-b-2 border-ink">
        <div className="container-page py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[10px] border-2 border-ink bg-surface p-8 shadow-offset-sm">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                For Renters
              </span>
              <h3 className="display-3 mt-2">Get equipment on your schedule</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-lime" />
                  Compare specifications and rates side-by-side
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-lime" />
                  Instant availability check before committing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-lime" />
                  Secure checkout and itemized printable receipts
                </li>
              </ul>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/equipment">Explore Listings</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[10px] border-2 border-ink bg-surface p-8 shadow-offset-sm">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                For Equipment Owners
              </span>
              <h3 className="display-3 mt-2">Monetize idle machinery</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-lime" />
                  List in under 5 minutes with flexible day/week rates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-lime" />
                  Retain full control over bookings and availability
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-lime" />
                  Fast payout tracking and comprehensive earnings analytics
                </li>
              </ul>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link href="/register">Become an Owner</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
