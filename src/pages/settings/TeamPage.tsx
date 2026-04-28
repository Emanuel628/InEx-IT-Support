import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function TeamPage() {
  return (
    <PlaceholderPage
      title="Team"
      description="Technician management and support assignment defaults."
      cards={[
        { title: 'Technicians', body: 'Track active support staff and queue coverage.' },
        { title: 'Assignments', body: 'Define who owns which support workflows by default.' },
        { title: 'Escalation Readiness', body: 'Prepare team-level rules for later workflow settings.' },
      ]}
    />
  );
}
