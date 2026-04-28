import { Link } from 'react-router-dom';
import { getActivity } from '@/features/activity/lib/activityStore';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import '@/features/tickets/styles/tickets.css';

export function DashboardPage() {
  const tickets = getTickets();
  const incidents = getIncidents();
  const errors = getErrors();
  const activity = getActivity().slice(0, 8);

  const openTickets = tickets.filter((ticket) => !['resolved', 'archived'].includes(ticket.status));
  const criticalTickets = openTickets.filter((ticket) => ticket.priority === 'critical' || ticket.severity === 'critical');
  const waitingOnUser = openTickets.filter((ticket) => ticket.status === 'waiting_on_user');
  const escalatedTickets = openTickets.filter((ticket) => ticket.status === 'escalated');
  const activeIncidents = incidents.filter((incident) => incident.status !== 'resolved');
  const newOrRecurringErrors = errors.filter((error) => error.status === 'new' || error.status === 'recurring').slice(0, 6);
  const myQueue = openTickets.filter((ticket) => ticket.assignedTech && ticket.assignedTech !== 'Unassigned').slice(0, 6);
  const recentlyUpdatedTickets = tickets.slice(0, 6);

  const categoryCounts = openTickets.reduce<Record<string, number>>((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {});

  const commonIssueCategories = Object.entries(categoryCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Dashboard</span>
          <h2>Daily Support Command Center</h2>
          <p>See what needs attention right now across tickets, incidents, errors, and recent support activity.</p>
        </div>
        <Link to="/tickets/new" className="ticket-primary-action">Quick Create Ticket</Link>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Open Tickets</span><strong>{openTickets.length}</strong></article>
        <article className="ticket-stat-card"><span>Critical Tickets</span><strong>{criticalTickets.length}</strong></article>
        <article className="ticket-stat-card"><span>Waiting on User</span><strong>{waitingOnUser.length}</strong></article>
        <article className="ticket-stat-card"><span>Escalated</span><strong>{escalatedTickets.length}</strong></article>
        <article className="ticket-stat-card"><span>Active Incidents</span><strong>{activeIncidents.length}</strong></article>
        <article className="ticket-stat-card"><span>New / Recurring Errors</span><strong>{newOrRecurringErrors.length}</strong></article>
      </div>

      <div className="ticket-detail-grid">
        <section className="ticket-detail-panel">
          <div className="ticket-section-header">
            <h3>My Queue</h3>
            <span>Tickets already assigned and ready for follow-up.</span>
          </div>
          <div className="ticket-detail-stack">
            {myQueue.length ? myQueue.map((ticket) => (
              <article key={ticket.id} className="ticket-activity-item">
                <div className="ticket-activity-meta">
                  <strong>{ticket.title}</strong>
                  <span>{ticket.id}</span>
                </div>
                <p>{ticket.assignedTech} · {ticket.status.replace(/_/g, ' ')}</p>
              </article>
            )) : <p>No assigned tickets in queue.</p>}
          </div>
          <div className="ticket-inline-actions">
            <Link to="/tickets">Open Tickets</Link>
          </div>
        </section>

        <section className="ticket-detail-panel">
          <div className="ticket-section-header">
            <h3>Recently Updated Tickets</h3>
            <span>Most recently touched support work.</span>
          </div>
          <div className="ticket-detail-stack">
            {recentlyUpdatedTickets.length ? recentlyUpdatedTickets.map((ticket) => (
              <article key={ticket.id} className="ticket-activity-item">
                <div className="ticket-activity-meta">
                  <strong>{ticket.title}</strong>
                  <span>{ticket.updatedAt}</span>
                </div>
                <p>{ticket.id} · {ticket.status.replace(/_/g, ' ')} · {ticket.priority}</p>
              </article>
            )) : <p>No ticket updates yet.</p>}
          </div>
          <div className="ticket-inline-actions">
            <Link to="/tickets">View Ticket Queue</Link>
          </div>
        </section>
      </div>

      <div className="ticket-detail-grid">
        <section className="ticket-detail-panel">
          <div className="ticket-section-header">
            <h3>Active Incidents</h3>
            <span>Production or support events still in progress.</span>
          </div>
          <div className="ticket-detail-stack">
            {activeIncidents.length ? activeIncidents.map((incident) => (
              <article key={incident.id} className="ticket-activity-item">
                <div className="ticket-activity-meta">
                  <strong>{incident.title}</strong>
                  <span>{incident.id}</span>
                </div>
                <p>{incident.status.replace(/_/g, ' ')} · {incident.severity} · {incident.environment}</p>
              </article>
            )) : <p>No active incidents.</p>}
          </div>
          <div className="ticket-inline-actions">
            <Link to="/incidents">Open Incidents</Link>
          </div>
        </section>

        <section className="ticket-detail-panel">
          <div className="ticket-section-header">
            <h3>New / Recurring Errors</h3>
            <span>Technical issues that may need triage or follow-up.</span>
          </div>
          <div className="ticket-detail-stack">
            {newOrRecurringErrors.length ? newOrRecurringErrors.map((error) => (
              <article key={error.id} className="ticket-activity-item">
                <div className="ticket-activity-meta">
                  <strong>{error.title}</strong>
                  <span>{error.id}</span>
                </div>
                <p>{error.status.replace(/_/g, ' ')} · {error.severity} · {error.appArea}</p>
              </article>
            )) : <p>No new or recurring errors.</p>}
          </div>
          <div className="ticket-inline-actions">
            <Link to="/errors">Open Errors</Link>
          </div>
        </section>
      </div>

      <div className="ticket-detail-grid">
        <section className="ticket-detail-panel">
          <div className="ticket-section-header">
            <h3>Common Issue Categories</h3>
            <span>Open-ticket categories surfacing most often right now.</span>
          </div>
          <div className="ticket-detail-stack">
            {commonIssueCategories.length ? commonIssueCategories.map(([category, count]) => (
              <article key={category} className="ticket-activity-item">
                <div className="ticket-activity-meta">
                  <strong>{category}</strong>
                  <span>{count}</span>
                </div>
              </article>
            )) : <p>No category trends yet.</p>}
          </div>
        </section>

        <section className="ticket-detail-panel">
          <div className="ticket-section-header">
            <h3>Recent Activity</h3>
            <span>Latest support actions recorded across the app.</span>
          </div>
          <div className="ticket-detail-stack">
            {activity.length ? activity.map((item) => (
              <article key={item.id} className="ticket-activity-item">
                <div className="ticket-activity-meta">
                  <strong>{item.summary}</strong>
                  <span>{item.timestamp}</span>
                </div>
                <p>{item.entityType} · {item.actor}</p>
              </article>
            )) : <p>No recent activity yet.</p>}
          </div>
          <div className="ticket-inline-actions">
            <Link to="/activity">Open Activity</Link>
          </div>
        </section>
      </div>
    </section>
  );
}
