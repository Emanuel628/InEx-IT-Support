import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBusinesses } from '@/features/businesses/lib/businessStore';
import '@/features/tickets/styles/tickets.css';

export function BusinessesPage() {
  const businesses = getBusinesses();
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('all');
  const [subscriptionStatus, setSubscriptionStatus] = useState('all');
  const [region, setRegion] = useState('all');

  const filtered = useMemo(() => {
    return businesses.filter((record) => {
      const matchesSearch = !search.trim() || [record.id, record.businessName, record.ownerEmail, record.notes].join(' ').toLowerCase().includes(search.trim().toLowerCase());
      const matchesPlan = plan === 'all' || record.plan === plan;
      const matchesSubscription = subscriptionStatus === 'all' || record.subscriptionStatus === subscriptionStatus;
      const matchesRegion = region === 'all' || record.region === region;
      return matchesSearch && matchesPlan && matchesSubscription && matchesRegion;
    });
  }, [businesses, plan, region, search, subscriptionStatus]);

  const activeCount = businesses.filter((record) => record.subscriptionStatus === 'active').length;
  const slotCount = businesses.reduce((total, record) => total + record.additionalBusinessSlots, 0);
  const linkedIncidentCount = businesses.filter((record) => record.linkedIncidentIds.length).length;

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Businesses</span>
          <h2>Support Business Directory</h2>
          <p>Review support-side business/account context, subscription state, and linked issues for InEx Ledger.</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Total Businesses</span><strong>{businesses.length}</strong></article>
        <article className="ticket-stat-card"><span>Active Subscription</span><strong>{activeCount}</strong></article>
        <article className="ticket-stat-card"><span>Additional Slots</span><strong>{slotCount}</strong></article>
        <article className="ticket-stat-card"><span>Linked Incidents</span><strong>{linkedIncidentCount}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Search + Filters</h3>
          <span>Find businesses by plan, subscription status, region, owner email, or support notes.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by id, business name, owner email, or notes" />
          </label>
          <label>
            Plan
            <select value={plan} onChange={(event) => setPlan(event.target.value)}>
              <option value="all">All plans</option>
              {Array.from(new Set(businesses.map((record) => record.plan))).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Subscription Status
            <select value={subscriptionStatus} onChange={(event) => setSubscriptionStatus(event.target.value)}>
              <option value="all">All statuses</option>
              {Array.from(new Set(businesses.map((record) => record.subscriptionStatus))).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Region
            <select value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="all">All regions</option>
              {Array.from(new Set(businesses.map((record) => record.region))).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </div>
      </section>

      {filtered.length ? (
        <div className="ticket-table-wrap">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Plan</th>
                <th>Subscription</th>
                <th>Limit</th>
                <th>Additional Slots</th>
                <th>Region</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id}>
                  <td>
                    <Link to={`/businesses/${record.id}`} className="ticket-title-cell">
                      <strong>{record.businessName}</strong>
                      <span>{record.id} · {record.ownerEmail}</span>
                    </Link>
                  </td>
                  <td>{record.plan}</td>
                  <td>{record.subscriptionStatus}</td>
                  <td>{record.businessLimit}</td>
                  <td>{record.additionalBusinessSlots}</td>
                  <td>{record.region}</td>
                  <td>
                    {record.linkedTicketIds.length ? `T:${record.linkedTicketIds.length}` : '—'}
                    {record.linkedErrorIds.length ? ` · E:${record.linkedErrorIds.length}` : ''}
                    {record.linkedIncidentIds.length ? ` · I:${record.linkedIncidentIds.length}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="ticket-empty-state">
          <span>No matching businesses</span>
          <p>Try a broader search or reset the current filters.</p>
        </section>
      )}
    </section>
  );
}
