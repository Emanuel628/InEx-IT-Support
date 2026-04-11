import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function DataPage() {
  return (
    <PlaceholderPage
      title="Data"
      description="Import, export, and data utility workspace."
      cards={[
        { title: 'Import', body: 'Bring in users, assets, or tickets later.' },
        { title: 'Export', body: 'Download structured data for reporting or backup.' },
        { title: 'Utilities', body: 'Prepare the app for local-first operations.' },
      ]}
    />
  );
}
