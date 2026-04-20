import type { TicketActivityItem } from '@/types/tickets';

export function TicketActivityTimeline({ items }: { items: TicketActivityItem[] }) {
  return (
    <section className="ticket-detail-panel">
      <div className="ticket-section-header">
        <h3>Activity Timeline</h3>
        <span>Recent actions and internal notes</span>
      </div>

      <div className="ticket-timeline">
        {items.length ? (
          items.map((item) => (
            <article key={item.id} className="ticket-timeline-item">
              <strong>{item.author}</strong>
              <span>
                {item.time} · {item.type}
              </span>
              <p>{item.text}</p>
            </article>
          ))
        ) : (
          <article className="ticket-timeline-item">
            <strong>System</strong>
            <span>No activity yet</span>
            <p>This ticket does not have any timeline entries yet.</p>
          </article>
        )}
      </div>
    </section>
  );
}