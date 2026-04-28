import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function WorkflowPage() {
  return (
    <PlaceholderPage
      title="Workflow Settings"
      description="Local-first support workflow vocabulary and status configuration."
      cards={[
        { title: 'Statuses', body: 'Configure support workflow states and display order.' },
        { title: 'Priorities + Sources', body: 'Adjust local dropdown values for triage.' },
        { title: 'Defaults', body: 'Define support-side defaults for forms and assignments.' },
      ]}
    />
  );
}
