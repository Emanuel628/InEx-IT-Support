import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Configuration hub for local-first support workflow vocabulary and defaults."
      cards={[
        { title: 'Workflow', body: 'Adjust statuses, priorities, sources, and support rules.' },
        { title: 'Team', body: 'Manage technicians, queue ownership, and assignment defaults.' },
        { title: 'Local Controls', body: 'Review backup, export, import, and support-data preferences.' },
      ]}
    />
  );
}
