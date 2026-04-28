import { useMemo, useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getReleases } from '@/features/releases/lib/releaseStore';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import { INCIDENT_SEVERITIES, INCIDENT_STATUSES } from '@/constants/workflow';
import { getIncidentById, updateIncident } from '@/features/incidents/lib/incidentStore';
import type { IncidentEnvironment, IncidentSeverity, IncidentStatus } from '@/types/incidents';
import '@/features/tickets/styles/tickets.css';

export function IncidentDetailPage() {
  const { incidentId = '' } = useParams();
  const [version, setVersion] = useState(0);
  const incident = useMemo(() => getIncidentById(incidentId), [incidentId, version]);
  const tickets = useMemo(() => getTickets().slice(0, 6), [version]);
  const errors = useMemo(() => getErrors().slice(0, 6), [version]);
  const releases = useMemo(() => getReleases().slice(0, 6), [version]);
  const resolutions = useMemo(() => getResolutions().slice(0, 6), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  if (!incident) {
    return (
      <section className="ticket-workspace-page">
        <div className="ticket-page-header">
          <div>
            <span className="ticket-page-eyebrow">Incident Detail</span>
            <h2>Incident Not Found</h2>
            <p>The requested incident does not exist in local storage yet.</p>
          </div>
        </div>
      </section>
    );
  }

  function updateAndRefresh(updates: Partial<typeof incident>) {
    updateIncident(incident.id, updates);
    refresh();
  }

  function toggleId(key: 'relatedTicketIds' | 'relatedErrorIds', value: string) {
    const next = incident[key].includes(value)
      ? incident[key].filter((item) => item !== value)
      : [...incident[key], value];
    updateAndRefresh({ [key]: next } as Pick<typeof incident, typeof key>);
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Incident Detail</span>
          <h2>{incident.title}</h2>
          <p>{incident.id} · {incident.environment} · {incident.status.replace(/_/g, ' ')}</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Status</span><strong>{incident.status.replace(/_/g, ' ')}</strong></article>
        <article className="ticket-stat-card"><span>Severity</span><strong>{incident.severity}</strong></article>
        <article className="ticket-stat-card"><span>Started</span><strong>{incident.startedAt}</strong></article>
        <article className="ticket-stat-card"><span>Resolved</span><strong>{incident.resolvedAt || '—'}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Incident Controls</h3>
          <span>Update status, impact, environment, and linked support records.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Status
            <select value={incident.status} onChange={(event) => updateAndRefresh({ status: event.target.value as IncidentStatus })}>
              {INCIDENT_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Severity
            <select value={incident.severity} onChange={(event) => updateAndRefresh({ severity: event.target.value as IncidentSeverity })}>
              {INCIDENT_SEVERITIES.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Environment
            <select value={incident.environment} onChange={(event) => updateAndRefresh({ environment: event.target.value as IncidentEnvironment })}>
              <option value="production">production</option>
              <option value="staging">staging</option>
              <option value="local">local</option>
              <option value="development">development</option>
            </select>
          </label>
          <label>
            Affected Areas
            <input defaultValue={incident.affectedAreas.join(', ')} onBlur={(event) => updateAndRefresh({ affectedAreas: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} />
          </label>
          <label>
            Started At
            <input defaultValue={incident.startedAt} onBlur={(event) => updateAndRefresh({ startedAt: event.target.value })} />
          </label>
          <label>
            Resolved At
            <input defaultValue={incident.resolvedAt} onBlur={(event) => updateAndRefresh({ resolvedAt: event.target.value })} />
          </label>
          <label>
            Related Release ID
            <input defaultValue={incident.relatedReleaseId} onBlur={(event) => updateAndRefresh({ relatedReleaseId: event.target.value.trim() })} />
          </label>
          <label>
            Related Resolution ID
            <input defaultValue={incident.relatedResolutionId} onBlur={(event) => updateAndRefresh({ relatedResolutionId: event.target.value.trim() })} />
          </label>
        </div>
        <div className="ticket-inline-actions">
          <button type="button" onClick={() => updateAndRefresh({ status: 'investigating' })}>Investigating</button>
          <button type="button" onClick={() => updateAndRefresh({ status: 'identified' })}>Identified</button>
          <button type="button" onClick={() => updateAndRefresh({ status: 'monitoring' })}>Monitoring</button>
          <button type="button" onClick={() => updateAndRefresh({ status: 'resolved' })}>Resolved</button>
          <button type="button" onClick={() => updateAndRefresh({ status: 'postmortem_needed' })}>Postmortem Needed</button>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Impact + Investigation</h3>
          <span>Record customer impact, workaround, root cause, and resolution notes.</span>
        </div>
        <div className="ticket-detail-stack">
          <label>
            Customer Impact
            <textarea rows={4} defaultValue={incident.customerImpact} onBlur={(event) => updateAndRefresh({ customerImpact: event.target.value.trim() })} />
          </label>
          <label>
            Workaround
            <textarea rows={4} defaultValue={incident.workaround} onBlur={(event) => updateAndRefresh({ workaround: event.target.value.trim() })} />
          </label>
          <label>
            Root Cause
            <textarea rows={4} defaultValue={incident.rootCause} onBlur={(event) => updateAndRefresh({ rootCause: event.target.value.trim() })} />
          </label>
          <label>
            Resolution Summary
            <textarea rows={4} defaultValue={incident.resolutionSummary} onBlur={(event) => updateAndRefresh({ resolutionSummary: event.target.value.trim() })} />
          </label>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Linked Records</h3>
          <span>Connect the incident to tickets, errors, releases, and resolutions.</span>
        </div>
        <div className="ticket-detail-stack">
          <div>
            <strong>Quick link helpers</strong>
            <p>Tickets: {tickets.map((ticket) => ticket.id).join(', ') || '—'}</p>
            <p>Errors: {errors.map((error) => error.id).join(', ') || '—'}</p>
            <p>Releases: {releases.map((release) => release.id).join(', ') || '—'}</p>
            <p>Resolutions: {resolutions.map((resolution) => resolution.id).join(', ') || '—'}</p>
          </div>
          <div className="ticket-inline-actions">
            {tickets.map((ticket) => (
              <button key={ticket.id} type="button" onClick={() => toggleId('relatedTicketIds', ticket.id)}>
                {incident.relatedTicketIds.includes(ticket.id) ? `Unlink ${ticket.id}` : `Link ${ticket.id}`}
              </button>
            ))}
          </div>
          <div className="ticket-inline-actions">
            {errors.map((error) => (
              <button key={error.id} type="button" onClick={() => toggleId('relatedErrorIds', error.id)}>
                {incident.relatedErrorIds.includes(error.id) ? `Unlink ${error.id}` : `Link ${error.id}`}
              </button>
            ))}
          </div>
          <div>
            <strong>Current links</strong>
            <p>Tickets: {incident.relatedTicketIds.join(', ') || '—'}</p>
            <p>Errors: {incident.relatedErrorIds.join(', ') || '—'}</p>
            <p>Release: {incident.relatedReleaseId || '—'}</p>
            <p>Resolution: {incident.relatedResolutionId || '—'}</p>
          </div>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Incident Timeline</h3>
          <span>Review the current investigation timeline.</span>
        </div>
        <div className="ticket-detail-stack">
          {incident.timeline.length ? incident.timeline.map((item) => (
            <article key={item.id} className="ticket-activity-item">
              <div className="ticket-activity-meta">
                <strong>{item.summary}</strong>
                <span>{item.timestamp}</span>
              </div>
              <p>{item.actor}</p>
            </article>
          )) : <p>No timeline items yet.</p>}
        </div>
      </section>
    </section>
  );
}
