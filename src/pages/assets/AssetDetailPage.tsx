import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function AssetDetailPage() {
  return (
    <PlaceholderPage
      title="Asset Detail"
      description="Detailed view for a specific device or hardware item."
      cards={[
        { title: 'Device Profile', body: 'Asset tag, serial number, model, and owner.' },
        { title: 'Support History', body: 'Linked incidents and service notes.' },
        { title: 'Status', body: 'Warranty, location, and lifecycle state.' },
      ]}
    />
  );
}
