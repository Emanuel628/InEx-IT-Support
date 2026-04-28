import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActivity } from '@/features/activity/lib/activityStore';
import '@/features/activity/styles/activity.css';

function getEntityHref(entityType: string, entityId: string) {
  switch (entityType) {
    case 'ticket':
      return `/tickets/${entityId}`;
    case 'error':
      return `/errors/${entityId}`;
    case 'incident':
      return `/incidents/${entityId}`;
    case 'user':
      return `/users/${entityId}`;
    case 'business':
      return `/businesses/${entityId}`;
    case 'knowledge_article':
      return `/knowledge/${entityId}`;
    case 'resolution':
      return `/resolutions/${entityId}`;
    case 'release':
      return `/releases/${entityId}`;
    case 'data':
      return '/data';
    case 'backup':
      return '/backups';
    case 'settings':
      return '/settings';
    default:
      return null;
  }
}

export function ActivityPage() {
  const records = getActivity();
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('all');
  const [action, setAction] = useState('all');

  const filtered = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch = !search.trim()
        || [record.entityId, record.summary, record.actor, record.action]
          .join(' ')
          .toLowerCase()
          .includes(search.trim().toLowerCase());
      const matchesEntity = entityType === 'all' || record.entityType === entityType;
      const matchesAction = action === 'all' || record.action === action;
      return matchesSearch && matchesEntity && matchesAction;
    });
  }, [action, entityType, records, search]);

  const uniqueEntityTypes = Array.from(new Set(records.map((record) => record.entityType)));
  const uniqueActions = Array.from(new Set(records.map((record) => record.action)));

  return (
    <section className="activity-page">
      <div className="activity-page-header">
        <div>
          <span className="activity-page-eyebrow">Activity</span>
          <h2>Global Support Activity</h2>
          <p>Review ticket, error, incident, resolution, release, and settings actions in one place.</p>
        </div>
      </div>

      <div className="activity-stats-grid">
        <article className="activity-stat-card"><span>Total Events</span><strong>{records.length}</strong></article>
        <article className="activity-stat-card"><span>Error Events</span><strong>{records.filter((record) => record.entityType === 'error').length}</strong></article>
        <article className="activity-stat-card"><span>Ticket Events</span><strong>{records.filter((record) => record.entityType === 'ticket').length}</strong></article>
        <article className="activity-stat-card"><span>Incident Events</span><strong>{records.filter((record) => record.entityType === 'incident').length}</strong></article>
      </div>

      <section className="activity-filter-grid">
        <article className="activity-filter-card">
          <label>
            <span>Search</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by id, summary, actor, or action"
            />
          </label>
        </article>

        <article className="activity-filter-card">
          <label>
            <span>Entity Type</span>
            <select value={entityType} onChange={(event) => setEntityType(event.target.value)}>
              <option value="all">All entity types</option>
              {uniqueEntityTypes.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
        </article>

        <article className="activity-filter-card">
          <label>
            <span>Action</span>
            <select value={action} onChange={(event) => setAction(event.target.value)}>
              <option value="all">All actions</option>
              {uniqueActions.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
        </article>
      </section>

      {filtered.length ? (
        <section className="activity-list">
          {filtered.map((record) => {
            const href = getEntityHref(record.entityType, record.entityId);
            return (
              <article key={record.id} className="activity-item">
                <div className="activity-item-header">
                  {href ? <Link to={href}><strong>{record.entityId}</strong></Link> : <strong>{record.entityId}</strong>}
                  <span className="activity-item-meta">{record.timestamp}</span>
                </div>
                <p className="activity-item-summary">{record.summary}</p>
                <span className="activity-item-meta">{record.actor} · {record.action}</span>
                <div className="activity-item-tags">
                  <span className="activity-tag">{record.entityType}</span>
                  {Object.entries(record.metadata).slice(0, 3).map(([key, value]) => (
                    <span key={key} className="activity-tag">{key}: {String(value)}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="activity-empty-state">
          <span>No matching activity</span>
          <p>Try a broader search or reset the entity type and action filters.</p>
        </section>
      )}
    </section>
  );
}
