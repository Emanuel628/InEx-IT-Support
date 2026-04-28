import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '@/features/users/lib/userStore';
import '@/features/tickets/styles/tickets.css';

export function UsersPage() {
  const users = getUsers();
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('all');
  const [subscriptionStatus, setSubscriptionStatus] = useState('all');
  const [region, setRegion] = useState('all');

  const filtered = useMemo(() => {
    return users.filter((record) => {
      const matchesSearch = !search.trim() || [record.id, record.displayName, record.email, record.notes].join(' ').toLowerCase().includes(search.trim().toLowerCase());
      const matchesPlan = plan === 'all' || record.plan === plan;
      const matchesSubscription = subscriptionStatus === 'all' || record.subscriptionStatus === subscriptionStatus;
      const matchesRegion = region === 'all' || record.region === region;
      return matchesSearch && matchesPlan && matchesSubscription && matchesRegion;
    });
  }, [plan, region, search, subscriptionStatus, users]);

  const verifiedCount = users.filter((record) => record.emailVerified).length;
  const activeCount = users.filter((record) => record.subscriptionStatus === 'active').length;
  const linkedErrorsCount = users.filter((record) => record.linkedErrorIds.length).length;

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Users</span>
          <h2>Support User Directory</h2>
          <p>Review support-side customer snapshots, linked businesses, and account context for InEx Ledger users.</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Total Users</span><strong>{users.length}</strong></article>
        <article className="ticket-stat-card"><span>Email Verified</span><strong>{verifiedCount}</strong></article>
        <article className="ticket-stat-card"><span>Active Subscription</span><strong>{activeCount}</strong></article>
        <article className="ticket-stat-card"><span>Linked Errors</span><strong>{linkedErrorsCount}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Search + Filters</h3>
          <span>Find users by email, plan, subscription status, region, or note context.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by id, name, email, or notes" />
          </label>
          <label>
            Plan
            <select value={plan} onChange={(event) => setPlan(event.target.value)}>
              <option value="all">All plans</option>
              {Array.from(new Set(users.map((record) => record.plan))).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Subscription Status
            <select value={subscriptionStatus} onChange={(event) => setSubscriptionStatus(event.target.value)}>
              <option value="all">All statuses</option>
              {Array.from(new Set(users.map((record) => record.subscriptionStatus))).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Region
            <select value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="all">All regions</option>
              {Array.from(new Set(users.map((record) => record.region))).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </div>
      </section>

      {filtered.length ? (
        <div className="ticket-table-wrap">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Subscription</th>
                <th>Verified</th>
                <th>Region</th>
                <th>Businesses</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id}>
                  <td>
                    <Link to={`/users/${record.id}`} className="ticket-title-cell">
                      <strong>{record.displayName}</strong>
                      <span>{record.id} · {record.email}</span>
                    </Link>
                  </td>
                  <td>{record.plan}</td>
                  <td>{record.subscriptionStatus}</td>
                  <td>{record.emailVerified ? 'Yes' : 'No'}</td>
                  <td>{record.region}</td>
                  <td>{record.relatedBusinessIds.length}</td>
                  <td>
                    {record.linkedTicketIds.length ? `T:${record.linkedTicketIds.length}` : '—'}
                    {record.linkedErrorIds.length ? ` · E:${record.linkedErrorIds.length}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="ticket-empty-state">
          <span>No matching users</span>
          <p>Try a broader search or reset the current filters.</p>
        </section>
      )}
    </section>
  );
}
