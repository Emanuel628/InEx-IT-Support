import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function ReleaseDetailPage() {
  return (
    <PlaceholderPage
      title="Release Detail"
      description="Detailed support view for one release record."
      cards={[
        { title: 'Release Snapshot', body: 'Review version, commit, environment, and date.' },
        { title: 'Risk + Verification', body: 'Inspect known risks, verification checklist, and rollback notes.' },
        { title: 'Linked Records', body: 'See related tickets, errors, incidents, and resolutions.' },
      ]}
    />
  );
}
