import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import { createKnowledgeArticle } from '@/features/knowledge/lib/knowledgeStore';
import '@/features/tickets/styles/tickets.css';

const initialForm = {
  title: '',
  articleType: 'troubleshooting' as const,
  category: 'authentication' as const,
  appArea: 'auth' as const,
  summary: '',
  symptoms: '',
  cause: '',
  troubleshootingSteps: [] as string[],
  resolutionSteps: [] as string[],
  escalationRules: '',
  customerResponseTemplate: '',
  internalNotes: '',
  relatedTicketIds: [] as string[],
  relatedResolutionIds: [] as string[],
  tags: [] as string[],
};

export function CreateKnowledgeArticlePage() {
  const navigate = useNavigate();
  const tickets = useMemo(() => getTickets().slice(0, 6), []);
  const resolutions = useMemo(() => getResolutions().slice(0, 6), []);
  const [form, setForm] = useState(initialForm);

  function toggleId(key: 'relatedTicketIds' | 'relatedResolutionIds', value: string) {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const record = createKnowledgeArticle({
      ...form,
      title: form.title.trim(),
      summary: form.summary.trim(),
      symptoms: form.symptoms.trim(),
      cause: form.cause.trim(),
      escalationRules: form.escalationRules.trim(),
      customerResponseTemplate: form.customerResponseTemplate.trim(),
      internalNotes: form.internalNotes.trim(),
    });
    navigate(`/knowledge/${record.id}`);
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">New Knowledge Article</span>
          <h2>Create Reusable Support Guidance</h2>
          <p>Capture repeatable troubleshooting procedures, escalation guidance, and reusable customer responses.</p>
        </div>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Knowledge Article Form</h3>
          <span>Store symptoms, cause, procedures, escalation guidance, and linked support records.</span>
        </div>

        <form className="ticket-form-layout" onSubmit={handleSubmit}>
          <div className="ticket-form-grid">
            <label>
              Title
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label>
              Article Type
              <select value={form.articleType} onChange={(event) => setForm((current) => ({ ...current, articleType: event.target.value as typeof current.articleType }))}>
                <option value="how_to">how_to</option>
                <option value="troubleshooting">troubleshooting</option>
                <option value="known_issue">known_issue</option>
                <option value="internal_procedure">internal_procedure</option>
                <option value="escalation_guide">escalation_guide</option>
                <option value="customer_response_template">customer_response_template</option>
              </select>
            </label>
            <label>
              Category
              <input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as typeof current.category }))} />
            </label>
            <label>
              App Area
              <input value={form.appArea} onChange={(event) => setForm((current) => ({ ...current, appArea: event.target.value as typeof current.appArea }))} />
            </label>
            <label>
              Tags
              <input value={form.tags.join(', ')} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) }))} />
            </label>
          </div>

          <label>
            Summary
            <textarea rows={3} value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} required />
          </label>
          <label>
            Symptoms
            <textarea rows={4} value={form.symptoms} onChange={(event) => setForm((current) => ({ ...current, symptoms: event.target.value }))} required />
          </label>
          <label>
            Cause
            <textarea rows={4} value={form.cause} onChange={(event) => setForm((current) => ({ ...current, cause: event.target.value }))} required />
          </label>
          <label>
            Troubleshooting Steps
            <textarea rows={4} value={form.troubleshootingSteps.join('\n')} onChange={(event) => setForm((current) => ({ ...current, troubleshootingSteps: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) }))} />
          </label>
          <label>
            Resolution Steps
            <textarea rows={4} value={form.resolutionSteps.join('\n')} onChange={(event) => setForm((current) => ({ ...current, resolutionSteps: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) }))} />
          </label>
          <label>
            Escalation Rules
            <textarea rows={3} value={form.escalationRules} onChange={(event) => setForm((current) => ({ ...current, escalationRules: event.target.value }))} />
          </label>
          <label>
            Customer Response Template
            <textarea rows={4} value={form.customerResponseTemplate} onChange={(event) => setForm((current) => ({ ...current, customerResponseTemplate: event.target.value }))} />
          </label>
          <label>
            Internal Notes
            <textarea rows={4} value={form.internalNotes} onChange={(event) => setForm((current) => ({ ...current, internalNotes: event.target.value }))} />
          </label>

          <div className="ticket-detail-stack">
            <div>
              <strong>Quick link helpers</strong>
              <p>Tickets: {tickets.map((record) => record.id).join(', ') || '—'}</p>
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
              {resolutions.map((record) => (
                <button key={record.id} type="button" onClick={() => toggleId('relatedResolutionIds', record.id)}>
                  {form.relatedResolutionIds.includes(record.id) ? `Unlink ${record.id}` : `Link ${record.id}`}
                </button>
              ))}
            </div>
          </div>

          <div className="ticket-form-actions">
            <button type="submit">Save Article</button>
          </div>
        </form>
      </section>
    </section>
  );
}
