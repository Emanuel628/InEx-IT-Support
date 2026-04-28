import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function CreateResolutionPage() {
  return (
    <PlaceholderPage
      title="New Resolution"
      description="Scaffold page for documenting an exact historical fix."
      cards={[
        { title: 'Problem Summary', body: 'Record what broke and who was affected.' },
        { title: 'Fix Applied', body: 'Capture the exact change, command, or workflow that fixed it.' },
        { title: 'Verification', body: 'Document how the fix was confirmed and what to watch afterward.' },
      ]}
    />
  );
}
