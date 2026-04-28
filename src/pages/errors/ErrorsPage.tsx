import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function ErrorsPage() {
  return (
    <PlaceholderPage
      title="Errors"
      description="Technical error log desk for InEx Ledger failures, bad responses, and recurring system problems."
      cards={[
        { title: 'New Errors', body: 'Track fresh failures by source, severity, and app area.' },
        { title: 'Recurring Patterns', body: 'Identify repeated auth, billing, export, and API issues.' },
        { title: 'Linked Support Work', body: 'Connect errors to tickets, incidents, and resolutions.' },
      ]}
    />
  );
}
