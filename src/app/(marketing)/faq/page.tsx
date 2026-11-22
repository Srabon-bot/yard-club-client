"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FAQS = [
  {
    category: "Rentals & Bookings",
    questions: [
      {
        q: "How does billing and duration work?",
        a: "All rentals are billed based on daily, weekly, or monthly rates. A 24-hour cycle begins at the time of confirmed physical handover.",
      },
      {
        q: "What is required during equipment handover?",
        a: "Both the renter and owner (or delivery agent) inspect the machine against a standard handover checklist, recording preexisting wear, fuel level, and operating condition.",
      },
      {
        q: "Can I extend my booking period?",
        a: "Yes, extensions are supported subject to machine availability. Submit an extension request via your Customer Dashboard at least 24 hours prior to return.",
      },
    ],
  },
  {
    category: "Payments & Deposits",
    questions: [
      {
        q: "When do I pay for a rental?",
        a: "You send a dated request first; no card is charged at that stage. Once the owner confirms availability, Pay now appears on the booking and takes you to Stripe Checkout. All quotes are in Bangladeshi Taka (BDT), and the transaction is saved to your rental record.",
      },
      {
        q: "Are security deposits required?",
        a: "High-value machinery may require a refundable deposit agreed with the owner at handover. The deposit amount and return conditions stay with the booking record.",
      },
      {
        q: "Can I get an itemized printable receipt?",
        a: "Yes. Every completed booking automatically generates a formal, printable invoice and receipt accessible from your dashboard.",
      },
    ],
  },
  {
    category: "Damage, Liability & Cancellations",
    questions: [
      {
        q: "What happens if equipment malfunctions on site?",
        a: "Contact the owner and our 24/7 hotline immediately. If breakdown is due to mechanical failure rather than misuse, a replacement or pro-rated refund is arranged.",
      },
      {
        q: "What is the cancellation policy?",
        a: "Cancellations made more than 48 hours before the start date receive a full refund. Cancellations within 48 hours are subject to a one-day rental fee.",
      },
    ],
  },
  {
    category: "Owner Listings & Payouts",
    questions: [
      {
        q: "Who can list equipment on Yardclub?",
        a: "Any business or individual with legitimate equipment ownership and valid NID/Trade license can register as an Equipment Owner.",
      },
      {
        q: "How and when do owners get paid?",
        a: "Rental earnings are disbursed directly to your designated bank account or mobile wallet within 2-3 business days after a completed rental period.",
      },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openItem, setOpenItem] = useState<string | null>("Rentals & Bookings-0");

  const filteredCategories = FAQS.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <>
      {/* Header */}
      <section className="border-b-2 border-ink bg-surface">
        <div className="container-page py-16 text-center">
          <p className="eyebrow">Help & Knowledge Base</p>
          <h1 className="display-1 mt-2">Answers, before you ask.</h1>
          <p className="mx-auto mt-4 max-w-[50ch] text-base text-ink-soft">
            Everything you need to know about renting gear, listing machines,
            handover agreements, and payments.
          </p>

          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions or keywords..."
                className="h-12 rounded-[6px] border-2 border-ink pl-10 text-sm shadow-offset-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accordions */}
      <section className="border-b-2 border-ink">
        <div className="container-page py-16">
          {filteredCategories.length === 0 ? (
            <div className="rounded-[10px] border-2 border-dashed border-ink/30 p-12 text-center">
              <HelpCircle className="mx-auto size-8 text-ink-soft" />
              <h3 className="display-3 mt-3">No matching answers found</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Try searching for something else or contact our support team.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((cat) => (
                <div key={cat.category} className="space-y-4">
                  <h2 className="font-heading text-xl font-bold">
                    {cat.category}
                  </h2>
                  <div className="divide-y-2 divide-ink rounded-[10px] border-2 border-ink bg-surface shadow-offset-sm">
                    {cat.questions.map((item, idx) => {
                      const id = `${cat.category}-${idx}`;
                      const isOpen = openItem === id;

                      return (
                        <div key={item.q} className="overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setOpenItem(isOpen ? null : id)}
                            className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold hover:bg-secondary/40 transition-colors"
                          >
                            <span className="text-base">{item.q}</span>
                            <ChevronDown
                              className={`size-5 text-ink-soft transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="border-t-2 border-ink/10 bg-secondary/20 px-6 py-4 text-sm leading-relaxed text-ink-soft">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 rounded-[10px] border-2 border-ink bg-lime p-8 text-center shadow-offset-sm sm:flex sm:items-center sm:justify-between sm:text-left">
            <div>
              <h3 className="font-heading text-xl font-black text-[#060605]">
                Still have questions?
              </h3>
              <p className="mt-1 text-sm text-[#060605]/80">
                Our support team is ready to help you with booking or listing.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button asChild className="bg-ink text-background hover:bg-ink/90">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
