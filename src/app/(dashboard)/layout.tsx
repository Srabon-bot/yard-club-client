import { SiteHeader } from "@/components/site/site-header";

// Session-backed dashboards read request data, so they render as blocking routes.
export const instant = false;

export default function DashboardLayout({
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
      <main id="main">{children}</main>
    </>
  );
}
