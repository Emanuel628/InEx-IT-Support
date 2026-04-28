import { useMemo, useState } from 'react';
import { getSettings, updateSettings } from '@/features/settings/lib/settingsStore';
import '@/features/tickets/styles/tickets.css';

function parseList(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export function TeamPage() {
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState('');
  const settings = useMemo(() => getSettings(), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  function save(updates: Partial<typeof settings>) {
    updateSettings(updates);
    setMessage('Team settings saved.');
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Settings / Team</span>
          <h2>Technician Management</h2>
          <p>Manage the technician roster and the default assignment target used across the support workflow.</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Default Assignee</span><strong>{settings.defaultAssignee}</strong></article>
        <article className="ticket-stat-card"><span>Technicians</span><strong>{settings.technicians.length}</strong></article>
        <article className="ticket-stat-card"><span>Updated</span><strong>{settings.updatedAt}</strong></article>
      </div>

      {message ? (
        <section className="ticket-detail-panel">
          <div className="ticket-section-header"><h3>Last Action</h3><span>{message}</span></div>
        </section>
      ) : null}

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Team Roster</h3>
          <span>Set the active local technician list used by tickets and dashboard queue views.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Default Assignee
            <input defaultValue={settings.defaultAssignee} onBlur={(event) => save({ defaultAssignee: event.target.value.trim() || 'Unassigned' })} />
          </label>
          <label>
            Technicians
            <textarea rows={4} defaultValue={settings.technicians.join(', ')} onBlur={(event) => save({ technicians: parseList(event.target.value) })} />
          </label>
        </div>
      </section>
    </section>
  );
}
