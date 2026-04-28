import { useMemo, useState } from 'react';
import { applySupportDataSnapshot, buildSupportDataSnapshot, getSupportItemCounts, type SupportDataSnapshot } from '@/features/data/lib/supportDataUtils';
import { createBackup, deleteBackup, getBackups } from '@/features/backups/lib/backupStore';
import { addActivity } from '@/features/activity/lib/activityStore';
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

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function BackupsPage() {
  const [label, setLabel] = useState('');
  const [message, setMessage] = useState('');
  const [version, setVersion] = useState(0);

  const backups = useMemo(() => getBackups(), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  function handleCreateBackup() {
    const snapshot = buildSupportDataSnapshot();
    const record = createBackup({
      createdAt: nowIsoLike(),
      label: label.trim() || `Manual Backup ${new Date().toISOString().slice(0, 10)}`,
      schemaVersion: snapshot.schemaVersion,
      itemCounts: getSupportItemCounts(snapshot),
      snapshot,
    });
    setLabel('');
    setMessage(`Backup ${record.id} created.`);
    refresh();
  }

  function handleRestore(snapshot: SupportDataSnapshot, backupId: string) {
    if (!window.confirm(`Restore backup ${backupId}? This will overwrite current local support records.`)) {
      return;
    }
    applySupportDataSnapshot(snapshot);
    addActivity({
      entityType: 'backup',
      entityId: backupId,
      action: 'restored',
      actor: 'System',
      summary: `Backup ${backupId} was restored.`,
      timestamp: nowIsoLike(),
      metadata: getSupportItemCounts(snapshot),
    });
    setMessage(`Backup ${backupId} restored.`);
    refresh();
  }

  function handleExport(snapshot: SupportDataSnapshot, backupId: string) {
    downloadJson(`inex-it-support-backup-${backupId}.json`, JSON.stringify(snapshot, null, 2));
    addActivity({
      entityType: 'backup',
      entityId: backupId,
      action: 'exported',
      actor: 'System',
      summary: `Backup ${backupId} was exported.`,
      timestamp: nowIsoLike(),
      metadata: getSupportItemCounts(snapshot),
    });
    setMessage(`Backup ${backupId} exported.`);
    refresh();
  }

  function handleDelete(backupId: string) {
    if (!window.confirm(`Delete backup ${backupId}? This cannot be undone.`)) {
      return;
    }
    deleteBackup(backupId);
    setMessage(`Backup ${backupId} deleted.`);
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Backups</span>
          <h2>Snapshot and Restore</h2>
          <p>Create, inspect, export, restore, and delete local backup snapshots for the support console.</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Total Backups</span><strong>{backups.length}</strong></article>
        <article className="ticket-stat-card"><span>Latest Backup</span><strong>{backups[0]?.createdAt || '—'}</strong></article>
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
          <h3>Create Backup Snapshot</h3>
          <span>Capture the full local support dataset into a restorable snapshot.</span>
        </div>
        <div className="ticket-detail-stack">
          <label>
            Backup Label
            <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Before import test" />
          </label>
          <div className="ticket-form-actions">
            <button type="button" onClick={handleCreateBackup}>Create Backup</button>
          </div>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Backup History</h3>
          <span>Inspect backup labels, schema versions, item counts, and available actions.</span>
        </div>
        {backups.length ? (
          <div className="ticket-detail-stack">
            {backups.map((backup) => (
              <article key={backup.id} className="ticket-detail-panel">
                <div className="ticket-section-header">
                  <h3>{backup.label}</h3>
                  <span>{backup.id} · {backup.createdAt} · schema {backup.schemaVersion}</span>
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
                      {Object.entries(backup.itemCounts).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="ticket-inline-actions">
                  <button type="button" onClick={() => handleRestore(backup.snapshot as SupportDataSnapshot, backup.id)}>Restore</button>
                  <button type="button" onClick={() => handleExport(backup.snapshot as SupportDataSnapshot, backup.id)}>Export</button>
                  <button type="button" onClick={() => handleDelete(backup.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No backups yet.</p>
        )}
      </section>
    </section>
  );
}
