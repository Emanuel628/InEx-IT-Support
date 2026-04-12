import { TicketCreateForm } from '@/features/tickets/components/TicketCreateForm';
import '@/features/tickets/styles/tickets.css';

export function CreateTicketWorkspacePage() {
  return (
    <section className="ticket-workspace-page">
      <div className="ticket-page-header">
        <div>
          <span className="ticket-page-eyebrow">Create Ticket</span>
          <h2>New Support Ticket</h2>
          <p>Capture requester context, issue details, routing, and due dates.</p>
        </div>
      </div>

      <section className="ticket-detail-panel">
        <div className="ticket-section-header">
          <h3>Intake Form</h3>
          <span>Fast structured issue entry for technicians</span>
        </div>
        <TicketCreateForm />
      </section>
    </section>
  );
}
