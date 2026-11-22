import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  className,
  size = "sm",
}: {
  value: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const filled = Math.round(typeof value === "number" && Number.isFinite(value) ? value : 0);
  const icon = size === "md" ? "size-4" : "size-3.5";
  const safeValue = typeof value === "number" && Number.isFinite(value) ? value : 0;

  return (
    <span
      role="img"
      aria-label={`${safeValue.toFixed(1)} out of 5`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(
            icon,
            index < filled
              ? "fill-lime text-ink"
              : "fill-transparent text-ink/25",
          )}
          strokeWidth={1.6}
        />
      ))}
    </span>
  );
}
