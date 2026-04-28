import { useMemo, useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { TicketDetailSummary } from '@/features/tickets/components/TicketDetailSummary';
import { TicketActivityTimeline } from '@/features/tickets/components/TicketActivityTimeline';
import { getSettings } from '@/features/settings/lib/settingsStore';
import {
  getTicketById,
  updateTicketAssignment,
  updateTicketPriority,
  updateTicketStatus,
} from '@/features/tickets/lib/ticketStore';
import type { TicketPriority, TicketStatus } from '@/types/tickets';
import '@/features/tickets/styles/tickets.css';

function labelize(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function TicketDetailWorkspacePage() {
  const { ticketId = '' } = useParams();
  const [version, setVersion] = useState(0);

  const ticket = useMemo(() => getTicketById(ticketId), [ticketId, version]);
  const settings = useMemo(() => getSettings(), [version]);

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

  function refreshTicket() {
    setVersion((current) => current + 1);
  }

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value as TicketStatus;
    if (nextStatus === ticket.status) return;
    updateTicketStatus(ticket.id, nextStatus);
    refreshTicket();
  }

  function handlePriorityChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextPriority = event.target.value as TicketPriority;
    if (nextPriority === ticket.priority) return;
    updateTicketPriority(ticket.id, nextPriority);
    refreshTicket();
  }

  function handleAssignedTechChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextAssignedTech = event.target.value.trim();
    if (nextAssignedTech === ticket.assignedTech) return;
    updateTicketAssignment(ticket.id, nextAssignedTech);
    refreshTicket();
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
            <select value={ticket.status} onChange={handleStatusChange}>
              {settings.statuses.map((value) => (
                <option key={value} value={value}>
                  {labelize(value)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Priority
            <select value={ticket.priority} onChange={handlePriorityChange}>
              {settings.priorities.map((value) => (
                <option key={value} value={value}>
                  {labelize(value)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Assigned Tech
            <select value={ticket.assignedTech} onChange={handleAssignedTechChange}>
              {['Unassigned', ...settings.technicians].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
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
            <strong>Linked Errors</strong>
            <p>{ticket.relatedErrorIds.length ? ticket.relatedErrorIds.join(', ') : '—'}</p>
          </div>
          <div>
            <strong>Linked Incident</strong>
            <p>{ticket.relatedIncidentId || '—'}</p>
          </div>
          <div>
            <strong>Linked Resolution</strong>
            <p>{ticket.relatedResolutionId || '—'}</p>
          </div>
          <div>
            <strong>Knowledge Articles</strong>
            <p>{ticket.relatedKnowledgeArticleIds.length ? ticket.relatedKnowledgeArticleIds.join(', ') : '—'}</p>
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
