import Link from "next/link";
import { XLogo } from "@/components/site/logo";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { footerNav } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-[#060605] text-[#f9f9f6]">
      <div className="container-page pt-14 pb-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2.2fr] lg:gap-16">
          <div className="grid content-start gap-5">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Yardclub home">
              <span className="grid size-9 place-items-center rounded-[6px] border-2 border-[#060605] bg-lime font-mono text-[13px] font-bold text-[#060605]">
                YC
              </span>
              <span className="font-heading text-2xl font-extrabold leading-none tracking-[-0.05em]">
                yardclub<span className="text-lime">.</span>
              </span>
            </Link>
            <p className="max-w-[34ch] text-sm leading-relaxed text-white/60">
              Rent the gear, not the storage. Verified owners across Dhaka and
              Chattogram, with a handover checklist on both ends.
            </p>
            <div className="grid gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
                One drop a month
              </span>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title} className="grid content-start gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-lime">
                  {group.title}
                </span>
                {group.links.map((link) => (
                  <Link
                    key={`${group.title}-${link.label}`}
                    href={link.href}
                    className="w-fit text-sm text-white/65 transition-colors hover:text-white hover:underline hover:decoration-lime hover:decoration-2 hover:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5 text-xs text-white/50">
          <p>
            © 2026 Yardclub. Built in Dhaka.
            <span className="mx-2 text-white/20">/</span>
            <Link href="/faq" className="hover:text-white hover:underline">
              Terms
            </Link>
            <span className="mx-1">·</span>
            <Link href="/faq" className="hover:text-white hover:underline">
              Privacy
            </Link>
          </p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
              <i className="size-1.5 rounded-full bg-lime" aria-hidden="true" />
              All systems normal
            </span>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60 transition-colors hover:text-white"
              aria-label="Yardclub on X"
            >
              <XLogo className="size-3.5" />
              @yardclub
            </a>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-t border-white/10">
        <div className="container-page">
          <span
            aria-hidden="true"
            className="block select-none pt-2 font-heading text-[clamp(3.5rem,13vw,10rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-white/[0.07]"
          >
            YARDCLUB
          </span>
        </div>
      </div>
    </footer>
  );
}
