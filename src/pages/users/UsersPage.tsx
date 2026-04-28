import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function UsersPage() {
  return (
    <PlaceholderPage
      title="Users"
      description="Support-side user directory for InEx Ledger customers and account history."
      cards={[
        { title: 'User Search', body: 'Find users by name, email, plan, or region.' },
        { title: 'Support History', body: 'Review linked tickets, errors, and prior follow-up.' },
        { title: 'Business Context', body: 'See related businesses, verification state, and subscription context.' },
      ]}
    />
  );
}
