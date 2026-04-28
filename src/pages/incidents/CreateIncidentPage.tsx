import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIncident } from '@/features/incidents/lib/incidentStore';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getReleases } from '@/features/releases/lib/releaseStore';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import { INCIDENT_SEVERITIES, INCIDENT_STATUSES } from '@/constants/workflow';
import type { CreateIncidentInput, IncidentEnvironment, IncidentSeverity, IncidentStatus } from '@/types/incidents';
import '@/features/incidents/styles/incidents.css';

const initialForm: CreateIncidentInput = {
  title: '',
  status: 'investigating',
  severity: 'major',
  environment: 'production',
  affectedAreas: [],
  customerImpact: '',
  startedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  resolvedAt: '',
  rootCause: '',
  workaround: '',
  resolutionSummary: '',
  relatedTicketIds: [],
  relatedErrorIds: [],
  relatedReleaseId: '',
  relatedResolutionId: '',
  tags: [],
};

export function CreateIncidentPage() {
  const navigate = useNavigate();
  const tickets = useMemo(() => getTickets().slice(0, 6), []);
  const errors = useMemo(() => getErrors().slice(0, 6), []);
  const releases = useMemo(() => getReleases().slice(0, 6), []);
  const resolutions = useMemo(() => getResolutions().slice(0, 6), []);
  const [form, setForm] = useState<CreateIncidentInput>(initialForm);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const incident = createIncident({
      ...form,
      title: form.title.trim(),
      customerImpact: form.customerImpact.trim(),
      rootCause: form.rootCause.trim(),
      workaround: form.workaround.trim(),
      resolutionSummary: form.resolutionSummary.trim(),
    });
    navigate(`/incidents/${incident.id}`);
  }

  function toggleId(list: 'relatedTicketIds' | 'relatedErrorIds', value: string) {
    setForm((current) => ({
      ...current,
      [list]: current[list].includes(value)
        ? current[list].filter((item) => item !== value)
        : [...current[list], value],
    }));
  }

  return (
    <section className="incident-workspace-page">
      <div className="incident-page-header">
        <div>
          <span className="incident-page-eyebrow">Log Incident</span>
          <h2>New Incident</h2>
          <p>Capture a larger support event affecting multiple users or a major system area.</p>
        </div>
      </div>

      <section className="incident-panel">
        <div className="incident-section-header">
          <h3>Incident Intake Form</h3>
          <span>Track customer impact, affected areas, linked records, and the investigation path.</span>
        </div>

        <form className="incident-form-layout" onSubmit={handleSubmit}>
          <div className="incident-form-grid">
            <label>
              Title
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as IncidentStatus }))}>
                {INCIDENT_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              Severity
              <select value={form.severity} onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value as IncidentSeverity }))}>
                {INCIDENT_SEVERITIES.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              Environment
              <select value={form.environment} onChange={(event) => setForm((current) => ({ ...current, environment: event.target.value as IncidentEnvironment }))}>
                <option value="production">production</option>
                <option value="staging">staging</option>
                <option value="local">local</option>
                <option value="development">development</option>
              </select>
            </label>
            <label>
              Started At
              <input value={form.startedAt} onChange={(event) => setForm((current) => ({ ...current, startedAt: event.target.value }))} />
            </label>
            <label>
              Resolved At
              <input value={form.resolvedAt} onChange={(event) => setForm((current) => ({ ...current, resolvedAt: event.target.value }))} />
            </label>
            <label>
              Affected Areas
              <input value={form.affectedAreas.join(', ')} onChange={(event) => setForm((current) => ({ ...current, affectedAreas: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) }))} placeholder="exports, billing, receipts" />
            </label>
            <label>
              Related Release ID
              <input value={form.relatedReleaseId} onChange={(event) => setForm((current) => ({ ...current, relatedReleaseId: event.target.value }))} />
            </label>
            <label>
              Related Resolution ID
              <input value={form.relatedResolutionId} onChange={(event) => setForm((current) => ({ ...current, relatedResolutionId: event.target.value }))} />
            </label>
            <label>
              Tags
              <input value={form.tags.join(', ')} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) }))} placeholder="staging, exports, high-impact" />
            </label>
          </div>

          <div className="incident-detail-stack">
            <div>
              <strong>Quick link helpers</strong>
              <p>Tickets: {tickets.map((ticket) => ticket.id).join(', ') || '—'}</p>
              <p>Errors: {errors.map((error) => error.id).join(', ') || '—'}</p>
              <p>Releases: {releases.map((release) => release.id).join(', ') || '—'}</p>
              <p>Resolutions: {resolutions.map((resolution) => resolution.id).join(', ') || '—'}</p>
            </div>
            <div className="incident-inline-actions">
              {tickets.map((ticket) => (
                <button key={ticket.id} type="button" onClick={() => toggleId('relatedTicketIds', ticket.id)}>
                  {form.relatedTicketIds.includes(ticket.id) ? `Unlink ${ticket.id}` : `Link ${ticket.id}`}
                </button>
              ))}
            </div>
            <div className="incident-inline-actions">
              {errors.map((error) => (
                <button key={error.id} type="button" onClick={() => toggleId('relatedErrorIds', error.id)}>
                  {form.relatedErrorIds.includes(error.id) ? `Unlink ${error.id}` : `Link ${error.id}`}
                </button>
              ))}
            </div>
          </div>

          <label>
            Customer Impact
            <textarea rows={4} value={form.customerImpact} onChange={(event) => setForm((current) => ({ ...current, customerImpact: event.target.value }))} required />
          </label>
          <label>
            Workaround
            <textarea rows={4} value={form.workaround} onChange={(event) => setForm((current) => ({ ...current, workaround: event.target.value }))} />
          </label>
          <label>
            Root Cause
            <textarea rows={4} value={form.rootCause} onChange={(event) => setForm((current) => ({ ...current, rootCause: event.target.value }))} />
          </label>
          <label>
            Resolution Summary
            <textarea rows={4} value={form.resolutionSummary} onChange={(event) => setForm((current) => ({ ...current, resolutionSummary: event.target.value }))} />
          </label>

          <div className="incident-form-actions">
            <button type="submit">Save Incident</button>
          </div>
        </form>
      </section>
    </section>
  );
}
