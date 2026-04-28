import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function ReleasesPage() {
  return (
    <PlaceholderPage
      title="Releases"
      description="Support-side release and deploy context for troubleshooting recent changes."
      cards={[
        { title: 'Recent Changes', body: 'Track recent deploys, migrations, and known risks.' },
        { title: 'Verification', body: 'Review release checklists and rollback notes.' },
        { title: 'Linked Issues', body: 'Connect releases to tickets, errors, incidents, and resolutions.' },
      ]}
    />
  );
}
