import { useMemo, useState } from 'react';
import { getSettings, resetSettings, updateSettings } from '@/features/settings/lib/settingsStore';
import '@/features/tickets/styles/tickets.css';

function parseList(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export function SettingsPage() {
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState('');
  const settings = useMemo(() => getSettings(), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  function save(updates: Partial<typeof settings>) {
    updateSettings(updates);
    setMessage('Settings saved.');
    refresh();
  }

  function handleReset() {
    if (!window.confirm('Reset workflow settings to defaults?')) {
      return;
    }
    resetSettings();
    setMessage('Settings reset to defaults.');
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Settings</span>
          <h2>Workflow Configuration</h2>
          <p>Manage technicians, default assignment, support vocabulary, and local display preferences for the console.</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Default Assignee</span><strong>{settings.defaultAssignee}</strong></article>
        <article className="ticket-stat-card"><span>Technicians</span><strong>{settings.technicians.length}</strong></article>
        <article className="ticket-stat-card"><span>Categories</span><strong>{settings.categories.length}</strong></article>
        <article className="ticket-stat-card"><span>Updated</span><strong>{settings.updatedAt}</strong></article>
      </div>

      {message ? (
        <section className="ticket-detail-panel">
          <div className="ticket-section-header">
            <h3>Last Action</h3>
            <span>{message}</span>
          </div>
        </section>
      ) : null}

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Team and Assignment</h3>
          <span>Control the technician roster and the default assignee used in the local workflow.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Default Assignee
            <input defaultValue={settings.defaultAssignee} onBlur={(event) => save({ defaultAssignee: event.target.value.trim() || 'Unassigned' })} />
          </label>
          <label>
            Technicians
            <input defaultValue={settings.technicians.join(', ')} onBlur={(event) => save({ technicians: parseList(event.target.value) })} />
          </label>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Workflow Vocabulary</h3>
          <span>Adjust the reusable categories and dropdown values used throughout the support workspace.</span>
        </div>
        <div className="ticket-detail-stack">
          <label>
            Categories
            <textarea rows={3} defaultValue={settings.categories.join(', ')} onBlur={(event) => save({ categories: parseList(event.target.value) })} />
          </label>
          <label>
            App Areas
            <textarea rows={3} defaultValue={settings.appAreas.join(', ')} onBlur={(event) => save({ appAreas: parseList(event.target.value) })} />
          </label>
          <label>
            Environments
            <textarea rows={2} defaultValue={settings.environments.join(', ')} onBlur={(event) => save({ environments: parseList(event.target.value) })} />
          </label>
          <label>
            Sources
            <textarea rows={2} defaultValue={settings.sources.join(', ')} onBlur={(event) => save({ sources: parseList(event.target.value) })} />
          </label>
          <label>
            Statuses
            <textarea rows={2} defaultValue={settings.statuses.join(', ')} onBlur={(event) => save({ statuses: parseList(event.target.value) })} />
          </label>
          <label>
            Priorities
            <textarea rows={2} defaultValue={settings.priorities.join(', ')} onBlur={(event) => save({ priorities: parseList(event.target.value) })} />
          </label>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Local Display Preferences</h3>
          <span>Configure local-only interface behavior for tables and dates.</span>
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

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Reset</h3>
          <span>Return the full workflow configuration back to its default local values.</span>
        </div>
        <div className="ticket-inline-actions">
          <button type="button" onClick={handleReset}>Reset Settings to Defaults</button>
        </div>
      </section>
    </section>
  );
}
