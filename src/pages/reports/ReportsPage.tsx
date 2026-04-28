import { getBusinesses } from '@/features/businesses/lib/businessStore';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import '@/features/tickets/styles/tickets.css';

function countBy<T extends string>(values: T[]) {
  return Object.entries(values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);
}

export function ReportsPage() {
  const tickets = getTickets();
  const errors = getErrors();
  const incidents = getIncidents();
  const businesses = getBusinesses();

  const ticketsByStatus = countBy(tickets.map((record) => record.status));
  const ticketsByCategory = countBy(tickets.map((record) => record.category));
  const ticketsByAppArea = countBy(tickets.map((record) => record.appArea));
  const ticketsByPriority = countBy(tickets.map((record) => record.priority));
  const ticketsByEnvironment = countBy(tickets.map((record) => record.environment));
  const errorsBySource = countBy(errors.map((record) => record.source));
  const errorsByAppArea = countBy(errors.map((record) => record.appArea));
  const incidentsByStatus = countBy(incidents.map((record) => record.status));
  const incidentsBySeverity = countBy(incidents.map((record) => record.severity));

  const mostAffectedBusinesses = businesses
    .map((record) => ({
      id: record.id,
      businessName: record.businessName,
      issueCount: record.linkedTicketIds.length + record.linkedErrorIds.length + record.linkedIncidentIds.length,
      subscriptionStatus: record.subscriptionStatus,
    }))
    .sort((a, b) => b.issueCount - a.issueCount)
    .slice(0, 8);

  const repeatedIssuePatterns = ticketsByCategory.slice(0, 8);

  const reportSections = [
    { title: 'Tickets by Status', rows: ticketsByStatus, valueLabel: 'Tickets' },
    { title: 'Tickets by Category', rows: ticketsByCategory, valueLabel: 'Tickets' },
    { title: 'Tickets by App Area', rows: ticketsByAppArea, valueLabel: 'Tickets' },
    { title: 'Tickets by Priority / Severity', rows: ticketsByPriority, valueLabel: 'Tickets' },
    { title: 'Tickets by Environment', rows: ticketsByEnvironment, valueLabel: 'Tickets' },
    { title: 'Errors by Source', rows: errorsBySource, valueLabel: 'Errors' },
    { title: 'Errors by App Area', rows: errorsByAppArea, valueLabel: 'Errors' },
    { title: 'Incidents by Status', rows: incidentsByStatus, valueLabel: 'Incidents' },
    { title: 'Incidents by Severity', rows: incidentsBySeverity, valueLabel: 'Incidents' },
    { title: 'Repeated Issue Patterns', rows: repeatedIssuePatterns, valueLabel: 'Open or Total' },
  ];

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Reports</span>
          <h2>Operational Visibility</h2>
          <p>Table-first summaries for support load, repeated patterns, issue distribution, and business impact.</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Total Tickets</span><strong>{tickets.length}</strong></article>
        <article className="ticket-stat-card"><span>Total Errors</span><strong>{errors.length}</strong></article>
        <article className="ticket-stat-card"><span>Total Incidents</span><strong>{incidents.length}</strong></article>
        <article className="ticket-stat-card"><span>Businesses With Issues</span><strong>{mostAffectedBusinesses.filter((record) => record.issueCount > 0).length}</strong></article>
      </div>

      <div className="ticket-detail-grid">
        {reportSections.map((section) => (
          <section key={section.title} className="ticket-detail-panel">
            <div className="ticket-section-header">
              <h3>{section.title}</h3>
              <span>{section.valueLabel} grouped for quick operational review.</span>
            </div>
            {section.rows.length ? (
              <div className="ticket-table-wrap">
                <table className="ticket-table">
                  <thead>
                    <tr>
                      <th>Group</th>
                      <th>{section.valueLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map(([label, count]) => (
                      <tr key={label}>
                        <td>{label}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No data yet.</p>
            )}
          </section>
        ))}
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Most Affected Businesses</h3>
          <span>Businesses with the highest combined ticket, error, and incident footprint.</span>
        </div>
        {mostAffectedBusinesses.length ? (
          <div className="ticket-table-wrap">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Business ID</th>
                  <th>Issue Count</th>
                  <th>Subscription</th>
                </tr>
              </thead>
              <tbody>
                {mostAffectedBusinesses.map((record) => (
                  <tr key={record.id}>
                    <td>{record.businessName}</td>
                    <td>{record.id}</td>
                    <td>{record.issueCount}</td>
                    <td>{record.subscriptionStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No business issue patterns yet.</p>
        )}
      </section>
    </section>
  );
}
