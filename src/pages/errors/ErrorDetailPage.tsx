import { useMemo, useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorLinkActions } from '@/features/errors/components/ErrorLinkActions';
import { updateError, getErrorById } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import { getReleases } from '@/features/releases/lib/releaseStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import { ERROR_LOG_APP_AREAS, ERROR_LOG_ENVIRONMENTS, ERROR_LOG_SEVERITIES, ERROR_LOG_SOURCES, ERROR_LOG_STATUSES } from '@/constants/workflow';
import type { ErrorLogAppArea, ErrorLogEnvironment, ErrorLogSeverity, ErrorLogSource, ErrorLogStatus } from '@/types/errors';
import '@/features/errors/styles/errors.css';

export function ErrorDetailPage() {
  const { errorId = '' } = useParams();
  const [version, setVersion] = useState(0);
  const record = useMemo(() => getErrorById(errorId), [errorId, version]);
  const tickets = useMemo(() => getTickets().slice(0, 6), [version]);
  const incidents = useMemo(() => getIncidents().slice(0, 6), [version]);
  const resolutions = useMemo(() => getResolutions().slice(0, 6), [version]);
  const releases = useMemo(() => getReleases().slice(0, 6), [version]);

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

  function updateAndRefresh(updates: Partial<typeof record>) {
    updateError(record.id, updates);
    refresh();
  }

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    updateAndRefresh({ status: event.target.value as ErrorLogStatus });
  }

  function handleSeverityChange(event: ChangeEvent<HTMLSelectElement>) {
    updateAndRefresh({ severity: event.target.value as ErrorLogSeverity });
  }

  function handleSourceChange(event: ChangeEvent<HTMLSelectElement>) {
    updateAndRefresh({ source: event.target.value as ErrorLogSource });
  }

  function handleEnvironmentChange(event: ChangeEvent<HTMLSelectElement>) {
    updateAndRefresh({ environment: event.target.value as ErrorLogEnvironment });
  }

  function handleAppAreaChange(event: ChangeEvent<HTMLSelectElement>) {
    updateAndRefresh({ appArea: event.target.value as ErrorLogAppArea });
  }

  function handleLinkedTicketBlur(event: ChangeEvent<HTMLInputElement>) {
    updateAndRefresh({
      relatedTicketIds: event.target.value.split(',').map((value) => value.trim()).filter(Boolean),
    });
  }

  function handleSimpleBlur<K extends 'relatedIncidentId' | 'relatedResolutionId' | 'relatedReleaseId' | 'notes' | 'message' | 'rawLog' | 'stackTrace' | 'affectedUserId' | 'affectedBusinessId'>(key: K, value: string) {
    updateAndRefresh({ [key]: value.trim() } as Pick<typeof record, K>);
  }

  function handleOccurrenceBlur(event: ChangeEvent<HTMLInputElement>) {
    updateAndRefresh({ occurrenceCount: Number(event.target.value) || 1 });
  }

  function handleTimeBlur<K extends 'firstSeenAt' | 'lastSeenAt'>(key: K, value: string) {
    updateAndRefresh({ [key]: value } as Pick<typeof record, K>);
  }

  function handleTagsBlur(event: ChangeEvent<HTMLInputElement>) {
    updateAndRefresh({ tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) });
  }

  function setQuickStatus(nextStatus: ErrorLogStatus) {
    updateAndRefresh({ status: nextStatus });
  }

  function toggleTicketLink(ticketId: string) {
    const exists = record.relatedTicketIds.includes(ticketId);
    const nextTicketIds = exists
      ? record.relatedTicketIds.filter((value) => value !== ticketId)
      : [...record.relatedTicketIds, ticketId];

    updateAndRefresh({
      relatedTicketIds: nextTicketIds,
      status: nextTicketIds.length ? 'linked_to_ticket' : record.status,
    });
  }

  function toggleSingleLink<K extends 'relatedIncidentId' | 'relatedResolutionId' | 'relatedReleaseId'>(key: K, value: string) {
    updateAndRefresh({
      [key]: record[key] === value ? '' : value,
    } as Pick<typeof record, K>);
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
          <span>Update tracking state, triage context, and support links</span>
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
            Source
            <select value={record.source} onChange={handleSourceChange}>
              {ERROR_LOG_SOURCES.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Environment
            <select value={record.environment} onChange={handleEnvironmentChange}>
              {ERROR_LOG_ENVIRONMENTS.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            App Area
            <select value={record.appArea} onChange={handleAppAreaChange}>
              {ERROR_LOG_APP_AREAS.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Occurrence Count
            <input type="number" min={1} defaultValue={record.occurrenceCount} onBlur={handleOccurrenceBlur} />
          </label>
          <label>
            First Seen
            <input defaultValue={record.firstSeenAt} onBlur={(event) => handleTimeBlur('firstSeenAt', event.target.value)} />
          </label>
          <label>
            Last Seen
            <input defaultValue={record.lastSeenAt} onBlur={(event) => handleTimeBlur('lastSeenAt', event.target.value)} />
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
          <label>
            Related Release ID
            <input defaultValue={record.relatedReleaseId} onBlur={(event) => handleSimpleBlur('relatedReleaseId', event.target.value)} />
          </label>
        </div>

        <div className="error-link-list">
          <strong>Available link targets</strong>
          <small>Use the buttons below to link or unlink related records quickly.</small>
        </div>

        <ErrorLinkActions
          title="Tickets"
          records={tickets}
          activeIds={record.relatedTicketIds}
          onToggle={toggleTicketLink}
        />

        <ErrorLinkActions
          title="Incidents"
          records={incidents}
          activeIds={record.relatedIncidentId ? [record.relatedIncidentId] : []}
          onToggle={(id) => toggleSingleLink('relatedIncidentId', id)}
        />

        <ErrorLinkActions
          title="Resolutions"
          records={resolutions}
          activeIds={record.relatedResolutionId ? [record.relatedResolutionId] : []}
          onToggle={(id) => toggleSingleLink('relatedResolutionId', id)}
        />

        <ErrorLinkActions
          title="Releases"
          records={releases}
          activeIds={record.relatedReleaseId ? [record.relatedReleaseId] : []}
          onToggle={(id) => toggleSingleLink('relatedReleaseId', id)}
        />

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
          <label>
            Message
            <textarea rows={3} defaultValue={record.message} onBlur={(event) => handleSimpleBlur('message', event.target.value)} />
          </label>
          <label>
            Raw Log
            <textarea rows={5} defaultValue={record.rawLog} onBlur={(event) => handleSimpleBlur('rawLog', event.target.value)} />
          </label>
          <label>
            Stack Trace
            <textarea rows={5} defaultValue={record.stackTrace} onBlur={(event) => handleSimpleBlur('stackTrace', event.target.value)} />
          </label>
          <label>
            Affected User ID
            <input defaultValue={record.affectedUserId} onBlur={(event) => handleSimpleBlur('affectedUserId', event.target.value)} />
          </label>
          <label>
            Affected Business ID
            <input defaultValue={record.affectedBusinessId} onBlur={(event) => handleSimpleBlur('affectedBusinessId', event.target.value)} />
          </label>
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
          <label>
            Tags
            <input defaultValue={record.tags.join(', ')} onBlur={handleTagsBlur} />
          </label>
        </div>
      </section>
    </section>
  );
}
