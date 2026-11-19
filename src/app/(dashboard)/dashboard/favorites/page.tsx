import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Favourites' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="06"
      title='Saved for the next job'
      description='Equipment the customer starred, with availability, current price and a direct route back to booking.'
      sections={[
      'Saved equipment grid',
      'Price and availability summary',
      'Remove-from-favourites action',
      'Empty state with browse CTA',
      ]}
      parent={{ label: 'Overview', href: '/dashboard' }}
    />
  );
}
