import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function UsersPage() {
  return (
    <PlaceholderPage
      title="Users"
      description="Directory for employee lookup and support history."
      cards={[
        { title: 'User Search', body: 'Find employees by name, email, or department.' },
        { title: 'History', body: 'Review past tickets and recurring issues.' },
        { title: 'Assignments', body: 'See linked devices and support ownership.' },
      ]}
    />
  );
}
