import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports"
      description="Operational visibility for workloads and trends."
      cards={[
        { title: 'Volume', body: 'Tickets opened, closed, and aging trends.' },
        { title: 'Categories', body: 'See common issue patterns.' },
        { title: 'Technicians', body: 'Review workload and performance snapshots.' },
      ]}
    />
  );
}
