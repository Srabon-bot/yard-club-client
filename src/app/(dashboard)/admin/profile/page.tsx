import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Admin profile' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="08"
      title='Your operator account'
      description='Admin identity, access level and security settings. Deliberately smaller than the other profiles.'
      sections={[
      'Identity and contact fields',
      'Access-level summary',
      'Password and session panel',
      'Audit note',
      ]}
      parent={{ label: 'Overview', href: '/admin' }}
    />
  );
}
