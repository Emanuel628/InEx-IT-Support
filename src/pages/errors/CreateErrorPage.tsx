import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createError } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import { ERROR_LOG_APP_AREAS, ERROR_LOG_ENVIRONMENTS, ERROR_LOG_SEVERITIES, ERROR_LOG_SOURCES, ERROR_LOG_STATUSES } from '@/constants/workflow';
import type { CreateErrorLogInput, ErrorLogAppArea, ErrorLogEnvironment, ErrorLogSeverity, ErrorLogSource, ErrorLogStatus } from '@/types/errors';
import '@/features/errors/styles/errors.css';

const initialForm: CreateErrorLogInput = {
  title: '',
  message: '',
  rawLog: '',
  stackTrace: '',
  source: 'manual',
  environment: 'local',
  appArea: 'unknown',
  severity: 'major',
  status: 'new',
  firstSeenAt: '',
  lastSeenAt: '',
  occurrenceCount: 1,
  affectedUserId: '',
  affectedBusinessId: '',
  relatedTicketIds: [],
  relatedIncidentId: '',
  relatedResolutionId: '',
  relatedReleaseId: '',
  notes: '',
  tags: [],
};

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function CreateErrorPage() {
  const navigate = useNavigate();
  const tickets = useMemo(() => getTickets().slice(0, 6), []);
  const incidents = useMemo(() => getIncidents().slice(0, 6), []);
  const resolutions = useMemo(() => getResolutions().slice(0, 6), []);
  const [form, setForm] = useState<CreateErrorLogInput>({
    ...initialForm,
    firstSeenAt: nowIsoLike(),
    lastSeenAt: nowIsoLike(),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const record = createError({
      ...form,
      title: form.title.trim(),
      message: form.message.trim(),
      rawLog: form.rawLog.trim(),
      stackTrace: form.stackTrace.trim(),
      notes: form.notes.trim(),
      affectedUserId: form.affectedUserId.trim(),
      affectedBusinessId: form.affectedBusinessId.trim(),
      relatedIncidentId: form.relatedIncidentId.trim(),
      relatedResolutionId: form.relatedResolutionId.trim(),
      relatedReleaseId: form.relatedReleaseId.trim(),
      relatedTicketIds: form.relatedTicketIds,
      tags: form.tags,
    });

    navigate(`/errors/${record.id}`);
  }

  return (
    <section className="error-workspace-page">
      <div className="error-page-header">
        <div>
          <span className="error-page-eyebrow">Log Error</span>
          <h2>New Technical Error</h2>
          <p>Capture technical failure details, recurring patterns, and links to support records.</p>
        </div>
      </div>

      <section className="error-panel">
        <div className="error-section-header">
          <h3>Error Intake Form</h3>
          <span>Manual entry for technical failures affecting InEx Ledger workflows</span>
        </div>

        <form className="error-form-layout" onSubmit={handleSubmit}>
          <div className="error-form-grid">
            <label>
              Title
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label>
              Source
              <select value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value as ErrorLogSource }))}>
                {ERROR_LOG_SOURCES.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              Environment
              <select value={form.environment} onChange={(event) => setForm((current) => ({ ...current, environment: event.target.value as ErrorLogEnvironment }))}>
                {ERROR_LOG_ENVIRONMENTS.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              App Area
              <select value={form.appArea} onChange={(event) => setForm((current) => ({ ...current, appArea: event.target.value as ErrorLogAppArea }))}>
                {ERROR_LOG_APP_AREAS.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              Severity
              <select value={form.severity} onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value as ErrorLogSeverity }))}>
                {ERROR_LOG_SEVERITIES.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              Status
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ErrorLogStatus }))}>
                {ERROR_LOG_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              First Seen
              <input value={form.firstSeenAt} onChange={(event) => setForm((current) => ({ ...current, firstSeenAt: event.target.value }))} />
            </label>
            <label>
              Last Seen
              <input value={form.lastSeenAt} onChange={(event) => setForm((current) => ({ ...current, lastSeenAt: event.target.value }))} />
            </label>
            <label>
              Occurrence Count
              <input type="number" min={1} value={form.occurrenceCount} onChange={(event) => setForm((current) => ({ ...current, occurrenceCount: Number(event.target.value) || 1 }))} />
            </label>
            <label>
              Affected User ID
              <input value={form.affectedUserId} onChange={(event) => setForm((current) => ({ ...current, affectedUserId: event.target.value }))} />
            </label>
            <label>
              Affected Business ID
              <input value={form.affectedBusinessId} onChange={(event) => setForm((current) => ({ ...current, affectedBusinessId: event.target.value }))} />
            </label>
            <label>
              Related Ticket IDs
              <input
                value={form.relatedTicketIds.join(', ')}
                onChange={(event) => setForm((current) => ({ ...current, relatedTicketIds: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) }))}
                placeholder="INC-1042, INC-1041"
              />
            </label>
            <label>
              Related Incident ID
              <input value={form.relatedIncidentId} onChange={(event) => setForm((current) => ({ ...current, relatedIncidentId: event.target.value }))} />
            </label>
            <label>
              Related Resolution ID
              <input value={form.relatedResolutionId} onChange={(event) => setForm((current) => ({ ...current, relatedResolutionId: event.target.value }))} />
            </label>
            <label>
              Related Release ID
              <input value={form.relatedReleaseId} onChange={(event) => setForm((current) => ({ ...current, relatedReleaseId: event.target.value }))} />
            </label>
          </div>

          <div className="error-link-list">
            <strong>Available link targets</strong>
            <small>Tickets: {tickets.map((ticket) => ticket.id).join(', ') || '—'}</small>
            <small>Incidents: {incidents.map((incident) => incident.id).join(', ') || '—'}</small>
            <small>Resolutions: {resolutions.map((resolution) => resolution.id).join(', ') || '—'}</small>
          </div>

          <label>
            Message
            <textarea rows={3} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} required />
          </label>
          <label>
            Raw Log
            <textarea rows={5} value={form.rawLog} onChange={(event) => setForm((current) => ({ ...current, rawLog: event.target.value }))} />
          </label>
          <label>
            Stack Trace
            <textarea rows={5} value={form.stackTrace} onChange={(event) => setForm((current) => ({ ...current, stackTrace: event.target.value }))} />
          </label>
          <label>
            Notes
            <textarea rows={4} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
          </label>
          <label>
            Tags
            <input
              value={form.tags.join(', ')}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) }))}
              placeholder="exports, pdf-worker, env"
            />
          </label>

          <div className="error-form-actions">
            <button type="submit">Save Error</button>
          </div>
        </form>
      </section>
    </section>
  );
}
