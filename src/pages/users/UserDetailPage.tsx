import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBusinesses } from '@/features/businesses/lib/businessStore';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import { getUserById, updateUser } from '@/features/users/lib/userStore';
import '@/features/tickets/styles/tickets.css';

export function UserDetailPage() {
  const { userId = '' } = useParams();
  const [version, setVersion] = useState(0);
  const user = useMemo(() => getUserById(userId), [userId, version]);
  const businesses = useMemo(() => getBusinesses(), [version]);
  const tickets = useMemo(() => getTickets(), [version]);
  const errors = useMemo(() => getErrors(), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  if (!user) {
    return (
      <section className="ticket-workspace-page">
        <div className="ticket-page-header">
          <div>
            <span className="ticket-page-eyebrow">User Detail</span>
            <h2>User Not Found</h2>
            <p>The requested user support record does not exist in local storage yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const linkedBusinesses = businesses.filter((record) => user.relatedBusinessIds.includes(record.id));
  const linkedTickets = tickets.filter((record) => user.linkedTicketIds.includes(record.id));
  const linkedErrors = errors.filter((record) => user.linkedErrorIds.includes(record.id));

  function updateAndRefresh(updates: Partial<typeof user>) {
    updateUser(user.id, updates);
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">User Detail</span>
          <h2>{user.displayName}</h2>
          <p>{user.id} · {user.email} · {user.plan}</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Subscription</span><strong>{user.subscriptionStatus}</strong></article>
        <article className="ticket-stat-card"><span>Email Verified</span><strong>{user.emailVerified ? 'Yes' : 'No'}</strong></article>
        <article className="ticket-stat-card"><span>Businesses</span><strong>{user.relatedBusinessIds.length}</strong></article>
        <article className="ticket-stat-card"><span>Linked Tickets</span><strong>{user.linkedTicketIds.length}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>User Profile</h3>
          <span>Support-side customer context, subscription state, and preferences.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Display Name
            <input defaultValue={user.displayName} onBlur={(event) => updateAndRefresh({ displayName: event.target.value.trim() })} />
          </label>
          <label>
            Email
            <input defaultValue={user.email} onBlur={(event) => updateAndRefresh({ email: event.target.value.trim() })} />
          </label>
          <label>
            Role
            <input defaultValue={user.role} onBlur={(event) => updateAndRefresh({ role: event.target.value as typeof user.role })} />
          </label>
          <label>
            Plan
            <input defaultValue={user.plan} onBlur={(event) => updateAndRefresh({ plan: event.target.value as typeof user.plan })} />
          </label>
          <label>
            Subscription Status
            <input defaultValue={user.subscriptionStatus} onBlur={(event) => updateAndRefresh({ subscriptionStatus: event.target.value as typeof user.subscriptionStatus })} />
          </label>
          <label>
            Region
            <input defaultValue={user.region} onBlur={(event) => updateAndRefresh({ region: event.target.value as typeof user.region })} />
          </label>
          <label>
            Language
            <input defaultValue={user.language} onBlur={(event) => updateAndRefresh({ language: event.target.value as typeof user.language })} />
          </label>
          <label>
            Email Verified
            <select value={user.emailVerified ? 'true' : 'false'} onChange={(event) => updateAndRefresh({ emailVerified: event.target.value === 'true' })}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Linked Businesses</h3>
          <span>Business records connected to this user.</span>
        </div>
        <div className="ticket-detail-stack">
          {linkedBusinesses.length ? linkedBusinesses.map((record) => (
            <article key={record.id} className="ticket-activity-item">
              <div className="ticket-activity-meta">
                <strong>{record.businessName}</strong>
                <span>{record.id}</span>
              </div>
              <p>{record.plan} · {record.subscriptionStatus}</p>
            </article>
          )) : <p>No linked businesses.</p>}
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Linked Support Records</h3>
          <span>Current ticket and error history tied to this user.</span>
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
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Internal Support Notes</h3>
          <span>Record account-specific context for future troubleshooting.</span>
        </div>
        <div className="ticket-detail-stack">
          <label>
            Notes
            <textarea rows={5} defaultValue={user.notes} onBlur={(event) => updateAndRefresh({ notes: event.target.value.trim() })} />
          </label>
          <label>
            Tags
            <input defaultValue={user.tags.join(', ')} onBlur={(event) => updateAndRefresh({ tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} />
          </label>
        </div>
      </section>
    </section>
  );
}
