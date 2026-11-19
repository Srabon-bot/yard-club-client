import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Rental requests' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="07"
      title='Approve, hand over, close'
      description='Incoming requests with renter details, dates and totals, plus the actions that move a rental through its lifecycle.'
      sections={[
      'Request queue with approve and decline',
      'Active handover checklist',
      'Completed and cancelled history',
      'Detail drawer with contact details',
      ]}
      parent={{ label: 'Overview', href: '/owner' }}
    />
  );
}
