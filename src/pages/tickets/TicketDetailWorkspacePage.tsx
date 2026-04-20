import { useParams } from 'react-router-dom';
import { TicketDetailSummary } from '@/features/tickets/components/TicketDetailSummary';
import { TicketActivityTimeline } from '@/features/tickets/components/TicketActivityTimeline';
import { getTicketById } from '@/features/tickets/lib/ticketStore';
import '@/features/tickets/styles/tickets.css';

export function TicketDetailWorkspacePage() {
  const { ticketId = '' } = useParams();
  const ticket = getTicketById(ticketId);

  if (!ticket) {
    return (
      <section className="ticket-workspace-page">
        <div className="ticket-page-header">
          <div>
            <span className="ticket-page-eyebrow">Ticket Detail</span>
            <h2>Ticket Not Found</h2>
            <p>The requested ticket does not exist in local storage yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Ticket Detail</span>
          <h2>{ticket.title}</h2>
          <p>
            {ticket.id} · {ticket.businessName} · {ticket.environment}
          </p>
        </div>
      </div>

      <TicketDetailSummary ticket={ticket} />

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Issue Context</h3>
          <span>InEx Ledger support details</span>
        </div>

        <div className="ticket-detail-stack">
          <div>
            <strong>Details</strong>
            <p>{ticket.details || '—'}</p>
          </div>
          <div>
            <strong>Reproduction Steps</strong>
            <p>{ticket.reproductionSteps || '—'}</p>
          </div>
          <div>
            <strong>Expected Result</strong>
            <p>{ticket.expectedResult || '—'}</p>
          </div>
          <div>
            <strong>Actual Result</strong>
            <p>{ticket.actualResult || '—'}</p>
          </div>
          <div>
            <strong>Workaround</strong>
            <p>{ticket.workaround || '—'}</p>
          </div>
          <div>
            <strong>Release</strong>
            <p>{ticket.relatedRelease || '—'}</p>
          </div>
          <div>
            <strong>Tags</strong>
            <p>{ticket.tags.length ? ticket.tags.join(', ') : '—'}</p>
          </div>
        </div>
      </section>

      <TicketActivityTimeline items={ticket.activity} />
    </section>
  );
}