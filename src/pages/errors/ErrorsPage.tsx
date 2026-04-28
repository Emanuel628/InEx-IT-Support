import { useMemo, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { getErrors } from '@/features/errors/lib/errorStore';
import type { ErrorLogSeverity, ErrorLogStatus } from '@/types/errors';
import '@/features/errors/styles/errors.css';

function badgeClass(value: string) {
  return `error-badge is-${value}`;
}

export function ErrorsPage() {
  const errors = getErrors();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | ErrorLogStatus>('all');
  const [severity, setSeverity] = useState<'all' | ErrorLogSeverity>('all');
  const [source, setSource] = useState('all');
  const [environment, setEnvironment] = useState('all');
  const [appArea, setAppArea] = useState('all');

  const filteredErrors = useMemo(() => {
    return errors.filter((record) => {
      const matchesSearch = !search.trim()
        || [record.id, record.title, record.message, record.appArea, record.environment, record.notes]
          .join(' ')
          .toLowerCase()
          .includes(search.trim().toLowerCase());
      const matchesStatus = status === 'all' || record.status === status;
      const matchesSeverity = severity === 'all' || record.severity === severity;
      const matchesSource = source === 'all' || record.source === source;
      const matchesEnvironment = environment === 'all' || record.environment === environment;
      const matchesAppArea = appArea === 'all' || record.appArea === appArea;
      return matchesSearch && matchesStatus && matchesSeverity && matchesSource && matchesEnvironment && matchesAppArea;
    });
  }, [appArea, environment, errors, search, severity, source, status]);

  const newCount = errors.filter((record) => record.status === 'new').length;
  const recurringCount = errors.filter((record) => record.status === 'recurring').length;
  const criticalCount = errors.filter((record) => record.severity === 'critical').length;
  const linkedCount = errors.filter((record) => record.relatedTicketIds.length || record.relatedIncidentId || record.relatedResolutionId).length;
  const investigatingCount = errors.filter((record) => record.status === 'investigating').length;
  const unresolvedCount = errors.filter((record) => !['fixed', 'ignored'].includes(record.status)).length;

  return (
    <section className="error-workspace-page">
      <div className="error-page-header">
        <div>
          <span className="error-page-eyebrow">Errors</span>
          <h2>Technical Error Log</h2>
          <p>Track technical failures, recurring system problems, and linked support follow-up.</p>
        </div>

        <Link to="/errors/new" className="error-primary-action">
          Log Error
        </Link>
      </div>

      <div className="error-stats-grid">
        <article className="error-stat-card"><span>Total Errors</span><strong>{errors.length}</strong></article>
        <article className="error-stat-card"><span>New</span><strong>{newCount}</strong></article>
        <article className="error-stat-card"><span>Critical</span><strong>{criticalCount}</strong></article>
        <article className="error-stat-card"><span>Recurring</span><strong>{recurringCount}</strong></article>
        <article className="error-stat-card"><span>Investigating</span><strong>{investigatingCount}</strong></article>
        <article className="error-stat-card"><span>Unresolved</span><strong>{unresolvedCount}</strong></article>
        <article className="error-stat-card"><span>Linked Records</span><strong>{linkedCount}</strong></article>
      </div>

      <section className="error-panel">
        <div className="error-section-header">
          <h3>Search + Filters</h3>
          <span>Source, environment, app area, severity, and status filters for technical triage</span>
        </div>

        <div className="error-filters-bar error-filters-bar-wide">
          <div className="error-filter-group error-filter-search">
            <label>
              Search
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by id, title, message, app area, environment, or notes"
              />
            </label>
          </div>

          <div className="error-filter-group">
            <label>
              Status
              <select value={status} onChange={(event: ChangeEvent<HTMLSelectElement>) => setStatus(event.target.value as 'all' | ErrorLogStatus)}>
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="triaged">Triaged</option>
                <option value="linked_to_ticket">Linked to Ticket</option>
                <option value="investigating">Investigating</option>
                <option value="fixed">Fixed</option>
                <option value="ignored">Ignored</option>
                <option value="recurring">Recurring</option>
              </select>
            </label>
          </div>

          <div className="error-filter-group">
            <label>
              Severity
              <select value={severity} onChange={(event: ChangeEvent<HTMLSelectElement>) => setSeverity(event.target.value as 'all' | ErrorLogSeverity)}>
                <option value="all">All severities</option>
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
            </label>
          </div>

          <div className="error-filter-group">
            <label>
              Source
              <select value={source} onChange={(event) => setSource(event.target.value)}>
                <option value="all">All sources</option>
                {Array.from(new Set(errors.map((record) => record.source))).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="error-filter-group">
            <label>
              Environment
              <select value={environment} onChange={(event) => setEnvironment(event.target.value)}>
                <option value="all">All environments</option>
                {Array.from(new Set(errors.map((record) => record.environment))).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="error-filter-group">
            <label>
              App Area
              <select value={appArea} onChange={(event) => setAppArea(event.target.value)}>
                <option value="all">All app areas</option>
                {Array.from(new Set(errors.map((record) => record.appArea))).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {filteredErrors.length ? (
        <div className="error-table-wrap">
          <table className="error-table">
            <thead>
              <tr>
                <th>Error</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Source</th>
                <th>App Area</th>
                <th>Environment</th>
                <th>Occurrences</th>
                <th>Last Seen</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {filteredErrors.map((record) => (
                <tr key={record.id}>
                  <td>
                    <Link to={`/errors/${record.id}`} className="error-title-cell">
                      <strong>{record.title}</strong>
                      <span>{record.id} · {record.message}</span>
                    </Link>
                  </td>
                  <td><span className="error-badge is-status">{record.status.replace(/_/g, ' ')}</span></td>
                  <td><span className={badgeClass(record.severity)}>{record.severity}</span></td>
                  <td>{record.source}</td>
                  <td>{record.appArea}</td>
                  <td>{record.environment}</td>
                  <td>{record.occurrenceCount}</td>
                  <td>{record.lastSeenAt}</td>
                  <td>
                    {record.relatedTicketIds.length ? `T:${record.relatedTicketIds.length}` : '—'}
                    {record.relatedIncidentId ? ' · I' : ''}
                    {record.relatedResolutionId ? ' · R' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="error-empty-state">
          <span>No matching errors</span>
          <p>Try a broader search or reset the status, severity, source, environment, and app-area filters.</p>
        </section>
      )}
    </section>
  );
}
