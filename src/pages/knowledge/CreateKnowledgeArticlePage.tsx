import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function CreateKnowledgeArticlePage() {
  return (
    <PlaceholderPage
      title="New Knowledge Article"
      description="Scaffold page for reusable troubleshooting and support procedures."
      cards={[
        { title: 'Article Basics', body: 'Set title, type, category, and app area.' },
        { title: 'Support Guidance', body: 'Capture symptoms, cause, troubleshooting, and resolution steps.' },
        { title: 'Related Records', body: 'Link the article to tickets, resolutions, and known issues.' },
      ]}
    />
  );
}
