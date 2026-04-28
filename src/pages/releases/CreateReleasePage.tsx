import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { createRelease } from '@/features/releases/lib/releaseStore';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import '@/features/tickets/styles/tickets.css';

const initialForm = {
  title: '',
  version: '',
  commitSha: '',
  environment: 'production' as const,
  releaseDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
  summary: '',
  changedAreas: [] as string[],
  migrationsIncluded: false,
  knownRisks: [] as string[],
  verificationChecklist: [] as string[],
  rollbackNotes: '',
  relatedTicketIds: [] as string[],
  relatedErrorIds: [] as string[],
  relatedIncidentIds: [] as string[],
  relatedResolutionIds: [] as string[],
  tags: [] as string[],
};

export function CreateReleasePage() {
  const navigate = useNavigate();
  const tickets = useMemo(() => getTickets().slice(0, 6), []);
  const errors = useMemo(() => getErrors().slice(0, 6), []);
  const incidents = useMemo(() => getIncidents().slice(0, 6), []);
  const resolutions = useMemo(() => getResolutions().slice(0, 6), []);
  const [form, setForm] = useState(initialForm);

  function toggleId(key: 'relatedTicketIds' | 'relatedErrorIds' | 'relatedIncidentIds' | 'relatedResolutionIds', value: string) {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const record = createRelease({
      ...form,
      title: form.title.trim(),
      version: form.version.trim(),
      commitSha: form.commitSha.trim(),
      summary: form.summary.trim(),
      rollbackNotes: form.rollbackNotes.trim(),
    });
    navigate(`/releases/${record.id}`);
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">New Release</span>
          <h2>Create Release Record</h2>
          <p>Capture version, commit, environment, risks, verification, rollback context, and linked support records.</p>
        </div>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Release Form</h3>
          <span>Document what changed, where it shipped, what risks exist, and what support issues it may explain.</span>
        </div>

        <form className="ticket-form-layout" onSubmit={handleSubmit}>
          <div className="ticket-form-grid">
            <label>
              Title
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label>
              Version
              <input value={form.version} onChange={(event) => setForm((current) => ({ ...current, version: event.target.value }))} required />
            </label>
            <label>
              Commit SHA
              <input value={form.commitSha} onChange={(event) => setForm((current) => ({ ...current, commitSha: event.target.value }))} required />
            </label>
            <label>
              Environment
              <select value={form.environment} onChange={(event) => setForm((current) => ({ ...current, environment: event.target.value as typeof current.environment }))}>
                <option value="production">production</option>
                <option value="staging">staging</option>
                <option value="local">local</option>
                <option value="development">development</option>
              </select>
            </label>
            <label>
              Release Date
              <input value={form.releaseDate} onChange={(event) => setForm((current) => ({ ...current, releaseDate: event.target.value }))} />
            </label>
            <label>
              Migrations Included
              <select value={form.migrationsIncluded ? 'true' : 'false'} onChange={(event) => setForm((current) => ({ ...current, migrationsIncluded: event.target.value === 'true' }))}>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </label>
            <label>
              Tags
              <input value={form.tags.join(', ')} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) }))} />
            </label>
          </div>

          <label>
            Summary
            <textarea rows={4} value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} required />
          </label>
          <label>
            Changed Areas
            <textarea rows={4} value={form.changedAreas.join('\n')} onChange={(event) => setForm((current) => ({ ...current, changedAreas: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) }))} />
          </label>
          <label>
            Known Risks
            <textarea rows={4} value={form.knownRisks.join('\n')} onChange={(event) => setForm((current) => ({ ...current, knownRisks: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) }))} />
          </label>
          <label>
            Verification Checklist
            <textarea rows={4} value={form.verificationChecklist.join('\n')} onChange={(event) => setForm((current) => ({ ...current, verificationChecklist: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) }))} />
          </label>
          <label>
            Rollback Notes
            <textarea rows={4} value={form.rollbackNotes} onChange={(event) => setForm((current) => ({ ...current, rollbackNotes: event.target.value }))} />
          </label>

          <div className="ticket-detail-stack">
            <div>
              <strong>Quick link helpers</strong>
              <p>Tickets: {tickets.map((record) => record.id).join(', ') || '—'}</p>
              <p>Errors: {errors.map((record) => record.id).join(', ') || '—'}</p>
              <p>Incidents: {incidents.map((record) => record.id).join(', ') || '—'}</p>
              <p>Resolutions: {resolutions.map((record) => record.id).join(', ') || '—'}</p>
            </div>
            <div className="ticket-inline-actions">
              {tickets.map((record) => (
                <button key={record.id} type="button" onClick={() => toggleId('relatedTicketIds', record.id)}>
                  {form.relatedTicketIds.includes(record.id) ? `Unlink ${record.id}` : `Link ${record.id}`}
                </button>
              ))}
            </div>
            <div className="ticket-inline-actions">
              {errors.map((record) => (
                <button key={record.id} type="button" onClick={() => toggleId('relatedErrorIds', record.id)}>
                  {form.relatedErrorIds.includes(record.id) ? `Unlink ${record.id}` : `Link ${record.id}`}
                </button>
              ))}
            </div>
            <div className="ticket-inline-actions">
              {incidents.map((record) => (
                <button key={record.id} type="button" onClick={() => toggleId('relatedIncidentIds', record.id)}>
                  {form.relatedIncidentIds.includes(record.id) ? `Unlink ${record.id}` : `Link ${record.id}`}
                </button>
              ))}
            </div>
            <div className="ticket-inline-actions">
              {resolutions.map((record) => (
                <button key={record.id} type="button" onClick={() => toggleId('relatedResolutionIds', record.id)}>
                  {form.relatedResolutionIds.includes(record.id) ? `Unlink ${record.id}` : `Link ${record.id}`}
                </button>
              ))}
            </div>
          </div>

          <div className="ticket-form-actions">
            <button type="submit">Save Release</button>
          </div>
        </form>
      </section>
    </section>
  );
}
