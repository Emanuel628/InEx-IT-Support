import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function BusinessDetailPage() {
  return (
    <PlaceholderPage
      title="Business Detail"
      description="Support view for one InEx Ledger business and its linked history."
      cards={[
        { title: 'Business Profile', body: 'Owner email, plan, status, language, and region context.' },
        { title: 'Linked Issues', body: 'Tickets, errors, and incidents connected to this business.' },
        { title: 'Internal Notes', body: 'Support-side notes for account-specific troubleshooting.' },
      ]}
    />
  );
}
