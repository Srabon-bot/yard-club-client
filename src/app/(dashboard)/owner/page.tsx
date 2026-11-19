import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Owner overview' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="07"
      title='The yard, by the numbers'
      description='Earnings, active rentals, pending requests and listing performance for the signed-in owner.'
      sections={[
      'Earnings and rental stat cards',
      'Revenue chart by month',
      'Pending request queue',
      'Top listings table',
      ]}
      parent={{ label: 'Overview', href: '/owner' }}
    />
  );
}
