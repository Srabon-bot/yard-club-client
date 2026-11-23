import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { getPlatformStats } from "@/lib/data/stats";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide the counters entirely when the public API is unavailable; never show
  // placeholder numbers in their place.
  const stats = await getPlatformStats().catch(() => null);

  return (
    <div className="grid min-h-svh lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r-2 border-ink bg-lime p-10 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #060605 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <Logo className="relative" />

        <div className="relative max-w-md">
          <p className="eyebrow text-ink/60">The yard, in one place</p>
          <p className="mt-4 font-heading text-[clamp(2rem,3vw,2.9rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#060605]">
            Heavy gear,
            <br />
            light paperwork.
            <br />
            <span className="bg-[#060605] px-1.5 text-lime">Zero storage.</span>
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/70">
            One account books excavators, cinema bodies and generators across
            Dhaka and Chattogram. Handover checklist included.
          </p>
        </div>

        {stats && (
          <dl className="relative grid grid-cols-3 gap-4 border-t-2 border-[#060605]/30 pt-6">
            {[
              [String(stats.equipment.approved), "Approved equipment"],
              [String(stats.users.owners), "Owners"],
              [
                stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—",
                "Average rating",
              ],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/55">
                  {label}
                </dt>
                <dd className="mt-1 font-mono text-2xl font-medium tabular-nums text-[#060605]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </aside>

      <div className="flex min-h-svh flex-col">
        <header className="flex items-center justify-between border-b-2 border-ink px-5 py-4 sm:px-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft lg:inline">
            Secure account access
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-secondary hover:text-foreground"
          >
            Back to site
          </Link>
        </header>
        <div className="grid flex-1 place-items-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <footer className="border-t-2 border-ink px-5 py-4 sm:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
            © 2026 Yardclub · Dhaka
          </p>
        </footer>
      </div>
    </div>
  );
}
