import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="System configuration hub."
      cards={[
        { title: 'Workflow', body: 'Adjust statuses, priorities, and support rules.' },
        { title: 'Team', body: 'Manage technicians and assignment defaults.' },
        { title: 'Data Controls', body: 'Handle imports, backups, and exports.' },
      ]}
    />
  );
}
