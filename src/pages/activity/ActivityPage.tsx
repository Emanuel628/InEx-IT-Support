import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function ActivityPage() {
  return (
    <PlaceholderPage
      title="Activity"
      description="Global chronological view of support actions."
      cards={[
        { title: 'Updates', body: 'See ticket changes, assignments, and notes.' },
        { title: 'Audit Trail', body: 'Track who did what and when.' },
        { title: 'Follow-Up', body: 'Spot stalled work or recent changes fast.' },
      ]}
    />
  );
}
