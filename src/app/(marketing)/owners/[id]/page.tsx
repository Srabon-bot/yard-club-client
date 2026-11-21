import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { StarRating } from "@/components/site/star-rating";
import { Button } from "@/components/ui/button";
import { getOwner, getOwnerDetail } from "@/lib/data/owners";
import { isAvailableNow } from "@/lib/data/equipment";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/owners/[id]">): Promise<Metadata> {
  const { id } = await params;
  const owner = await getOwner(id);
  return {
    title: owner ? `${owner.name} – Equipment Owner Profile` : "Owner Profile",
    description: owner?.bio,
  };
}

export default async function OwnerProfilePage({
  params,
}: PageProps<"/owners/[id]">) {
  const { id } = await params;
  const detail = await getOwnerDetail(id);
  if (!detail) notFound();

  const { owner, listings } = detail;
  const allReviews = detail.reviews;

  const availabilityMap: Record<string, boolean> = {};
  for (const item of listings) {
    availabilityMap[item.id] = isAvailableNow(item);
  }

  return (
    <>
      {/* Header Profile Card */}
      <section className="border-b-2 border-ink bg-surface">
        <div className="container-page py-12 lg:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4 sm:gap-6">
              <span className="grid size-20 shrink-0 place-items-center rounded-[10px] border-2 border-ink bg-lime font-mono text-2xl font-black text-ink shadow-offset-sm">
                {owner.initials}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="display-2">{owner.name}</h1>
                  {owner.verified && (
                    <span className="inline-flex items-center gap-1 rounded-[4px] border border-ink/30 bg-secondary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                      <ShieldCheck className="size-3.5 text-lime" />
                      Verified Owner
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-soft">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {owner.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    Response time: {owner.responseTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-3.5" />
                    Member since {formatDate(owner.joined)}
                  </span>
                </div>

                <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
                  {owner.bio}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 rounded-[10px] border-2 border-ink bg-secondary/30 p-5 shadow-offset-sm sm:w-64">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                  Rating
                </span>
                <span className="flex items-center gap-1 font-mono text-lg font-bold">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {owner.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-ink/10 pt-2 text-xs">
                <span className="text-ink-soft">Completed Reviews</span>
                <span className="font-mono font-bold text-ink">
                  {owner.reviewCount}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-ink/10 pt-2 text-xs">
                <span className="text-ink-soft">Fleet Size</span>
                <span className="font-mono font-bold text-ink">
                  {listings.length} live units
                </span>
              </div>
              <Button asChild className="mt-2 w-full text-xs font-bold">
                <a href={`tel:${owner.phone}`}>
                  <Phone className="size-3.5" />
                  Call Owner Yard
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Listings */}
      <section className="border-b-2 border-ink">
        <div className="container-page py-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Available Equipment</p>
              <h2 className="display-2 mt-1">Equipment in this yard</h2>
            </div>
            <span className="font-mono text-xs text-ink-soft">
              {listings.length} listing{listings.length === 1 ? "" : "s"}
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="mt-8 rounded-[10px] border-2 border-dashed border-ink/30 p-12 text-center">
              <p className="display-3">No active listings</p>
              <p className="mt-1 text-sm text-ink-soft">
                This owner has no equipment listed currently.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((item) => (
                <EquipmentCard
                  key={item.id}
                  item={item}
                  categoryName={item.category}
                  owner={owner}
                  available={availabilityMap[item.id] ?? true}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="border-b-2 border-ink bg-surface">
        <div className="container-page py-16">
          <p className="eyebrow">Verified Feedback</p>
          <h2 className="display-2 mt-1">Customer Reviews</h2>

          {allReviews.length === 0 ? (
            <p className="mt-8 rounded-[10px] border border-ink/15 bg-secondary/20 p-6 text-sm text-ink-soft">
              No written reviews for this yard yet.
            </p>
          ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {allReviews.slice(0, 4).map((r) => (
              <div
                key={r.id}
                className="rounded-[10px] border-2 border-ink bg-secondary/20 p-6 shadow-offset-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-full border border-ink bg-lime font-mono text-xs font-bold">
                      {r.initials}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{r.name}</p>
                      <p className="text-[10px] text-ink-soft">{r.location}</p>
                    </div>
                  </div>
                  <StarRating value={r.rating} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  &ldquo;{r.comment}&rdquo;
                </p>
                <p className="mt-3 font-mono text-[10px] text-ink-soft/80">
                  Rented: {r.equipment} · {formatDate(r.date)}
                </p>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
    </>
  );
}
