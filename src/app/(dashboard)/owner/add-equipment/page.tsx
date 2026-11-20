"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeading, Panel } from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEquipmentAction } from "@/lib/actions/equipment";

const CATEGORIES = [
  { value: "construction", label: "Construction" },
  { value: "photography", label: "Photography" },
  { value: "vehicles", label: "Vehicles & Transportation" },
  { value: "agriculture", label: "Agriculture" },
  { value: "electronics", label: "Electronics" },
  { value: "event", label: "Event Equipment" },
];

const CONDITIONS = [
  { value: "A", label: "A-grade (Excellent)" },
  { value: "B", label: "B-grade (Good)" },
  { value: "C", label: "C-grade (Fair)" },
];

const RENTAL_TYPES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const selectClass =
  "h-11 w-full rounded-[6px] border-2 border-ink bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-lime focus:ring-offset-1";

function FieldGroup({
  label,
  htmlFor,
  note,
  children,
}: {
  label: string;
  htmlFor: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-semibold">
        {label}
      </Label>
      {children}
      {note && (
        <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
          {note}
        </p>
      )}
    </div>
  );
}

export default function OwnerAddEquipmentPage() {
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [rentalTypes, setRentalTypes] = useState<string[]>(["daily"]);

  const toggleRentalType = (value: string) => {
    setRentalTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rentalTypes.length === 0) {
      toast.error("Choose at least one rental type.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setLoading(true);

    try {
      const result = await createEquipmentAction(formData);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setCreated({ id: result.id, name: result.name });
      toast.success("Listing submitted for approval", {
        description: `${result.name} is pending admin review.`,
      });
    } catch {
      toast.error("Could not save the listing. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <DashboardShell>
        <div className="grid place-items-center gap-5 rounded-[10px] border-2 border-ink bg-surface px-6 py-16 text-center shadow-offset-sm">
          <span className="grid size-14 place-items-center rounded-[10px] border-2 border-ink bg-lime">
            <CheckCircle2 className="size-7 text-[#060605]" aria-hidden="true" />
          </span>
          <div>
            <p className="display-3">Listing submitted</p>
            <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-soft">
              <strong>{created.name}</strong> is now under review. It will
              appear on the catalogue after admin approval, usually within 24
              hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild>
              <Link href="/owner/equipment">View my equipment</Link>
            </Button>
            <Button onClick={() => setCreated(null)} variant="outline">
              Add another listing
            </Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Owner"
          title="List a new machine"
          description="All fields required. New listings go to Pending and appear after admin approval."
        />

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Basic info */}
          <Panel title="Equipment details">
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldGroup label="Equipment name" htmlFor="eq-name">
                <Input
                  id="eq-name"
                  name="name"
                  required
                  placeholder="e.g. CAT 320 Excavator"
                  className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
                />
              </FieldGroup>

              <FieldGroup label="Brand" htmlFor="eq-brand">
                <Input
                  id="eq-brand"
                  name="brand"
                  required
                  placeholder="e.g. Caterpillar"
                  className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
                />
              </FieldGroup>

              <FieldGroup label="Model" htmlFor="eq-model">
                <Input
                  id="eq-model"
                  name="model"
                  required
                  placeholder="e.g. 320D2"
                  className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
                />
              </FieldGroup>

              <FieldGroup label="Category" htmlFor="eq-category">
                <select
                  id="eq-category"
                  name="category"
                  required
                  className={selectClass}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </FieldGroup>

              <div className="sm:col-span-2">
                <FieldGroup label="Description" htmlFor="eq-description">
                  <Textarea
                    id="eq-description"
                    name="description"
                    required
                    rows={4}
                    placeholder="Describe the equipment, its key capabilities and what is included."
                    className="rounded-[6px] border-2 border-ink bg-background text-sm"
                  />
                </FieldGroup>
              </div>
            </div>
          </Panel>

          {/* Logistics */}
          <Panel title="Location & availability">
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldGroup label="Location" htmlFor="eq-location">
                <select
                  id="eq-location"
                  name="location"
                  required
                  className={selectClass}
                >
                  <option value="">Select city</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chattogram">Chattogram</option>
                </select>
              </FieldGroup>

              <FieldGroup label="Available quantity" htmlFor="eq-qty">
                <Input
                  id="eq-qty"
                  name="quantity"
                  type="number"
                  min={1}
                  required
                  placeholder="1"
                  className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
                />
              </FieldGroup>

              <FieldGroup label="Condition" htmlFor="eq-condition">
                <select
                  id="eq-condition"
                  name="condition"
                  required
                  className={selectClass}
                >
                  <option value="">Select condition</option>
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </FieldGroup>

              <FieldGroup
                label="Rental price per day (BDT)"
                htmlFor="eq-price"
              >
                <Input
                  id="eq-price"
                  name="pricePerDay"
                  type="number"
                  min={1}
                  required
                  placeholder="e.g. 28000"
                  className="h-11 rounded-[6px] border-2 border-ink bg-background font-mono text-sm"
                />
              </FieldGroup>

              <div className="sm:col-span-2">
                <div className="grid gap-1.5">
                  <p className="text-xs font-semibold">Rental types</p>
                  <div className="flex flex-wrap gap-3">
                    {RENTAL_TYPES.map((rt) => (
                      <label
                        key={rt.value}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          name="rentalTypes"
                          value={rt.value}
                          checked={rentalTypes.includes(rt.value)}
                          onChange={() => toggleRentalType(rt.value)}
                          className="size-4 accent-[var(--lime)]"
                        />
                        {rt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* Media & terms */}
          <Panel title="Image & terms">
            <div className="grid gap-4">
              <FieldGroup
                label="Equipment image URL"
                htmlFor="eq-image"
                note="Direct image URL or imgbb upload link"
              >
                <Input
                  id="eq-image"
                  name="image"
                  type="url"
                  required
                  placeholder="https://i.ibb.co/... or https://..."
                  className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
                />
              </FieldGroup>

              <FieldGroup label="Rental terms & conditions" htmlFor="eq-terms">
                <Textarea
                  id="eq-terms"
                  name="terms"
                  required
                  rows={3}
                  placeholder="Security deposit, liability, operator requirements, restricted uses…"
                  className="rounded-[6px] border-2 border-ink bg-background text-sm"
                />
              </FieldGroup>
            </div>
          </Panel>

          <div className="flex items-center justify-between gap-4 rounded-[10px] border-2 border-ink bg-surface px-4 py-3 shadow-offset-sm">
            <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
              Status: Pending · Visible after admin approval
            </p>
            <Button type="submit" disabled={loading} className="h-11 px-6">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                "Submit listing"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
