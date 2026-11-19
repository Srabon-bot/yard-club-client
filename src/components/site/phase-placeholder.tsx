import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StatusBadge } from "@/components/site/status-badge";

export function PhasePlaceholder({
  phase,
  title,
  description,
  sections,
  parent,
}: {
  phase: string;
  title: string;
  description: string;
  sections: string[];
  parent?: { label: string; href: string };
}) {
  return (
    <div className="container-page py-10 lg:py-16">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="amber">Phase {phase} · In build</StatusBadge>
          {parent && (
            <Link
              href={parent.href}
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft underline decoration-ink/25 underline-offset-4 transition-colors hover:text-foreground"
            >
              ← {parent.label}
            </Link>
          )}
        </div>
        <h1 className="display-2 mt-5 max-w-3xl">{title}</h1>
        <p className="lede mt-4">{description}</p>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-[1.4fr_1fr] md:items-start">
        <Reveal className="rounded-[10px] border-2 border-ink bg-surface p-5 shadow-offset-sm sm:p-7">
          <p className="eyebrow">What lands on this page</p>
          <ul className="mt-5 grid gap-3">
            {sections.map((section, index) => (
              <li key={section} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-[4px] border border-ink bg-lime-soft font-mono text-[10px] text-lime-ink">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-ink-soft">{section}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-center gap-2 border-t border-ink/15 pt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
            <Check className="size-3.5 text-success" aria-hidden="true" />
            Route wired · layout, theme and navigation live
          </p>
        </Reveal>

        <Reveal
          delay={60}
          className="relative overflow-hidden rounded-[10px] border-2 border-ink bg-secondary p-5 sm:p-6"
        >
          <p className="eyebrow">Before this phase</p>
          <h2 className="display-3 mt-3">See the foundation.</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Tokens, type scale, buttons, status chips and the full route map are
            already audited on the design system page.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-[6px] border-2 border-ink bg-lime px-4 text-sm font-semibold text-primary-foreground shadow-offset-sm transition-transform hover:-translate-y-0.5"
          >
            Open design system
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
