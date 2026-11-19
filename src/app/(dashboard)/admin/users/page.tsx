import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'All users' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="08"
      title='Accounts and roles'
      description='Searchable user directory with role filters, join dates, status and suspend or restore actions.'
      sections={[
      'Search and role filters',
      'Server-side pagination',
      'Role and status chips',
      'Suspend and restore dialogs',
      ]}
      parent={{ label: 'Overview', href: '/admin' }}
    />
  );
}
