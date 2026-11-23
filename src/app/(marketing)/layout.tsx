import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

// Catalogue and about pages read live API data during the request.
export const dynamic = "force-dynamic";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="min-h-[70vh]">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
