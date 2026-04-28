import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function BusinessesPage() {
  return (
    <PlaceholderPage
      title="Businesses"
      description="Support-side account directory for InEx Ledger businesses."
      cards={[
        { title: 'Account Search', body: 'Find businesses by name, owner email, plan, or region.' },
        { title: 'Subscription Context', body: 'Review plan, subscription status, and additional business slots.' },
        { title: 'Linked Support History', body: 'See tickets, errors, and incidents tied to each business.' },
      ]}
    />
  );
}
