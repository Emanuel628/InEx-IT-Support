import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function LoginPage() {
  return (
    <PlaceholderPage
      title="Login"
      description="Reserved route for future authentication or protected mode."
      cards={[
        { title: 'Access', body: 'Optional login if shared deployment is added later.' },
        { title: 'Session', body: 'Leave room for technician-specific views.' },
        { title: 'Future Ready', body: 'Not required for local-only MVP.' },
      ]}
    />
  );
}
