import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function TicketDetailPage() {
  return (
    <PlaceholderPage
      title="Ticket Detail"
      description="Full ticket record with activity, notes, and resolution tracking."
      cards={[
        { title: 'Summary', body: 'Issue context, affected user, and linked asset.' },
        { title: 'Timeline', body: 'Internal notes and support actions in order.' },
        { title: 'Resolution', body: 'Track final fix and closeout details.' },
      ]}
    />
  );
}
