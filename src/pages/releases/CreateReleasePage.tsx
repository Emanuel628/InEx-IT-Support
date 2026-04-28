import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function CreateReleasePage() {
  return (
    <PlaceholderPage
      title="New Release Record"
      description="Scaffold page for documenting a product change or deployment."
      cards={[
        { title: 'Release Basics', body: 'Capture version, commit, environment, and release date.' },
        { title: 'Change Summary', body: 'Document changed areas, migrations, and known risks.' },
        { title: 'Support Context', body: 'Link the release to tickets, errors, incidents, and resolutions.' },
      ]}
    />
  );
}
