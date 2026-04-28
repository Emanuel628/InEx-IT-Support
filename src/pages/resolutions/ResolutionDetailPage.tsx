import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function ResolutionDetailPage() {
  return (
    <PlaceholderPage
      title="Resolution Detail"
      description="Detailed historical fix record for a resolved support problem."
      cards={[
        { title: 'Root Cause', body: 'Review the confirmed cause of the issue.' },
        { title: 'Fix Record', body: 'See the exact files, commands, and notes used to fix it.' },
        { title: 'Verification Trail', body: 'Inspect validation steps, rollback notes, and linked records.' },
      ]}
    />
  );
}
