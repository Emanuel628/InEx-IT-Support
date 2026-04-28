import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getActivityByEntity } from '@/features/activity/lib/activityStore';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import { getKnowledgeArticleById, updateKnowledgeArticle } from '@/features/knowledge/lib/knowledgeStore';
import '@/features/tickets/styles/tickets.css';

export function KnowledgeArticleDetailPage() {
  const { articleId = '' } = useParams();
  const [version, setVersion] = useState(0);
  const article = useMemo(() => getKnowledgeArticleById(articleId), [articleId, version]);
  const tickets = useMemo(() => getTickets(), [version]);
  const resolutions = useMemo(() => getResolutions(), [version]);
  const articleActivity = useMemo(() => getActivityByEntity('knowledge_article', articleId).slice(0, 8), [articleId, version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  if (!article) {
    return (
      <section className="ticket-workspace-page">
        <div className="ticket-page-header">
          <div>
            <span className="ticket-page-eyebrow">Knowledge Article Detail</span>
            <h2>Article Not Found</h2>
            <p>The requested knowledge article does not exist in local storage yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const linkedTickets = tickets.filter((record) => article.relatedTicketIds.includes(record.id));
  const linkedResolutions = resolutions.filter((record) => article.relatedResolutionIds.includes(record.id));

  function updateAndRefresh(updates: Partial<typeof article>) {
    updateKnowledgeArticle(article.id, updates);
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Knowledge Article Detail</span>
          <h2>{article.title}</h2>
          <p>{article.id} · {article.articleType} · {article.appArea}</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Article Type</span><strong>{article.articleType}</strong></article>
        <article className="ticket-stat-card"><span>Category</span><strong>{article.category}</strong></article>
        <article className="ticket-stat-card"><span>Linked Tickets</span><strong>{article.relatedTicketIds.length}</strong></article>
        <article className="ticket-stat-card"><span>Linked Resolutions</span><strong>{article.relatedResolutionIds.length}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Article Basics</h3>
          <span>Reusable support guidance classification and summary context.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Title
            <input defaultValue={article.title} onBlur={(event) => updateAndRefresh({ title: event.target.value.trim() })} />
          </label>
          <label>
            Article Type
            <input defaultValue={article.articleType} onBlur={(event) => updateAndRefresh({ articleType: event.target.value as typeof article.articleType })} />
          </label>
          <label>
            Category
            <input defaultValue={article.category} onBlur={(event) => updateAndRefresh({ category: event.target.value as typeof article.category })} />
          </label>
          <label>
            App Area
            <input defaultValue={article.appArea} onBlur={(event) => updateAndRefresh({ appArea: event.target.value as typeof article.appArea })} />
          </label>
          <label>
            Tags
            <input defaultValue={article.tags.join(', ')} onBlur={(event) => updateAndRefresh({ tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} />
          </label>
        </div>
        <label>
          Summary
          <textarea rows={3} defaultValue={article.summary} onBlur={(event) => updateAndRefresh({ summary: event.target.value.trim() })} />
        </label>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Procedure Content</h3>
          <span>Symptoms, cause, troubleshooting, resolution, escalation, and customer response guidance.</span>
        </div>
        <div className="ticket-detail-stack">
          <label>
            Symptoms
            <textarea rows={4} defaultValue={article.symptoms} onBlur={(event) => updateAndRefresh({ symptoms: event.target.value.trim() })} />
          </label>
          <label>
            Cause
            <textarea rows={4} defaultValue={article.cause} onBlur={(event) => updateAndRefresh({ cause: event.target.value.trim() })} />
          </label>
          <label>
            Troubleshooting Steps
            <textarea rows={5} defaultValue={article.troubleshootingSteps.join('\n')} onBlur={(event) => updateAndRefresh({ troubleshootingSteps: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} />
          </label>
          <label>
            Resolution Steps
            <textarea rows={5} defaultValue={article.resolutionSteps.join('\n')} onBlur={(event) => updateAndRefresh({ resolutionSteps: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean) })} />
          </label>
          <label>
            Escalation Rules
            <textarea rows={3} defaultValue={article.escalationRules} onBlur={(event) => updateAndRefresh({ escalationRules: event.target.value.trim() })} />
          </label>
          <label>
            Customer Response Template
            <textarea rows={4} defaultValue={article.customerResponseTemplate} onBlur={(event) => updateAndRefresh({ customerResponseTemplate: event.target.value.trim() })} />
          </label>
          <label>
            Internal Notes
            <textarea rows={4} defaultValue={article.internalNotes} onBlur={(event) => updateAndRefresh({ internalNotes: event.target.value.trim() })} />
          </label>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Linked Records</h3>
          <span>Current ticket and resolution links tied to this reusable article.</span>
        </div>
        <div className="ticket-detail-stack">
          <div>
            <strong>Tickets</strong>
            <p>{linkedTickets.length ? linkedTickets.map((record) => `${record.id} — ${record.title}`).join(' | ') : '—'}</p>
          </div>
          <div>
            <strong>Resolutions</strong>
            <p>{linkedResolutions.length ? linkedResolutions.map((record) => `${record.id} — ${record.title}`).join(' | ') : '—'}</p>
          </div>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Recent Knowledge Activity</h3>
          <span>Latest audit-style actions recorded for this knowledge article.</span>
        </div>
        <div className="ticket-detail-stack">
          {articleActivity.length ? articleActivity.map((item) => (
            <article key={item.id} className="ticket-activity-item">
              <div className="ticket-activity-meta">
                <strong>{item.summary}</strong>
                <span>{item.timestamp}</span>
              </div>
              <p>{item.actor}</p>
            </article>
          )) : <p>No knowledge activity yet.</p>}
        </div>
      </section>
    </section>
  );
}
