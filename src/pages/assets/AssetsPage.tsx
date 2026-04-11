import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function AssetsPage() {
  return (
    <PlaceholderPage
      title="Assets"
      description="Hardware and device inventory workspace."
      cards={[
        { title: 'Inventory', body: 'Track laptops, desktops, phones, and peripherals.' },
        { title: 'Ownership', body: 'See assigned user and status.' },
        { title: 'Lifecycle', body: 'Monitor warranty, notes, and replacement planning.' },
      ]}
    />
  );
}
