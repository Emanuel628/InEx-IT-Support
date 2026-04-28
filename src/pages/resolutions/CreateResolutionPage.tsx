import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { getKnowledgeArticles } from '@/features/knowledge/lib/knowledgeStore';
import { getReleases } from '@/features/releases/lib/releaseStore';
import { createResolution } from '@/features/resolutions/lib/resolutionStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import '@/features/tickets/styles/tickets.css';

const initialForm = {
  title: '',
  problemSummary: '',
  rootCause: '',
  fixApplied: '',
  filesOrAreasTouched: [] as string[],
  commandsUsed: [] as string[],
  verificationSteps: [] as string[],
  rollbackNotes: '',
  relatedTicketIds: [] as string[],
  relatedErrorIds: [] as string[],
  relatedIncidentId: '',
  relatedReleaseId: '',
  relatedKnowledgeArticleIds: [] as string[],
  tags: [] as string[],
};

export function CreateResolutionPage() {
  const navigate = useNavigate();
  const tickets = useMemo(() => getTickets().slice(0, 6), []);
  const errors = useMemo(() => getErrors().slice(0, 6), []);
  const incidents = useMemo(() => getIncidents().slice(0, 6), []);
  const releases = useMemo(() => getReleases().slice(0, 6), []);
  const articles = useMemo(() => getKnowledgeArticles().slice(0, 6), []);
  const [form, setForm] = useState(initialForm);

  function toggleId(key: 'relatedTicketIds' | 'relatedErrorIds' | 'relatedKnowledgeArticleIds', value: string) {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }

  function toggleSingleLink(key: 'relatedIncidentId' | 'relatedReleaseId', value: string) {
    setForm((current) => ({
      ...current,
      [key]: current[key] === value ? '' : value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const record = createResolution({
      ...form,
      title: form.title.trim(),
      problemSummary: form.problemSummary.trim(),
      rootCause: form.rootCause.trim(),
      fixApplied: form.fixApplied.trim(),
      rollbackNotes: form.rollbackNotes.trim(),
    });
    navigate(`/resolutions/${record.id}`);
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">New Resolution</span>
          <h2>Create Historical Fix Record</h2>
          <p>Store an exact solved-case fix with root cause, commands, verification, rollback notes, and linked support records.</p>
        </div>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Resolution Form</h3>
          <span>Document what broke, what fixed it, how it was verified, and what to link it back to.</span>
        </div>

        <form className="ticket-form-layout" onSubmit={handleSubmit}>
          <div className="ticket-form-grid">
            <label>
              Title
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label>
              Tags
              <input value={form.tags.join(', ')} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) }))} />
            </label>
          </div>

          <label>
            Problem Summary
            <textarea rows={4} value={form.problemSummary} onChange={(event) => setForm((current) => ({ ...current, problemSummary: event.target.value }))} required />
          </label>
          <label>
            Root Cause
            <textarea rows={4} value={form.rootCause} onChange={(event) => setForm((current) => ({ ...current, rootCause: event.target.value }))} required />
          </label>
          <label>
            Fix Applied
            <textarea rows={4} value={form.fixApplied} onChange={(event) => setForm((current) => ({ ...current, fixApplied: event.target.value }))} required />
          </label>
          <label>
            Files or Areas Touched
            <textarea rows={4} value={form.filesOrAreasTouched.join('\n')} onChange={(event) => setForm((current) => ({ ...current, filesOrAreasTouched: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) }))} />
          </label>
          <label>
            Commands Used
            <textarea rows={4} value={form.commandsUsed.join('\n')} onChange={(event) => setForm((current) => ({ ...current, commandsUsed: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) }))} />
          </label>
          <label>
            Verification Steps
            <textarea rows={4} value={form.verificationSteps.join('\n')} onChange={(event) => setForm((current) => ({ ...current, verificationSteps: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) }))} />
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
              <p>Releases: {releases.map((record) => record.id).join(', ') || '—'}</p>
              <p>Knowledge Articles: {articles.map((record) => record.id).join(', ') || '—'}</p>
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
                <button key={record.id} type="button" onClick={() => toggleSingleLink('relatedIncidentId', record.id)}>
                  {form.relatedIncidentId === record.id ? `Unlink ${record.id}` : `Link ${record.id}`}
                </button>
              ))}
            </div>
            <div className="ticket-inline-actions">
              {releases.map((record) => (
                <button key={record.id} type="button" onClick={() => toggleSingleLink('relatedReleaseId', record.id)}>
                  {form.relatedReleaseId === record.id ? `Unlink ${record.id}` : `Link ${record.id}`}
                </button>
              ))}
            </div>
            <div className="ticket-inline-actions">
              {articles.map((record) => (
                <button key={record.id} type="button" onClick={() => toggleId('relatedKnowledgeArticleIds', record.id)}>
                  {form.relatedKnowledgeArticleIds.includes(record.id) ? `Unlink ${record.id}` : `Link ${record.id}`}
                </button>
              ))}
            </div>
          </div>

          <div className="ticket-form-actions">
            <button type="submit">Save Resolution</button>
          </div>
        </form>
      </section>
    </section>
  );
}
