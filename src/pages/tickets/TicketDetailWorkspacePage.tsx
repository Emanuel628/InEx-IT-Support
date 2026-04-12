import { TicketDetailSummary } from '@/features/tickets/components/TicketDetailSummary';
import { TicketActivityTimeline } from '@/features/tickets/components/TicketActivityTimeline';
import { mockTicketActivity } from '@/features/tickets/data/mockTicketActivity';
import { mockTickets } from '@/features/tickets/data/mockTickets';
import '@/features/tickets/styles/tickets.css';

const ticket = mockTickets[0];

export function TicketDetailWorkspacePage() {
  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Ticket Detail</span>
          <h2>{ticket.title}</h2>
          <p>Detailed support view for a single incident record.</p>
        </div>
      </div>

      <TicketDetailSummary ticket={ticket} />
      <TicketActivityTimeline items={mockTicketActivity} />
    </section>
  );
}
