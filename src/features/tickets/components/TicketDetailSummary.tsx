import type { TicketRecord } from '@/types/tickets';

export function TicketDetailSummary({ ticket }: { ticket: TicketRecord }) {
  return (
    <div className="ticket-detail-layout">
      <section className="ticket-detail-card">
        <span className="ticket-detail-label">Ticket</span>
        <strong>{ticket.id}</strong>
        <p>{ticket.title}</p>
      </section>

      <section className="ticket-detail-card">
        <span className="ticket-detail-label">Requester</span>
        <strong>{ticket.requester}</strong>
        <p>{ticket.requesterEmail || ticket.department}</p>
      </section>

      <section className="ticket-detail-card">
        <span className="ticket-detail-label">Assignment</span>
        <strong>{ticket.assignedTech || 'Unassigned'}</strong>
        <p>{ticket.status.replace('_', ' ')}</p>
      </section>

      <section className="ticket-detail-card">
        <span className="ticket-detail-label">Context</span>
        <strong>{ticket.appArea}</strong>
        <p>
          {ticket.category} · {ticket.environment}
        </p>
      </section>
    </div>
  );
}