import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function CreateErrorPage() {
  return (
    <PlaceholderPage
      title="Log Error"
      description="Manual entry scaffold for technical failures affecting InEx Ledger."
      cards={[
        { title: 'Error Summary', body: 'Capture message, source, app area, environment, and severity.' },
        { title: 'Raw Diagnostics', body: 'Record raw log snippets, stack traces, and notes.' },
        { title: 'Linked Records', body: 'Prepare links to tickets, incidents, releases, and resolutions.' },
      ]}
    />
  );
}
