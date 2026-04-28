import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import '@/features/tickets/styles/tickets.css';

function badgeClass(value: string) {
  return `ticket-badge is-${value}`;
}

export function IncidentsPage() {
  const incidents = getIncidents();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [environment, setEnvironment] = useState('all');

  const filtered = useMemo(() => {
    return incidents.filter((record) => {
      const matchesSearch = !search.trim() || [record.id, record.title, record.customerImpact, record.environment].join(' ').toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = status === 'all' || record.status === status;
      const matchesSeverity = severity === 'all' || record.severity === severity;
      const matchesEnvironment = environment === 'all' || record.environment === environment;
      return matchesSearch && matchesStatus && matchesSeverity && matchesEnvironment;
    });
  }, [environment, incidents, search, severity, status]);

  const activeCount = incidents.filter((record) => record.status !== 'resolved').length;
  const criticalCount = incidents.filter((record) => record.severity === 'critical').length;
  const resolvedCount = incidents.filter((record) => record.status === 'resolved').length;

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Incidents</span>
          <h2>Incident Desk</h2>
          <p>Track larger production and support events affecting multiple users or system areas.</p>
        </div>
        <Link to="/incidents/new" className="ticket-primary-action">Log Incident</Link>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Total Incidents</span><strong>{incidents.length}</strong></article>
        <article className="ticket-stat-card"><span>Active</span><strong>{activeCount}</strong></article>
        <article className="ticket-stat-card"><span>Critical</span><strong>{criticalCount}</strong></article>
        <article className="ticket-stat-card"><span>Resolved</span><strong>{resolvedCount}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Search + Filters</h3>
          <span>Find incidents by impact, severity, environment, or current status.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by id, title, impact, or environment" />
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="investigating">Investigating</option>
              <option value="identified">Identified</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
              <option value="postmortem_needed">Postmortem Needed</option>
            </select>
          </label>
          <label>
            Severity
            <select value={severity} onChange={(event) => setSeverity(event.target.value)}>
              <option value="all">All severities</option>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
            </select>
          </label>
          <label>
            Environment
            <select value={environment} onChange={(event) => setEnvironment(event.target.value)}>
              <option value="all">All environments</option>
              {Array.from(new Set(incidents.map((record) => record.environment))).map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {filtered.length ? (
        <div className="ticket-table-wrap">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Incident</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Environment</th>
                <th>Affected Areas</th>
                <th>Started</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id}>
                  <td>
                    <Link to={`/incidents/${record.id}`} className="ticket-title-cell">
                      <strong>{record.title}</strong>
                      <span>{record.id} · {record.customerImpact}</span>
                    </Link>
                  </td>
                  <td><span className="ticket-badge is-status">{record.status.replace(/_/g, ' ')}</span></td>
                  <td><span className={badgeClass(record.severity)}>{record.severity}</span></td>
                  <td>{record.environment}</td>
                  <td>{record.affectedAreas.join(', ') || '—'}</td>
                  <td>{record.startedAt}</td>
                  <td>
                    {record.relatedTicketIds.length ? `T:${record.relatedTicketIds.length}` : '—'}
                    {record.relatedErrorIds.length ? ` · E:${record.relatedErrorIds.length}` : ''}
                    {record.relatedResolutionId ? ' · R' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="ticket-empty-state">
          <span>No matching incidents</span>
          <p>Try a broader search or reset the current filters.</p>
        </section>
      )}
    </section>
  );
}
