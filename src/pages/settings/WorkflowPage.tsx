import { useMemo, useState } from 'react';
import { getSettings, updateSettings } from '@/features/settings/lib/settingsStore';
import '@/features/tickets/styles/tickets.css';

function parseList(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export function WorkflowPage() {
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState('');
  const settings = useMemo(() => getSettings(), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  function save(updates: Partial<typeof settings>) {
    updateSettings(updates);
    setMessage('Workflow settings saved.');
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Settings / Workflow</span>
          <h2>Workflow Configuration</h2>
          <p>Manage app areas, environments, and local workflow defaults that influence triage and routing.</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>App Areas</span><strong>{settings.appAreas.length}</strong></article>
        <article className="ticket-stat-card"><span>Environments</span><strong>{settings.environments.length}</strong></article>
        <article className="ticket-stat-card"><span>Resolved by Default</span><strong>{settings.localPreferences.showResolvedByDefault ? 'Yes' : 'No'}</strong></article>
        <article className="ticket-stat-card"><span>Compact Tables</span><strong>{settings.localPreferences.compactTables ? 'Yes' : 'No'}</strong></article>
      </div>

      {message ? (
        <section className="ticket-detail-panel">
          <div className="ticket-section-header"><h3>Last Action</h3><span>{message}</span></div>
        </section>
      ) : null}

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Workflow Values</h3>
          <span>Adjust app-area and environment lists used across the support workspace.</span>
        </div>
        <div className="ticket-detail-stack">
          <label>
            App Areas
            <textarea rows={3} defaultValue={settings.appAreas.join(', ')} onBlur={(event) => save({ appAreas: parseList(event.target.value) })} />
          </label>
          <label>
            Environments
            <textarea rows={2} defaultValue={settings.environments.join(', ')} onBlur={(event) => save({ environments: parseList(event.target.value) })} />
          </label>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Local Defaults</h3>
          <span>Control local-only workflow presentation and queue defaults.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Compact Tables
            <select value={settings.localPreferences.compactTables ? 'true' : 'false'} onChange={(event) => save({ localPreferences: { compactTables: event.target.value === 'true' } })}>
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </label>
          <label>
            Show Resolved By Default
            <select value={settings.localPreferences.showResolvedByDefault ? 'true' : 'false'} onChange={(event) => save({ localPreferences: { showResolvedByDefault: event.target.value === 'true' } })}>
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </label>
          <label>
            Date Format
            <input defaultValue={settings.localPreferences.dateFormat} onBlur={(event) => save({ localPreferences: { dateFormat: event.target.value.trim() || 'YYYY-MM-DD HH:mm' } })} />
          </label>
        </div>
      </section>
    </section>
  );
}
