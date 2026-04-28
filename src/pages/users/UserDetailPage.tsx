import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function UserDetailPage() {
  return (
    <PlaceholderPage
      title="User Detail"
      description="Support profile for one InEx Ledger user and their linked support history."
      cards={[
        { title: 'User Profile', body: 'Email, verification state, region, language, and subscription context.' },
        { title: 'Linked Businesses', body: 'Review related businesses and account relationships.' },
        { title: 'Support History', body: 'See current and past tickets, errors, and notes.' },
      ]}
    />
  );
}
