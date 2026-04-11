import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function CreateTicketPage() {
  return (
    <PlaceholderPage
      title="Create Ticket"
      description="Ticket intake screen for fast issue logging."
      cards={[
        { title: 'Requester', body: 'Select the user needing help.' },
        { title: 'Issue Details', body: 'Capture title, summary, category, and priority.' },
        { title: 'Assignment', body: 'Route to a technician or support queue.' },
      ]}
    />
  );
}
