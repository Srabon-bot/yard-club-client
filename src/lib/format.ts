export const formatBDT = (value: number) =>
  `BDT ${(typeof value === "number" ? value : 0).toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;

export const formatCompactBDT = (value: number) => {
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : 0;
  if (numeric >= 1_000_000) return `BDT ${(numeric / 1_000_000).toFixed(1)}M`;
  if (numeric >= 1_000) return `BDT ${Math.round(numeric / 1_000)}k`;
  return formatBDT(numeric);
};

/** Safe rating label — falls back to "New" when the API omits the value. */
export const formatRating = (value: number | null | undefined): string => {
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return numeric > 0 ? numeric.toFixed(1) : "New";
};

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

export const daysBetween = (start: string, end: string) => {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  return Math.max(1, Math.round((b - a) / 86_400_000));
};

export const rentalTotal = (
  pricePerDay: number,
  quantity: number,
  days: number,
) => pricePerDay * quantity * days;
