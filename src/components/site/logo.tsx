import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  markOnly = false,
}: {
  className?: string;
  markOnly?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Yardclub home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-[6px] border-2 border-ink bg-lime font-mono text-[13px] font-bold text-primary-foreground shadow-offset-sm transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_var(--ink)]">
        YC
      </span>
      {!markOnly && (
        <span className="font-heading text-[1.35rem] font-extrabold leading-none tracking-[-0.05em]">
          yardclub<span className="text-lime-ink">.</span>
        </span>
      )}
    </Link>
  );
}

export function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4 fill-current", className)}
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.4 3.8H5.6L17.8 20z" />
    </svg>
  );
}
