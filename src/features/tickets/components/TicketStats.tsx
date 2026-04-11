import type { TicketRecord } from '@/types/tickets';

function countByStatus(tickets: TicketRecord[], status: TicketRecord['status']) {
  return tickets.filter((ticket) => ticket.status === status).length;
}

export function TicketStats({ tickets }: { tickets: TicketRecord[] }) {
  const openCount = tickets.filter((ticket) => ticket.status !== 'resolved').length;
  const overdueCount = tickets.filter(
    (ticket) => ticket.status !== 'resolved' && ticket.priority === 'critical',
  ).length;
  const waitingCount = countByStatus(tickets, 'waiting_on_user');
  const resolvedCount = countByStatus(tickets, 'resolved');

  const cards = [
    { label: 'Open', value: openCount },
    { label: 'Critical / Overdue', value: overdueCount },
    { label: 'Waiting on User', value: waitingCount },
    { label: 'Resolved', value: resolvedCount },
  ];

  return (
    <div className="ticket-stats-grid">
      {cards.map((card) => (
        <article key={card.label} className="ticket-stat-card">
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </div>
  );
}
