import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function DataPage() {
  return (
    <PlaceholderPage
      title="Data"
      description="Import, export, reset, and utility workspace for local-first support data."
      cards={[
        { title: 'Import', body: 'Bring in support records, settings, and local snapshots safely.' },
        { title: 'Export', body: 'Download structured support data for transfer, reporting, or archive.' },
        { title: 'Utilities', body: 'Prepare schema checks, reset-to-demo actions, and item counts.' },
      ]}
    />
  );
}
