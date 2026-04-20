import { Link } from 'react-router-dom';
import type { TicketPriority, TicketRecord, TicketStatus } from '@/types/tickets';

function priorityClass(priority: TicketPriority) {
  switch (priority) {
    case 'critical':
      return 'is-critical';
    case 'high':
      return 'is-high';
    case 'medium':
      return 'is-medium';
    default:
      return 'is-low';
  }
}

function statusLabel(status: TicketStatus) {
  switch (status) {
    case 'in_progress':
      return 'In Progress';
    case 'waiting_on_user':
      return 'Waiting on User';
    default:
      return status.replace('_', ' ');
  }
}

export function TicketQueueTable({ tickets }: { tickets: TicketRecord[] }) {
  if (!tickets.length) {
    return (
      <div className="ticket-table-wrap">
        <div className="ticket-empty-state">
          <strong>No tickets yet.</strong>
          <p>Create the first InEx Ledger support ticket to start the queue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-table-wrap">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Title</th>
            <th>Requester</th>
            <th>Area</th>
            <th>Assigned Tech</th>
            <th>Updated</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>
                <Link to={`/tickets/${ticket.id}`}>{ticket.id}</Link>
              </td>
              <td>
                <span className={`ticket-badge ${priorityClass(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </td>
              <td>
                <span className="ticket-badge is-status">{statusLabel(ticket.status)}</span>
              </td>
              <td>
                <div className="ticket-title-cell">
                  <strong>
                    <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                  </strong>
                  <span>
                    {ticket.category} · {ticket.appArea} · {ticket.environment}
                  </span>
                </div>
              </td>
              <td>{ticket.requester}</td>
              <td>{ticket.asset}</td>
              <td>{ticket.assignedTech}</td>
              <td>{ticket.updatedAt}</td>
              <td>{ticket.dueAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}