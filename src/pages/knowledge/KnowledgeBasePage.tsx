import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getKnowledgeArticles } from '@/features/knowledge/lib/knowledgeStore';
import '@/features/tickets/styles/tickets.css';

export function KnowledgeBasePage() {
  const articles = getKnowledgeArticles();
  const [search, setSearch] = useState('');
  const [articleType, setArticleType] = useState('all');
  const [category, setCategory] = useState('all');
  const [appArea, setAppArea] = useState('all');

  const filtered = useMemo(() => {
    return articles.filter((record) => {
      const matchesSearch = !search.trim() || [record.id, record.title, record.summary, record.symptoms, record.tags.join(' ')].join(' ').toLowerCase().includes(search.trim().toLowerCase());
      const matchesType = articleType === 'all' || record.articleType === articleType;
      const matchesCategory = category === 'all' || record.category === category;
      const matchesAppArea = appArea === 'all' || record.appArea === appArea;
      return matchesSearch && matchesType && matchesCategory && matchesAppArea;
    });
  }, [appArea, articleType, articles, category, search]);

  const knownIssueCount = articles.filter((record) => record.articleType === 'known_issue').length;
  const troubleshootingCount = articles.filter((record) => record.articleType === 'troubleshooting').length;
  const linkedResolutionCount = articles.filter((record) => record.relatedResolutionIds.length).length;

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Knowledge Base</span>
          <h2>Reusable Support Knowledge</h2>
          <p>Store repeatable troubleshooting guidance, escalation playbooks, and customer response templates for InEx Ledger support.</p>
        </div>
        <Link to="/knowledge/new" className="ticket-primary-action">New Article</Link>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Total Articles</span><strong>{articles.length}</strong></article>
        <article className="ticket-stat-card"><span>Known Issues</span><strong>{knownIssueCount}</strong></article>
        <article className="ticket-stat-card"><span>Troubleshooting Guides</span><strong>{troubleshootingCount}</strong></article>
        <article className="ticket-stat-card"><span>Linked Resolutions</span><strong>{linkedResolutionCount}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Search + Filters</h3>
          <span>Find reusable articles by article type, category, app area, or support keywords.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title, summary, symptoms, or tags" />
          </label>
          <label>
            Article Type
            <select value={articleType} onChange={(event) => setArticleType(event.target.value)}>
              <option value="all">All article types</option>
              {Array.from(new Set(articles.map((record) => record.articleType))).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              {Array.from(new Set(articles.map((record) => record.category))).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            App Area
            <select value={appArea} onChange={(event) => setAppArea(event.target.value)}>
              <option value="all">All app areas</option>
              {Array.from(new Set(articles.map((record) => record.appArea))).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </div>
      </section>

      {filtered.length ? (
        <div className="ticket-table-wrap">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Type</th>
                <th>Category</th>
                <th>App Area</th>
                <th>Resolution Links</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id}>
                  <td>
                    <Link to={`/knowledge/${record.id}`} className="ticket-title-cell">
                      <strong>{record.title}</strong>
                      <span>{record.id} · {record.summary}</span>
                    </Link>
                  </td>
                  <td>{record.articleType}</td>
                  <td>{record.category}</td>
                  <td>{record.appArea}</td>
                  <td>{record.relatedResolutionIds.length}</td>
                  <td>{record.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="ticket-empty-state">
          <span>No matching knowledge articles</span>
          <p>Try a broader search or reset the current filters.</p>
        </section>
      )}
    </section>
  );
}
