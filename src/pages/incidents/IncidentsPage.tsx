import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function IncidentsPage() {
  return (
    <PlaceholderPage
      title="Incidents"
      description="Major support event tracking for larger InEx Ledger problems."
      cards={[
        { title: 'Active Incidents', body: 'Monitor larger support events and current status.' },
        { title: 'Impact', body: 'Track affected areas, customer impact, and workaround notes.' },
        { title: 'Linked Records', body: 'Tie incidents to tickets, errors, releases, and resolutions.' },
      ]}
    />
  );
}
