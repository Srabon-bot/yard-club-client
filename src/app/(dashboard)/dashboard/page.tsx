import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Customer overview' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="06"
      title='Your rentals, at a glance'
      description='The signed-in customer home: active and upcoming rentals, spend, favourites and a nudge to finish an unfinished booking.'
      sections={[
      'Active and upcoming rental cards',
      'Spend and rental-count stat row',
      'Recent favourites rail',
      'Empty first-run state',
      ]}
      parent={{ label: 'Overview', href: '/dashboard' }}
    />
  );
}
