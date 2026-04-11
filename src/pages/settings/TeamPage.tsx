import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function TeamPage() {
  return (
    <PlaceholderPage
      title="Team"
      description="Technician management and ownership rules."
      cards={[
        { title: 'Technicians', body: 'Track active support staff.' },
        { title: 'Assignments', body: 'Define who owns which queues.' },
        { title: 'Roles', body: 'Prepare for future permissions if needed.' },
      ]}
    />
  );
}
