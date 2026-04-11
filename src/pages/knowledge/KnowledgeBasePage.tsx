import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function KnowledgeBasePage() {
  return (
    <PlaceholderPage
      title="Knowledge Base"
      description="Internal library for common fixes and support procedures."
      cards={[
        { title: 'Articles', body: 'Searchable support documentation.' },
        { title: 'Templates', body: 'Standard procedures and troubleshooting guides.' },
        { title: 'Reuse', body: 'Reduce repeated work with common fixes.' },
      ]}
    />
  );
}
