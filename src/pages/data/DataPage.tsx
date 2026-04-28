import { useMemo, useState } from 'react';
import {
  SUPPORT_SCHEMA_VERSION,
  exportSupportDataJson,
  getSupportItemCounts,
  importSupportDataJson,
  resetSupportDataToDemo,
  clearSupportData,
} from '@/features/data/lib/supportDataUtils';
import '@/features/tickets/styles/tickets.css';

function downloadJson(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function DataPage() {
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');
  const [version, setVersion] = useState(0);

  const itemCounts = useMemo(() => getSupportItemCounts(), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  function handleExport() {
    const content = exportSupportDataJson();
    downloadJson(`inex-it-support-export-${new Date().toISOString().slice(0, 10)}.json`, content);
    setMessage('Support data exported successfully.');
    refresh();
  }

  function handleImport() {
    const result = importSupportDataJson(importText);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setMessage('Support data imported successfully.');
    setImportText('');
    refresh();
  }

  function handleResetDemo() {
    if (!window.confirm('Reset the full app to demo data? This will overwrite current local support records.')) {
      return;
    }
    resetSupportDataToDemo();
    setMessage('Support data reset to demo defaults.');
    refresh();
  }

  function handleClearData() {
    if (!window.confirm('Clear all local support data? This removes current records and keeps the app in an empty local-first state.')) {
      return;
    }
    clearSupportData();
    setMessage('Local support data cleared.');
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Data</span>
          <h2>Import, Export, and Reset</h2>
          <p>Manage the local-first support dataset safely with JSON export/import, demo resets, and item-count visibility.</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Schema Version</span><strong>{SUPPORT_SCHEMA_VERSION}</strong></article>
        <article className="ticket-stat-card"><span>Total Tickets</span><strong>{itemCounts.tickets}</strong></article>
        <article className="ticket-stat-card"><span>Total Errors</span><strong>{itemCounts.errors}</strong></article>
        <article className="ticket-stat-card"><span>Total Activity</span><strong>{itemCounts.activity}</strong></article>
      </div>

      {message ? (
        <section className="ticket-detail-panel">
          <div className="ticket-section-header">
            <h3>Last Action</h3>
            <span>{message}</span>
          </div>
        </section>
      ) : null}

      <div className="ticket-detail-grid">
        <section className="ticket-detail-panel">
          <div className="ticket-section-header">
            <h3>Export</h3>
            <span>Download the full local support dataset as a JSON file.</span>
          </div>
          <div className="ticket-detail-stack">
            <p>Includes tickets, errors, incidents, users, businesses, knowledge articles, resolutions, releases, activity, backups, and settings.</p>
            <div className="ticket-form-actions">
              <button type="button" onClick={handleExport}>Export All Data</button>
            </div>
          </div>
        </section>

        <section className="ticket-detail-panel">
          <div className="ticket-section-header">
            <h3>Import</h3>
            <span>Paste a full support-data JSON export to restore or migrate local records.</span>
          </div>
          <div className="ticket-detail-stack">
            <label>
              JSON Payload
              <textarea rows={12} value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="Paste support export JSON here" />
            </label>
            <div className="ticket-form-actions">
              <button type="button" onClick={handleImport}>Import JSON</button>
            </div>
          </div>
        </section>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Item Counts by Module</h3>
          <span>Quick visibility into what is currently stored locally.</span>
        </div>
        <div className="ticket-table-wrap">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(itemCounts).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Utilities</h3>
          <span>Use destructive actions carefully. Both actions require confirmation.</span>
        </div>
        <div className="ticket-inline-actions">
          <button type="button" onClick={handleResetDemo}>Reset to Demo Data</button>
          <button type="button" onClick={handleClearData}>Clear Local Data</button>
        </div>
      </section>
    </section>
  );
}
