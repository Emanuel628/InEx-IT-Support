import { useMemo, useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { updateError, getErrorById } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import { ERROR_LOG_SEVERITIES, ERROR_LOG_STATUSES } from '@/constants/workflow';
import type { ErrorLogSeverity, ErrorLogStatus } from '@/types/errors';
import '@/features/errors/styles/errors.css';

export function ErrorDetailPage() {
  const { errorId = '' } = useParams();
  const [version, setVersion] = useState(0);
  const record = useMemo(() => getErrorById(errorId), [errorId, version]);
  const tickets = useMemo(() => getTickets().slice(0, 6), [version]);
  const incidents = useMemo(() => getIncidents().slice(0, 6), [version]);
  const resolutions = useMemo(() => getResolutions().slice(0, 6), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  if (!record) {
    return (
      <section className="error-workspace-page">
        <div className="error-page-header">
          <div>
            <span className="error-page-eyebrow">Error Detail</span>
            <h2>Error Not Found</h2>
            <p>The requested error record does not exist in local storage yet.</p>
          </div>
        </div>
      </section>
    );
  }

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    updateError(record.id, { status: event.target.value as ErrorLogStatus });
    refresh();
  }

  function handleSeverityChange(event: ChangeEvent<HTMLSelectElement>) {
    updateError(record.id, { severity: event.target.value as ErrorLogSeverity });
    refresh();
  }

  function handleLinkedTicketBlur(event: ChangeEvent<HTMLInputElement>) {
    updateError(record.id, {
      relatedTicketIds: event.target.value.split(',').map((value) => value.trim()).filter(Boolean),
    });
    refresh();
  }

  function handleSimpleBlur<K extends 'relatedIncidentId' | 'relatedResolutionId' | 'notes'>(key: K, value: string) {
    updateError(record.id, { [key]: value.trim() } as Pick<typeof record, K>);
    refresh();
  }

  function setQuickStatus(nextStatus: ErrorLogStatus) {
    updateError(record.id, { status: nextStatus });
    refresh();
  }

  return (
    <section className="error-workspace-page">
      <div className="error-page-header">
        <div>
          <span className="error-page-eyebrow">Error Detail</span>
          <h2>{record.title}</h2>
          <p>{record.id} · {record.appArea} · {record.environment}</p>
        </div>
      </div>

      <div className="error-detail-grid">
        <article className="error-detail-card"><span className="error-detail-label">Status</span><strong>{record.status.replace(/_/g, ' ')}</strong></article>
        <article className="error-detail-card"><span className="error-detail-label">Severity</span><strong>{record.severity}</strong></article>
        <article className="error-detail-card"><span className="error-detail-label">Source</span><strong>{record.source}</strong></article>
        <article className="error-detail-card"><span className="error-detail-label">Occurrences</span><strong>{record.occurrenceCount}</strong></article>
        <article className="error-detail-card"><span className="error-detail-label">First Seen</span><strong>{record.firstSeenAt}</strong></article>
        <article className="error-detail-card"><span className="error-detail-label">Last Seen</span><strong>{record.lastSeenAt}</strong></article>
      </div>

      <section className="error-panel">
        <div className="error-section-header">
          <h3>Error Controls</h3>
          <span>Update tracking state and support links</span>
        </div>

        <div className="error-form-grid">
          <label>
            Status
            <select value={record.status} onChange={handleStatusChange}>
              {ERROR_LOG_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Severity
            <select value={record.severity} onChange={handleSeverityChange}>
              {ERROR_LOG_SEVERITIES.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Related Ticket IDs
            <input defaultValue={record.relatedTicketIds.join(', ')} onBlur={handleLinkedTicketBlur} />
          </label>
          <label>
            Related Incident ID
            <input defaultValue={record.relatedIncidentId} onBlur={(event) => handleSimpleBlur('relatedIncidentId', event.target.value)} />
          </label>
          <label>
            Related Resolution ID
            <input defaultValue={record.relatedResolutionId} onBlur={(event) => handleSimpleBlur('relatedResolutionId', event.target.value)} />
          </label>
        </div>

        <div className="error-link-list">
          <strong>Available link targets</strong>
          <small>Tickets: {tickets.map((ticket) => ticket.id).join(', ') || '—'}</small>
          <small>Incidents: {incidents.map((incident) => incident.id).join(', ') || '—'}</small>
          <small>Resolutions: {resolutions.map((resolution) => resolution.id).join(', ') || '—'}</small>
        </div>

        <div className="error-inline-actions">
          <button type="button" onClick={() => setQuickStatus('linked_to_ticket')}>Link to Ticket</button>
          <button type="button" onClick={() => setQuickStatus('investigating')}>Mark Investigating</button>
          <button type="button" onClick={() => setQuickStatus('fixed')}>Mark Fixed</button>
          <button type="button" onClick={() => setQuickStatus('ignored')}>Ignore</button>
          <button type="button" onClick={() => setQuickStatus('recurring')}>Mark Recurring</button>
        </div>
      </section>

      <section className="error-panel">
        <div className="error-section-header">
          <h3>Diagnostic Context</h3>
          <span>Raw technical details and support notes</span>
        </div>

        <div className="error-detail-stack">
          <div>
            <strong>Message</strong>
            <p>{record.message || '—'}</p>
          </div>
          <div>
            <strong>Raw Log</strong>
            <p>{record.rawLog || '—'}</p>
          </div>
          <div>
            <strong>Stack Trace</strong>
            <p>{record.stackTrace || '—'}</p>
          </div>
          <div>
            <strong>Affected User / Business</strong>
            <p>{record.affectedUserId || '—'} · {record.affectedBusinessId || '—'}</p>
          </div>
          <div className="error-link-list">
            <strong>Linked Support Records</strong>
            <span>Tickets: {record.relatedTicketIds.length ? record.relatedTicketIds.join(', ') : '—'}</span>
            <span>Incident: {record.relatedIncidentId || '—'}</span>
            <span>Resolution: {record.relatedResolutionId || '—'}</span>
            <span>Release: {record.relatedReleaseId || '—'}</span>
          </div>
          <label>
            Internal Notes
            <textarea rows={5} defaultValue={record.notes} onBlur={(event) => handleSimpleBlur('notes', event.target.value)} />
          </label>
          <div>
            <strong>Tags</strong>
            <p>{record.tags.length ? record.tags.join(', ') : '—'}</p>
          </div>
        </div>
      </section>
    </section>
  );
}
