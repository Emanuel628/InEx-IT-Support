import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBusinessById, updateBusiness } from '@/features/businesses/lib/businessStore';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { getTickets } from '@/features/tickets/lib/ticketStore';
import { getUsers } from '@/features/users/lib/userStore';
import '@/features/tickets/styles/tickets.css';

export function BusinessDetailPage() {
  const { businessId = '' } = useParams();
  const [version, setVersion] = useState(0);
  const business = useMemo(() => getBusinessById(businessId), [businessId, version]);
  const users = useMemo(() => getUsers(), [version]);
  const tickets = useMemo(() => getTickets(), [version]);
  const errors = useMemo(() => getErrors(), [version]);
  const incidents = useMemo(() => getIncidents(), [version]);

  function refresh() {
    setVersion((current) => current + 1);
  }

  if (!business) {
    return (
      <section className="ticket-workspace-page">
        <div className="ticket-page-header">
          <div>
            <span className="ticket-page-eyebrow">Business Detail</span>
            <h2>Business Not Found</h2>
            <p>The requested business support record does not exist in local storage yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const linkedUsers = users.filter((record) => business.linkedUserIds.includes(record.id));
  const linkedTickets = tickets.filter((record) => business.linkedTicketIds.includes(record.id));
  const linkedErrors = errors.filter((record) => business.linkedErrorIds.includes(record.id));
  const linkedIncidents = incidents.filter((record) => business.linkedIncidentIds.includes(record.id));

  function updateAndRefresh(updates: Partial<typeof business>) {
    updateBusiness(business.id, updates);
    refresh();
  }

  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Business Detail</span>
          <h2>{business.businessName}</h2>
          <p>{business.id} · {business.ownerEmail} · {business.plan}</p>
        </div>
      </div>

      <div className="ticket-stats-grid">
        <article className="ticket-stat-card"><span>Subscription</span><strong>{business.subscriptionStatus}</strong></article>
        <article className="ticket-stat-card"><span>Business Limit</span><strong>{business.businessLimit}</strong></article>
        <article className="ticket-stat-card"><span>Additional Slots</span><strong>{business.additionalBusinessSlots}</strong></article>
        <article className="ticket-stat-card"><span>Linked Incidents</span><strong>{business.linkedIncidentIds.length}</strong></article>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Business Profile</h3>
          <span>Support-side business context, owner details, and billing limits.</span>
        </div>
        <div className="ticket-form-grid">
          <label>
            Business Name
            <input defaultValue={business.businessName} onBlur={(event) => updateAndRefresh({ businessName: event.target.value.trim() })} />
          </label>
          <label>
            Owner Email
            <input defaultValue={business.ownerEmail} onBlur={(event) => updateAndRefresh({ ownerEmail: event.target.value.trim() })} />
          </label>
          <label>
            Plan
            <input defaultValue={business.plan} onBlur={(event) => updateAndRefresh({ plan: event.target.value as typeof business.plan })} />
          </label>
          <label>
            Subscription Status
            <input defaultValue={business.subscriptionStatus} onBlur={(event) => updateAndRefresh({ subscriptionStatus: event.target.value as typeof business.subscriptionStatus })} />
          </label>
          <label>
            Included Businesses
            <input type="number" defaultValue={business.includedBusinesses} onBlur={(event) => updateAndRefresh({ includedBusinesses: Number(event.target.value) || 0 })} />
          </label>
          <label>
            Additional Business Slots
            <input type="number" defaultValue={business.additionalBusinessSlots} onBlur={(event) => updateAndRefresh({ additionalBusinessSlots: Number(event.target.value) || 0 })} />
          </label>
          <label>
            Business Limit
            <input type="number" defaultValue={business.businessLimit} onBlur={(event) => updateAndRefresh({ businessLimit: Number(event.target.value) || 0 })} />
          </label>
          <label>
            Region
            <input defaultValue={business.region} onBlur={(event) => updateAndRefresh({ region: event.target.value as typeof business.region })} />
          </label>
          <label>
            Language
            <input defaultValue={business.language} onBlur={(event) => updateAndRefresh({ language: event.target.value as typeof business.language })} />
          </label>
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Linked Users</h3>
          <span>User records connected to this business.</span>
        </div>
        <div className="ticket-detail-stack">
          {linkedUsers.length ? linkedUsers.map((record) => (
            <article key={record.id} className="ticket-activity-item">
              <div className="ticket-activity-meta">
                <strong>{record.displayName}</strong>
                <span>{record.id}</span>
              </div>
              <p>{record.email} · {record.subscriptionStatus}</p>
            </article>
          )) : <p>No linked users.</p>}
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Linked Support Records</h3>
          <span>Current tickets, errors, and incidents tied to this business.</span>
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
        </div>
      </section>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Internal Support Notes</h3>
          <span>Record subscription, billing-limit, and account-specific support context.</span>
        </div>
        <div className="ticket-detail-stack">
          <label>
            Notes
            <textarea rows={5} defaultValue={business.notes} onBlur={(event) => updateAndRefresh({ notes: event.target.value.trim() })} />
          </label>
          <label>
            Tags
            <input defaultValue={business.tags.join(', ')} onBlur={(event) => updateAndRefresh({ tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} />
          </label>
        </div>
      </section>
    </section>
  );
}
