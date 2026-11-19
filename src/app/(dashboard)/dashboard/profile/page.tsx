import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Customer profile' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="06"
      title='Your account, on paper'
      description='Name, photo, phone, delivery address and password, with the Google-linked account state made obvious.'
      sections={[
      'Profile form with validation states',
      'Avatar upload placeholder',
      'Password and linked-account panel',
      'Danger zone with confirmation dialog',
      ]}
      parent={{ label: 'Overview', href: '/dashboard' }}
    />
  );
}
