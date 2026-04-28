import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import '@/features/tickets/styles/tickets.css';

export function ResolutionsPage() {
  const resolutions = getResolutions();
  const [search, setSearch] = useState('');
  const [hasIncident, setHasIncident] = useState('all');
  const [hasRelease, setHasRelease] = useState('all');

  const filtered = useMemo(() => {
    return resolutions.filter((record) => {
      const matchesSearch = !search.trim() || [record.id, record.title, record.problemSummary, record.rootCause, record.fixApplied, record.tags.join(' ')].join(' ').toLowerCase().includes(search.trim().toLowerCase());
      const matchesIncident = hasIncident === 'all' || (hasIncident === 'yes' ? Boolean(record.relatedIncidentId) : !record.relatedIncidentId);
      const matchesRelease = hasRelease === 'all' || (hasRelease === 'yes' ? Boolean(record.relatedReleaseId) : !record.relatedReleaseId);
      return matchesSearch && matchesIncident && matchesRelease;
    });
  }, [filtered, hasIncident, hasRelease, resolutions, search]);

  const linkedIncidentCount = resolutions.filter((record) => record.relatedIncidentId).length;
  const linkedReleaseCount = resolutions.filter((record) => record.relatedReleaseId).length;
  const linkedKnowledgeCount = resolutions.filter((record) => record.relatedKnowledgeArticleIds.length).length;

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Resolutions</span>
          <h2>Historical Fix Records</h2>
          <p>Store exact solved-case history with root cause, fix details, verification, and rollback context.</p>
        </div>
        <Link to="/resolutions/new" className="ticket-primary-action">New Resolution</Link>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Total Resolutions</span><strong>{resolutions.length}</strong></article>
        <article className="ticket-stat-card"><span>Linked Incidents</span><strong>{linkedIncidentCount}</strong></article>
        <article className="ticket-stat-card"><span>Linked Releases</span><strong>{linkedReleaseCount}</strong></article>
        <article className="ticket-stat-card"><span>Linked KB Articles</span><strong>{linkedKnowledgeCount}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Search + Filters</h3>
          <span>Find exact historical fixes by problem summary, root cause, or whether they tie to incidents/releases.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, problem, root cause, fix, or tags" />
          </label>
          <label>
            Linked Incident
            <select value={hasIncident} onChange={(event) => setHasIncident(event.target.value)}>
              <option value="all">All</option>
              <option value="yes">Has incident</option>
              <option value="no">No incident</option>
            </select>
          </label>
          <label>
            Linked Release
            <select value={hasRelease} onChange={(event) => setHasRelease(event.target.value)}>
              <option value="all">All</option>
              <option value="yes">Has release</option>
              <option value="no">No release</option>
            </select>
          </label>
        </div>
      </section>

      {filtered.length ? (
        <div className="ticket-table-wrap">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Resolution</th>
                <th>Incident</th>
                <th>Release</th>
                <th>KB Links</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id}>
                  <td>
                    <Link to={`/resolutions/${record.id}`} className="ticket-title-cell">
                      <strong>{record.title}</strong>
                      <span>{record.id} · {record.problemSummary}</span>
                    </Link>
                  </td>
                  <td>{record.relatedIncidentId || '—'}</td>
                  <td>{record.relatedReleaseId || '—'}</td>
                  <td>{record.relatedKnowledgeArticleIds.length}</td>
                  <td>{record.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="ticket-empty-state">
          <span>No matching resolutions</span>
          <p>Try a broader search or reset the current filters.</p>
        </section>
      )}
    </section>
  );
}
