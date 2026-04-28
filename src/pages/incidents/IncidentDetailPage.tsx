import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function IncidentDetailPage() {
  return (
    <PlaceholderPage
      title="Incident Detail"
      description="Detailed view for one incident and its linked support history."
      cards={[
        { title: 'Incident State', body: 'Review status, severity, environment, and affected areas.' },
        { title: 'Timeline', body: 'Track investigation, workaround, and resolution notes.' },
        { title: 'Connected Records', body: 'Inspect linked tickets, errors, releases, and resolutions.' },
      ]}
    />
  );
}
