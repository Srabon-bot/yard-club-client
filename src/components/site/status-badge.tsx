import { cn } from "@/lib/utils";

const tones = {
  lime: "border-lime-ink/20 bg-lime-soft text-lime-ink",
  green: "border-green-600/25 bg-success-soft text-success-text",
  amber: "border-amber-700/25 bg-warning-soft text-warning-text",
  red: "border-red-600/25 bg-danger-soft text-danger-text",
  blue: "border-link/25 bg-link/10 text-link",
  neutral: "border-ink/20 bg-secondary text-ink-soft",
} as const;

export type StatusTone = keyof typeof tones;

export function StatusBadge({
  tone = "neutral",
  children,
  className,
  dot = true,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.06em] whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {dot && <i className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}
