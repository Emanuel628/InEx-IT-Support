import { useMemo, useState } from 'react';
import { getSettings, updateSettings } from '@/features/settings/lib/settingsStore';
import '@/features/tickets/styles/tickets.css';

function parseList(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export function CategoriesStatusesPage() {
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState('');
  const settings = useMemo(() => getSettings(), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  function save(updates: Partial<typeof settings>) {
    updateSettings(updates);
    setMessage('Vocabulary settings saved.');
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Settings / Categories</span>
          <h2>Categories and Statuses</h2>
          <p>Manage the shared support vocabulary used across tickets, filters, triage, and linked workflow records.</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Categories</span><strong>{settings.categories.length}</strong></article>
        <article className="ticket-stat-card"><span>Statuses</span><strong>{settings.statuses.length}</strong></article>
        <article className="ticket-stat-card"><span>Priorities</span><strong>{settings.priorities.length}</strong></article>
        <article className="ticket-stat-card"><span>Sources</span><strong>{settings.sources.length}</strong></article>
      </div>

      {message ? (
        <section className="ticket-detail-panel">
          <div className="ticket-section-header"><h3>Last Action</h3><span>{message}</span></div>
        </section>
      ) : null}

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Shared Vocabulary</h3>
          <span>Comma-separated values let you adjust the local dropdown options without touching code.</span>
        </div>
        <div className="ticket-detail-stack">
          <label>
            Categories
            <textarea rows={3} defaultValue={settings.categories.join(', ')} onBlur={(event) => save({ categories: parseList(event.target.value) })} />
          </label>
          <label>
            Statuses
            <textarea rows={3} defaultValue={settings.statuses.join(', ')} onBlur={(event) => save({ statuses: parseList(event.target.value) })} />
          </label>
          <label>
            Priorities
            <textarea rows={2} defaultValue={settings.priorities.join(', ')} onBlur={(event) => save({ priorities: parseList(event.target.value) })} />
          </label>
          <label>
            Sources
            <textarea rows={2} defaultValue={settings.sources.join(', ')} onBlur={(event) => save({ sources: parseList(event.target.value) })} />
          </label>
        </div>
      </section>
    </section>
  );
}
