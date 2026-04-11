import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Daily command center for support operations."
      cards={[
        { title: 'Open Tickets', body: 'Track new, assigned, and overdue work.' },
        { title: 'My Queue', body: 'Focus on what the current technician needs to work.' },
        { title: 'Recent Activity', body: 'Surface fresh changes and follow-up items.' },
      ]}
    />
  );
}
