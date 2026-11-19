export const formatBDT = (value: number) =>
  `BDT ${value.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;

export const formatCompactBDT = (value: number) => {
  if (value >= 1_000_000) return `BDT ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `BDT ${Math.round(value / 1_000)}k`;
  return formatBDT(value);
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
