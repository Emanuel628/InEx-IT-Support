import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function BackupsPage() {
  return (
    <PlaceholderPage
      title="Backups"
      description="Backup and restore planning for local support data."
      cards={[
        { title: 'Backup Jobs', body: 'Protect the local system state.' },
        { title: 'Restore Flow', body: 'Recover quickly after errors or device loss.' },
        { title: 'History', body: 'Track when data snapshots were taken.' },
      ]}
    />
  );
}
