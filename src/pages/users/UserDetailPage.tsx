import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function UserDetailPage() {
  return (
    <PlaceholderPage
      title="User Detail"
      description="Full user support profile."
      cards={[
        { title: 'Profile', body: 'Contact details, department, and location.' },
        { title: 'Assets', body: 'Devices assigned to the user.' },
        { title: 'Ticket History', body: 'Past and current support interactions.' },
      ]}
    />
  );
}
