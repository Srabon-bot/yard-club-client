import { SiteHeader } from "@/components/site/site-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

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
      <main id="main">
        <DashboardShell>{children}</DashboardShell>
      </main>
    </>
  );
}
