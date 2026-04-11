import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function NotFoundPage() {
  return (
    <PlaceholderPage
      title="Not Found"
      description="The page you requested does not exist in the current route map."
      cards={[
        { title: 'Navigation', body: 'Use the sidebar to return to a valid section.' },
        { title: 'Routing', body: 'This is the app fallback page.' },
        { title: 'Scaffold', body: 'Add more routes as features expand.' },
      ]}
    />
  );
}
