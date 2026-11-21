"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryId, Equipment, RentalType } from "@/lib/types";

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

export type EquipmentFormResult =
  | { ok: true; id: string; name: string }
  | { ok: false; error: string };

export type EquipmentFormValues = {
  id?: string;
  name?: string;
  brand?: string;
  model?: string;
  category?: CategoryId | "";
  description?: string;
  location?: string;
  quantity?: number;
  condition?: Equipment["condition"] | "";
  pricePerDay?: number;
  rentalTypes?: RentalType[];
  image?: string;
  terms?: string;
};

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

/** Shared create/edit form for owner and admin listing management. */
export function EquipmentForm({
  action,
  initialValues,
  submitLabel,
  statusNote,
  redirectTo,
  onSuccess,
}: {
  action: (formData: FormData) => Promise<EquipmentFormResult>;
  initialValues?: EquipmentFormValues;
  submitLabel: string;
  statusNote?: string;
  redirectTo?: string;
  onSuccess?: (result: Extract<EquipmentFormResult, { ok: true }>) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rentalTypes, setRentalTypes] = useState<string[]>(
    initialValues?.rentalTypes?.length ? initialValues.rentalTypes : ["daily"],
  );

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
      const result = await action(formData);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      if (onSuccess) {
        onSuccess(result);
        return;
      }

      toast.success("Listing saved", {
        description: `${result.name} was updated.`,
      });
      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      toast.error("Could not save the listing. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const locations = ["Dhaka", "Chattogram"];
  if (initialValues?.location && !locations.includes(initialValues.location)) {
    locations.unshift(initialValues.location);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {initialValues?.id ? (
        <input type="hidden" name="id" value={initialValues.id} />
      ) : null}

      <Panel title="Equipment details">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldGroup label="Equipment name" htmlFor="eq-name">
            <Input
              id="eq-name"
              name="name"
              required
              defaultValue={initialValues?.name ?? ""}
              placeholder="e.g. CAT 320 Excavator"
              className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
            />
          </FieldGroup>

          <FieldGroup label="Brand" htmlFor="eq-brand">
            <Input
              id="eq-brand"
              name="brand"
              required
              defaultValue={initialValues?.brand ?? ""}
              placeholder="e.g. Caterpillar"
              className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
            />
          </FieldGroup>

          <FieldGroup label="Model" htmlFor="eq-model">
            <Input
              id="eq-model"
              name="model"
              required
              defaultValue={initialValues?.model ?? ""}
              placeholder="e.g. 320D2"
              className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
            />
          </FieldGroup>

          <FieldGroup label="Category" htmlFor="eq-category">
            <select
              id="eq-category"
              name="category"
              required
              defaultValue={initialValues?.category ?? ""}
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
                defaultValue={initialValues?.description ?? ""}
                placeholder="Describe the equipment, its key capabilities and what is included."
                className="rounded-[6px] border-2 border-ink bg-background text-sm"
              />
            </FieldGroup>
          </div>
        </div>
      </Panel>

      <Panel title="Location & availability">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldGroup label="Location" htmlFor="eq-location">
            <select
              id="eq-location"
              name="location"
              required
              defaultValue={initialValues?.location ?? ""}
              className={selectClass}
            >
              <option value="">Select city</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup label="Available quantity" htmlFor="eq-qty">
            <Input
              id="eq-qty"
              name="quantity"
              type="number"
              min={1}
              required
              defaultValue={initialValues?.quantity ?? 1}
              className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
            />
          </FieldGroup>

          <FieldGroup label="Condition" htmlFor="eq-condition">
            <select
              id="eq-condition"
              name="condition"
              required
              defaultValue={initialValues?.condition ?? ""}
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

          <FieldGroup label="Rental price per day (BDT)" htmlFor="eq-price">
            <Input
              id="eq-price"
              name="pricePerDay"
              type="number"
              min={1}
              required
              defaultValue={initialValues?.pricePerDay ?? ""}
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
              required
              defaultValue={initialValues?.image ?? ""}
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
              defaultValue={initialValues?.terms ?? ""}
              placeholder="Security deposit, liability, operator requirements, restricted uses…"
              className="rounded-[6px] border-2 border-ink bg-background text-sm"
            />
          </FieldGroup>
        </div>
      </Panel>

      <div className="flex items-center justify-between gap-4 rounded-[10px] border-2 border-ink bg-surface px-4 py-3 shadow-offset-sm">
        <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
          {statusNote ?? "All fields required"}
        </p>
        <Button type="submit" disabled={loading} className="h-11 px-6">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
