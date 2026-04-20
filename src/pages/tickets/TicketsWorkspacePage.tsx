import { Link } from 'react-router-dom';
import { TicketStats } from '@/features/tickets/components/TicketStats';
import { TicketQueueTable } from '@/features/tickets/components/TicketQueueTable';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import '@/features/tickets/styles/tickets.css';

export function TicketsWorkspacePage() {
  const tickets = getTickets();

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Tickets</span>
          <h2>Support Queue</h2>
          <p>
            Track InEx Ledger support issues across auth, receipts, exports,
            billing, and data problems.
          </p>
        </div>

        <Link to="/tickets/new" className="ticket-primary-action">
          Create Ticket
        </Link>
      </div>

      <TicketStats tickets={tickets} />
      <div style={{ height: 16 }} />
      <TicketQueueTable tickets={tickets} />
    </section>
  );
}