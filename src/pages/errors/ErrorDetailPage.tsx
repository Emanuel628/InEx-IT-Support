import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function ErrorDetailPage() {
  return (
    <PlaceholderPage
      title="Error Detail"
      description="Detailed support view for one technical failure record."
      cards={[
        { title: 'Failure Snapshot', body: 'Review message, source, environment, app area, and severity.' },
        { title: 'Diagnostic Context', body: 'Inspect raw logs, stack traces, and occurrence details.' },
        { title: 'Linked Support Flow', body: 'See connected tickets, incidents, releases, and resolutions.' },
      ]}
    />
  );
}
