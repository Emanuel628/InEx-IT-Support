import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function KnowledgeArticleDetailPage() {
  return (
    <PlaceholderPage
      title="Knowledge Article Detail"
      description="Detailed KB article view."
      cards={[
        { title: 'Procedure', body: 'Step-by-step instructions for repeatable fixes.' },
        { title: 'Tags', body: 'Organize articles by platform or issue type.' },
        { title: 'Revision', body: 'Track updates as support standards evolve.' },
      ]}
    />
  );
}
