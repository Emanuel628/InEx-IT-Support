import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TicketDetailSummary } from '@/features/tickets/components/TicketDetailSummary';
import { TicketActivityTimeline } from '@/features/tickets/components/TicketActivityTimeline';
import { getTicketById, updateTicketStatus } from '@/features/tickets/lib/ticketStore';
import type { TicketStatus } from '@/types/tickets';
import '@/features/tickets/styles/tickets.css';

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting_on_user', label: 'Waiting on User' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'resolved', label: 'Resolved' },
];

export function TicketDetailWorkspacePage() {
  const { ticketId = '' } = useParams();
  const [version, setVersion] = useState(0);

  const ticket = useMemo(() => getTicketById(ticketId), [ticketId, version]);

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

  function handleStatusChange(nextStatus: TicketStatus) {
    if (nextStatus === ticket.status) return;
    updateTicketStatus(ticket.id, nextStatus);
    setVersion((current) => current + 1);
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
          <h3>Ticket Controls</h3>
          <span>Update support workflow state</span>
        </div>

        <div className="ticket-form-grid">
          <label>
            Status
            <select
              value={ticket.status}
              onChange={(event) => handleStatusChange(event.target.value as TicketStatus)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Priority
            <input type="text" value={ticket.priority} readOnly />
          </label>

          <label>
            Assigned Tech
            <input type="text" value={ticket.assignedTech} readOnly />
          </label>

          <label>
            App Area
            <input type="text" value={ticket.appArea} readOnly />
          </label>
        </div>
      </section>

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