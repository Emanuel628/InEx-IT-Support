import { TicketStats } from '@/features/tickets/components/TicketStats';
import { TicketQueueTable } from '@/features/tickets/components/TicketQueueTable';
import { mockTickets } from '@/features/tickets/data/mockTickets';

export function TicketsWorkspacePage() {
  return (
    <section className="placeholder-page">
      <h2>Tickets</h2>
      <p>
        First real ticket queue workspace using mock data. This is the screen that
        should replace the placeholder Tickets page once the router is rewired.
      </p>

      <TicketStats tickets={mockTickets} />
      <div style={{ height: 16 }} />
      <TicketQueueTable tickets={mockTickets} />
    </section>
  );
}
