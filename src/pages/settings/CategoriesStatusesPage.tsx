import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function CategoriesStatusesPage() {
  return (
    <PlaceholderPage
      title="Categories & Statuses"
      description="Manage the shared vocabulary of the support workflow."
      cards={[
        { title: 'Issue Categories', body: 'Organize incoming problems consistently.' },
        { title: 'Priorities', body: 'Define urgency levels.' },
        { title: 'Statuses', body: 'Map each stage of ticket progress.' },
      ]}
    />
  );
}
