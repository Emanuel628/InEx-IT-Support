import type { TicketActivityItem } from '@/features/tickets/data/mockTicketActivity';

export function TicketActivityTimeline({ items }: { items: TicketActivityItem[] }) {
  return (
    <section className="ticket-detail-panel">
      <div className="ticket-section-header">
        <h3>Activity Timeline</h3>
        <span>Recent actions and internal notes</span>
      </div>
      <div className="ticket-timeline">
        {items.map((item) => (
          <article key={item.id} className="ticket-timeline-item">
            <strong>{item.author}</strong>
            <span>{item.time} · {item.type}</span>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
