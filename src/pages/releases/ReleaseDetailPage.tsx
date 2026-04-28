import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getActivityByEntity } from '@/features/activity/lib/activityStore';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { getReleaseById, updateRelease } from '@/features/releases/lib/releaseStore';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import '@/features/tickets/styles/tickets.css';

export function ReleaseDetailPage() {
  const { releaseId = '' } = useParams();
  const [version, setVersion] = useState(0);
  const release = useMemo(() => getReleaseById(releaseId), [releaseId, version]);
  const tickets = useMemo(() => getTickets(), [version]);
  const errors = useMemo(() => getErrors(), [version]);
  const incidents = useMemo(() => getIncidents(), [version]);
  const resolutions = useMemo(() => getResolutions(), [version]);
  const releaseActivity = useMemo(() => getActivityByEntity('release', releaseId).slice(0, 8), [releaseId, version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  if (!release) {
    return (
      <section className="ticket-workspace-page">
        <div className="ticket-page-header">
          <div>
            <span className="ticket-page-eyebrow">Release Detail</span>
            <h2>Release Not Found</h2>
            <p>The requested release record does not exist in local storage yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const linkedTickets = tickets.filter((record) => release.relatedTicketIds.includes(record.id));
  const linkedErrors = errors.filter((record) => release.relatedErrorIds.includes(record.id));
  const linkedIncidents = incidents.filter((record) => release.relatedIncidentIds.includes(record.id));
  const linkedResolutions = resolutions.filter((record) => release.relatedResolutionIds.includes(record.id));

  function updateAndRefresh(updates: Partial<typeof release>) {
    updateRelease(release.id, updates);
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Release Detail</span>
          <h2>{release.title}</h2>
          <p>{release.id} · {release.version} · {release.environment}</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Version</span><strong>{release.version}</strong></article>
        <article className="ticket-stat-card"><span>Environment</span><strong>{release.environment}</strong></article>
        <article className="ticket-stat-card"><span>Migrations</span><strong>{release.migrationsIncluded ? 'Yes' : 'No'}</strong></article>
        <article className="ticket-stat-card"><span>Linked Incidents</span><strong>{release.relatedIncidentIds.length}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Release Basics</h3>
          <span>Version, commit, date, summary, and tag context for this change.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Title
            <input defaultValue={release.title} onBlur={(event) => updateAndRefresh({ title: event.target.value.trim() })} />
          </label>
          <label>
            Version
            <input defaultValue={release.version} onBlur={(event) => updateAndRefresh({ version: event.target.value.trim() })} />
          </label>
          <label>
            Commit SHA
            <input defaultValue={release.commitSha} onBlur={(event) => updateAndRefresh({ commitSha: event.target.value.trim() })} />
          </label>
          <label>
            Environment
            <select value={release.environment} onChange={(event) => updateAndRefresh({ environment: event.target.value as typeof release.environment })}>
              <option value="production">production</option>
              <option value="staging">staging</option>
              <option value="local">local</option>
              <option value="development">development</option>
            </select>
          </label>
          <label>
            Release Date
            <input defaultValue={release.releaseDate} onBlur={(event) => updateAndRefresh({ releaseDate: event.target.value })} />
          </label>
          <label>
            Migrations Included
            <select value={release.migrationsIncluded ? 'true' : 'false'} onChange={(event) => updateAndRefresh({ migrationsIncluded: event.target.value === 'true' })}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>
          <label>
            Tags
            <input defaultValue={release.tags.join(', ')} onBlur={(event) => updateAndRefresh({ tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} />
          </label>
        </div>
        <label>
          Summary
          <textarea rows={4} defaultValue={release.summary} onBlur={(event) => updateAndRefresh({ summary: event.target.value.trim() })} />
        </label>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Risk, Verification, and Rollback</h3>
          <span>Operational context for deciding whether a release may explain current support issues.</span>
        </div>
        <div className="ticket-detail-stack">
          <label>
            Changed Areas
            <textarea rows={4} defaultValue={release.changedAreas.join('\n')} onBlur={(event) => updateAndRefresh({ changedAreas: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} />
          </label>
          <label>
            Known Risks
            <textarea rows={4} defaultValue={release.knownRisks.join('\n')} onBlur={(event) => updateAndRefresh({ knownRisks: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} />
          </label>
          <label>
            Verification Checklist
            <textarea rows={4} defaultValue={release.verificationChecklist.join('\n')} onBlur={(event) => updateAndRefresh({ verificationChecklist: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} />
          </label>
          <label>
            Rollback Notes
            <textarea rows={4} defaultValue={release.rollbackNotes} onBlur={(event) => updateAndRefresh({ rollbackNotes: event.target.value.trim() })} />
          </label>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Linked Support Records</h3>
          <span>Current tickets, errors, incidents, and resolutions tied to this release.</span>
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
            <strong>Incidents</strong>
            <p>{linkedIncidents.length ? linkedIncidents.map((record) => `${record.id} — ${record.title}`).join(' | ') : '—'}</p>
          </div>
          <div>
            <strong>Resolutions</strong>
            <p>{linkedResolutions.length ? linkedResolutions.map((record) => `${record.id} — ${record.title}`).join(' | ') : '—'}</p>
          </div>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Recent Release Activity</h3>
          <span>Latest audit-style actions recorded for this release record.</span>
        </div>
        <div className="ticket-detail-stack">
          {releaseActivity.length ? releaseActivity.map((item) => (
            <article key={item.id} className="ticket-activity-item">
              <div className="ticket-activity-meta">
                <strong>{item.summary}</strong>
                <span>{item.timestamp}</span>
              </div>
              <p>{item.actor}</p>
            </article>
          )) : <p>No release activity yet.</p>}
        </div>
      </section>
    </section>
  );
}
