"use client";

import { useState } from "react";
import {
  Clock,
  Mail,
  MapPin,
  Send,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TOPICS = [
  "Rental Booking Support",
  "Equipment Owner Verification",
  "Payment or Refund Query",
  "Damage / Incident Report",
  "Partnership & Fleet Listing",
  "General Inquiry",
];

export default function ContactPage() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully!", {
        description:
          "Our operations desk will respond within 2 hours during active support hours.",
      });
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <>
      {/* Header */}
      <section className="border-b-2 border-ink bg-surface">
        <div className="container-page py-16">
          <p className="eyebrow">Direct Contact</p>
          <h1 className="display-1 mt-2 max-w-[16ch]">
            Talk to a human on our operations team.
          </h1>
          <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-ink-soft">
            Whether you need urgent site assistance, help with an active booking,
            or fleet onboarding support, we are here.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="border-b-2 border-ink">
        <div className="container-page py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="rounded-[10px] border-2 border-ink bg-surface p-6 shadow-offset-sm sm:p-8">
                <h2 className="display-3">Send us a message</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Fill out the form below and we will route your inquiry to the
                  right desk.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="contact-topic" className="text-xs font-semibold">
                      Inquiry Topic
                    </Label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="h-11 rounded-[6px] border-2 border-ink bg-background px-3 text-sm font-medium outline-none"
                    >
                      {TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="contact-name" className="text-xs font-semibold">
                        Your Full Name
                      </Label>
                      <Input
                        id="contact-name"
                        required
                        placeholder="Tanvir Ahmed"
                        className="h-11 rounded-[6px] border-2 border-ink"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-phone" className="text-xs font-semibold">
                        Phone Number
                      </Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        required
                        placeholder="+880 1711 000 000"
                        className="h-11 rounded-[6px] border-2 border-ink"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contact-email" className="text-xs font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="tanvir@example.com"
                      className="h-11 rounded-[6px] border-2 border-ink"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contact-msg" className="text-xs font-semibold">
                      Message / Booking Reference
                    </Label>
                    <Textarea
                      id="contact-msg"
                      required
                      rows={5}
                      placeholder="Describe your question or site situation in detail..."
                      className="rounded-[6px] border-2 border-ink"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full text-base font-bold sm:w-auto sm:px-8"
                  >
                    {loading ? (
                      "Sending message..."
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-6 lg:col-span-5">
              {/* Emergency card */}
              <div className="rounded-[10px] border-2 border-ink bg-lime p-6 shadow-offset-sm">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="size-6 text-[#060605]" />
                  <h3 className="font-heading text-lg font-black text-[#060605]">
                    Active Rental Emergency?
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#060605]/85">
                  If equipment breaks down on an active job site or you require
                  immediate assistance during a handover, contact our rapid
                  dispatch line directly.
                </p>
                <div className="mt-4 rounded-[6px] border-2 border-ink bg-surface px-4 py-3 font-mono text-sm font-bold text-ink">
                  HOTLINE: +880 1700 999 111
                </div>
              </div>

              {/* Office & Operations */}
              <div className="space-y-4 rounded-[10px] border-2 border-ink bg-surface p-6 shadow-offset-sm">
                <h3 className="font-heading text-base font-bold">
                  Yardclub Headquarters
                </h3>

                <div className="flex items-start gap-3 text-sm text-ink-soft">
                  <MapPin className="mt-1 size-4 shrink-0 text-ink" />
                  <div>
                    <p className="font-semibold text-ink">Dhaka Central Hub</p>
                    <p>House 14, Road 7, Sector 3, Uttara, Dhaka-1230</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-ink-soft">
                  <MapPin className="mt-1 size-4 shrink-0 text-ink" />
                  <div>
                    <p className="font-semibold text-ink">Chattogram Yard</p>
                    <p>Plot 8, Agrabad Commercial Area, Chattogram</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-ink-soft">
                  <Clock className="mt-1 size-4 shrink-0 text-ink" />
                  <div>
                    <p className="font-semibold text-ink">Operating Hours</p>
                    <p>Saturday – Thursday: 8:00 AM – 8:00 PM</p>
                    <p>Friday (Emergency Dispatch Only): 9:00 AM – 5:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-ink-soft">
                  <Mail className="mt-1 size-4 shrink-0 text-ink" />
                  <div>
                    <p className="font-semibold text-ink">Electronic Mail</p>
                    <p>support@yardclub.com</p>
                    <p>dispatch@yardclub.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
