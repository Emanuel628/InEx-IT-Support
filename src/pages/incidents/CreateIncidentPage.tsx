import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function CreateIncidentPage() {
  return (
    <PlaceholderPage
      title="Create Incident"
      description="Scaffold page for logging a larger support event."
      cards={[
        { title: 'Summary', body: 'Capture title, status, severity, and affected areas.' },
        { title: 'Impact', body: 'Document customer impact, workaround, and timeline notes.' },
        { title: 'Links', body: 'Prepare links to tickets, errors, releases, and resolutions.' },
      ]}
    />
  );
}
