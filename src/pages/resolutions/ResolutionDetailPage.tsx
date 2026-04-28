import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { getKnowledgeArticles } from '@/features/knowledge/lib/knowledgeStore';
import { getReleases } from '@/features/releases/lib/releaseStore';
import { getResolutionById, updateResolution } from '@/features/resolutions/lib/resolutionStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import '@/features/tickets/styles/tickets.css';

export function ResolutionDetailPage() {
  const { resolutionId = '' } = useParams();
  const [version, setVersion] = useState(0);
  const resolution = useMemo(() => getResolutionById(resolutionId), [resolutionId, version]);
  const tickets = useMemo(() => getTickets(), [version]);
  const errors = useMemo(() => getErrors(), [version]);
  const incidents = useMemo(() => getIncidents(), [version]);
  const releases = useMemo(() => getReleases(), [version]);
  const knowledgeArticles = useMemo(() => getKnowledgeArticles(), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  if (!resolution) {
    return (
      <section className="ticket-workspace-page">
        <div className="ticket-page-header">
          <div>
            <span className="ticket-page-eyebrow">Resolution Detail</span>
            <h2>Resolution Not Found</h2>
            <p>The requested resolution record does not exist in local storage yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const linkedTickets = tickets.filter((record) => resolution.relatedTicketIds.includes(record.id));
  const linkedErrors = errors.filter((record) => resolution.relatedErrorIds.includes(record.id));
  const linkedIncident = incidents.find((record) => record.id === resolution.relatedIncidentId) || null;
  const linkedRelease = releases.find((record) => record.id === resolution.relatedReleaseId) || null;
  const linkedArticles = knowledgeArticles.filter((record) => resolution.relatedKnowledgeArticleIds.includes(record.id));

  function updateAndRefresh(updates: Partial<typeof resolution>) {
    updateResolution(resolution.id, updates);
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Resolution Detail</span>
          <h2>{resolution.title}</h2>
          <p>{resolution.id} · {resolution.updatedAt}</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Linked Tickets</span><strong>{resolution.relatedTicketIds.length}</strong></article>
        <article className="ticket-stat-card"><span>Linked Errors</span><strong>{resolution.relatedErrorIds.length}</strong></article>
        <article className="ticket-stat-card"><span>Linked KB Articles</span><strong>{resolution.relatedKnowledgeArticleIds.length}</strong></article>
        <article className="ticket-stat-card"><span>Incident Linked</span><strong>{resolution.relatedIncidentId ? 'Yes' : 'No'}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Historical Fix Record</h3>
          <span>Problem, root cause, fix applied, commands, verification, and rollback details.</span>
        </div>
        <div className="ticket-detail-stack">
          <label>
            Title
            <input defaultValue={resolution.title} onBlur={(event) => updateAndRefresh({ title: event.target.value.trim() })} />
          </label>
          <label>
            Problem Summary
            <textarea rows={4} defaultValue={resolution.problemSummary} onBlur={(event) => updateAndRefresh({ problemSummary: event.target.value.trim() })} />
          </label>
          <label>
            Root Cause
            <textarea rows={4} defaultValue={resolution.rootCause} onBlur={(event) => updateAndRefresh({ rootCause: event.target.value.trim() })} />
          </label>
          <label>
            Fix Applied
            <textarea rows={4} defaultValue={resolution.fixApplied} onBlur={(event) => updateAndRefresh({ fixApplied: event.target.value.trim() })} />
          </label>
          <label>
            Files or Areas Touched
            <textarea rows={4} defaultValue={resolution.filesOrAreasTouched.join('\n')} onBlur={(event) => updateAndRefresh({ filesOrAreasTouched: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} />
          </label>
          <label>
            Commands Used
            <textarea rows={4} defaultValue={resolution.commandsUsed.join('\n')} onBlur={(event) => updateAndRefresh({ commandsUsed: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} />
          </label>
          <label>
            Verification Steps
            <textarea rows={4} defaultValue={resolution.verificationSteps.join('\n')} onBlur={(event) => updateAndRefresh({ verificationSteps: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} />
          </label>
          <label>
            Rollback Notes
            <textarea rows={4} defaultValue={resolution.rollbackNotes} onBlur={(event) => updateAndRefresh({ rollbackNotes: event.target.value.trim() })} />
          </label>
          <label>
            Tags
            <input defaultValue={resolution.tags.join(', ')} onBlur={(event) => updateAndRefresh({ tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} />
          </label>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Linked Records</h3>
          <span>Current tickets, errors, incidents, releases, and KB articles tied to this fix.</span>
        </div>
        <div className="ticket-detail-stack">
          <div>
            <strong>Tickets</strong>
            <p>{linkedTickets.length ? linkedTickets.map((record) => `${record.id} — ${record.title}`).join(' | ') : '—'}</p>
          </div>
          <div>
            <strong>Errors</strong>
            <p>{linkedErrors.length ? linkedErrors.map((record) => `${record.id} — ${record.title}`).join(' | ') : '—'}</p>
          </div>
          <div>
            <strong>Incident</strong>
            <p>{linkedIncident ? `${linkedIncident.id} — ${linkedIncident.title}` : '—'}</p>
          </div>
          <div>
            <strong>Release</strong>
            <p>{linkedRelease ? `${linkedRelease.id} — ${linkedRelease.title}` : '—'}</p>
          </div>
          <div>
            <strong>Knowledge Articles</strong>
            <p>{linkedArticles.length ? linkedArticles.map((record) => `${record.id} — ${record.title}`).join(' | ') : '—'}</p>
          </div>
        </div>
      </section>
    </section>
  );
}
