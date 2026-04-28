import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function ResolutionsPage() {
  return (
    <PlaceholderPage
      title="Resolutions"
      description="Historical records of what fixed real InEx Ledger support problems."
      cards={[
        { title: 'Solved Cases', body: 'Review exact fixes and verification steps from prior issues.' },
        { title: 'Root Cause History', body: 'Track recurring problem patterns and final fixes.' },
        { title: 'Linked Records', body: 'Connect resolutions to tickets, errors, incidents, and releases.' },
      ]}
    />
  );
}
