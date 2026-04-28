import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReleases } from '@/features/releases/lib/releaseStore';
import '@/features/tickets/styles/tickets.css';

export function ReleasesPage() {
  const releases = getReleases();
  const [search, setSearch] = useState('');
  const [environment, setEnvironment] = useState('all');
  const [hasMigrations, setHasMigrations] = useState('all');

  const filtered = useMemo(() => {
    return releases.filter((record) => {
      const haystack = [record.id, record.title, record.version, record.commitSha, record.summary, record.tags.join(' ')].join(' ').toLowerCase();
      const matchesSearch = !search.trim() || haystack.includes(search.trim().toLowerCase());
      const matchesEnvironment = environment === 'all' || record.environment === environment;
      const matchesMigrations = hasMigrations === 'all' || (hasMigrations === 'yes' ? record.migrationsIncluded : !record.migrationsIncluded);
      return matchesSearch && matchesEnvironment && matchesMigrations;
    });
  }, [environment, hasMigrations, releases, search]);

  const productionCount = releases.filter((record) => record.environment === 'production').length;
  const migrationCount = releases.filter((record) => record.migrationsIncluded).length;
  const linkedIncidentCount = releases.filter((record) => record.relatedIncidentIds.length).length;

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Releases</span>
          <h2>Deploy and Change Context</h2>
          <p>Track recent product changes, deploy context, migrations, known risks, and linked support issues.</p>
        </div>
        <Link to="/releases/new" className="ticket-primary-action">New Release</Link>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Total Releases</span><strong>{releases.length}</strong></article>
        <article className="ticket-stat-card"><span>Production Releases</span><strong>{productionCount}</strong></article>
        <article className="ticket-stat-card"><span>Migrations Included</span><strong>{migrationCount}</strong></article>
        <article className="ticket-stat-card"><span>Linked Incidents</span><strong>{linkedIncidentCount}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Search + Filters</h3>
          <span>Find deploys by version, commit, environment, risk context, or whether migrations were included.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, version, commit, summary, or tags" />
          </label>
          <label>
            Environment
            <select value={environment} onChange={(event) => setEnvironment(event.target.value)}>
              <option value="all">All environments</option>
              {Array.from(new Set(releases.map((record) => record.environment))).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Migrations Included
            <select value={hasMigrations} onChange={(event) => setHasMigrations(event.target.value)}>
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>
      </section>

      {filtered.length ? (
        <div className="ticket-table-wrap">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Release</th>
                <th>Version</th>
                <th>Environment</th>
                <th>Migrations</th>
                <th>Linked Issues</th>
                <th>Release Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id}>
                  <td>
                    <Link to={`/releases/${record.id}`} className="ticket-title-cell">
                      <strong>{record.title}</strong>
                      <span>{record.id} · {record.commitSha}</span>
                    </Link>
                  </td>
                  <td>{record.version}</td>
                  <td>{record.environment}</td>
                  <td>{record.migrationsIncluded ? 'Yes' : 'No'}</td>
                  <td>{record.relatedTicketIds.length}/{record.relatedErrorIds.length}/{record.relatedIncidentIds.length}/{record.relatedResolutionIds.length}</td>
                  <td>{record.releaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="ticket-empty-state">
          <span>No matching releases</span>
          <p>Try a broader search or reset the current filters.</p>
        </section>
      )}
    </section>
  );
}
