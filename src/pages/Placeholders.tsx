import { ReactNode } from 'react';

function PlaceholderPage({ title, description, cards }: { title: string; description: string; cards: Array<{ title: string; body: string }> }) {
  return (
    <section className="placeholder-page">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="placeholder-grid">
        {cards.map((card) => (
          <article key={card.title} className="placeholder-card">
            <strong>{card.title}</strong>
            <span>{card.body}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

const makePage = (title: string, description: string, cards: Array<{ title: string; body: string }>) => () => (
  <PlaceholderPage title={title} description={description} cards={cards} />
);

export const DashboardPage = makePage('Dashboard', 'Daily command center for support operations.', [
  { title: 'Open Tickets', body: 'Track new, assigned, and overdue work.' },
  { title: 'My Queue', body: 'Focus on what the current technician needs to work.' },
  { title: 'Recent Activity', body: 'Surface fresh changes and follow-up items.' },
]);

export const TicketsPage = makePage('Tickets', 'Main ticket queue with filters, search, and workflow controls.', [
  { title: 'Queue Table', body: 'Ticket ID, status, priority, requester, and due dates.' },
  { title: 'Filters', body: 'Slice by status, tech, category, and urgency.' },
  { title: 'Quick Actions', body: 'Assign, update, escalate, or resolve fast.' },
]);

export const CreateTicketPage = makePage('Create Ticket', 'Ticket intake screen for fast issue logging.', [
  { title: 'Requester', body: 'Select the user needing help.' },
  { title: 'Issue Details', body: 'Capture title, summary, category, and priority.' },
  { title: 'Assignment', body: 'Route to a technician or support queue.' },
]);

export const TicketDetailPage = makePage('Ticket Detail', 'Full ticket record with activity, notes, and resolution tracking.', [
  { title: 'Summary', body: 'Issue context, affected user, and linked asset.' },
  { title: 'Timeline', body: 'Internal notes and support actions in order.' },
  { title: 'Resolution', body: 'Track final fix and closeout details.' },
]);

export const UsersPage = makePage('Users', 'Directory for employee lookup and support history.', [
  { title: 'User Search', body: 'Find employees by name, email, or department.' },
  { title: 'History', body: 'Review past tickets and recurring issues.' },
  { title: 'Assignments', body: 'See linked devices and support ownership.' },
]);

export const UserDetailPage = makePage('User Detail', 'Full user support profile.', [
  { title: 'Profile', body: 'Contact details, department, and location.' },
  { title: 'Assets', body: 'Devices assigned to the user.' },
  { title: 'Ticket History', body: 'Past and current support interactions.' },
]);

export const AssetsPage = makePage('Assets', 'Hardware and device inventory workspace.', [
  { title: 'Inventory', body: 'Track laptops, desktops, phones, and peripherals.' },
  { title: 'Ownership', body: 'See assigned user and status.' },
  { title: 'Lifecycle', body: 'Monitor warranty, notes, and replacement planning.' },
]);

export const AssetDetailPage = makePage('Asset Detail', 'Detailed view for a specific device or hardware item.', [
  { title: 'Device Profile', body: 'Asset tag, serial number, model, and owner.' },
  { title: 'Support History', body: 'Linked incidents and service notes.' },
  { title: 'Status', body: 'Warranty, location, and lifecycle state.' },
]);

export const KnowledgeBasePage = makePage('Knowledge Base', 'Internal library for common fixes and support procedures.', [
  { title: 'Articles', body: 'Searchable support documentation.' },
  { title: 'Templates', body: 'Standard procedures and troubleshooting guides.' },
  { title: 'Reuse', body: 'Reduce repeated work with common fixes.' },
]);

export const KnowledgeArticleDetailPage = makePage('Knowledge Article Detail', 'Detailed KB article view.', [
  { title: 'Procedure', body: 'Step-by-step instructions for repeatable fixes.' },
  { title: 'Tags', body: 'Organize articles by platform or issue type.' },
  { title: 'Revision', body: 'Track updates as support standards evolve.' },
]);

export const ReportsPage = makePage('Reports', 'Operational visibility for workloads and trends.', [
  { title: 'Volume', body: 'Tickets opened, closed, and aging trends.' },
  { title: 'Categories', body: 'See common issue patterns.' },
  { title: 'Technicians', body: 'Review workload and performance snapshots.' },
]);

export const SettingsPage = makePage('Settings', 'System configuration hub.', [
  { title: 'Workflow', body: 'Adjust statuses, priorities, and support rules.' },
  { title: 'Team', body: 'Manage technicians and assignment defaults.' },
  { title: 'Data Controls', body: 'Handle imports, backups, and exports.' },
]);

export const TeamPage = makePage('Team', 'Technician management and ownership rules.', [
  { title: 'Technicians', body: 'Track active support staff.' },
  { title: 'Assignments', body: 'Define who owns which queues.' },
  { title: 'Roles', body: 'Prepare for future permissions if needed.' },
]);

export const CategoriesStatusesPage = makePage('Categories & Statuses', 'Manage the shared vocabulary of the support workflow.', [
  { title: 'Issue Categories', body: 'Organize incoming problems consistently.' },
  { title: 'Priorities', body: 'Define urgency levels.' },
  { title: 'Statuses', body: 'Map each stage of ticket progress.' },
]);

export const ActivityPage = makePage('Activity', 'Global chronological view of support actions.', [
  { title: 'Updates', body: 'See ticket changes, assignments, and notes.' },
  { title: 'Audit Trail', body: 'Track who did what and when.' },
  { title: 'Follow-Up', body: 'Spot stalled work or recent changes fast.' },
]);

export const DataPage = makePage('Data', 'Import, export, and data utility workspace.', [
  { title: 'Import', body: 'Bring in users, assets, or tickets later.' },
  { title: 'Export', body: 'Download structured data for reporting or backup.' },
  { title: 'Utilities', body: 'Prepare the app for local-first operations.' },
]);

export const BackupsPage = makePage('Backups', 'Backup and restore planning for local support data.', [
  { title: 'Backup Jobs', body: 'Protect the local system state.' },
  { title: 'Restore Flow', body: 'Recover quickly after errors or device loss.' },
  { title: 'History', body: 'Track when data snapshots were taken.' },
]);

export const LoginPage = makePage('Login', 'Reserved route for future authentication or protected mode.', [
  { title: 'Access', body: 'Optional login if shared deployment is added later.' },
  { title: 'Session', body: 'Leave room for technician-specific views.' },
  { title: 'Future Ready', body: 'Not required for local-only MVP.' },
]);

export const NotFoundPage = makePage('Not Found', 'The page you requested does not exist in the current route map.', [
  { title: 'Navigation', body: 'Use the sidebar to return to a valid section.' },
  { title: 'Routing', body: 'This is the app fallback page.' },
  { title: 'Scaffold', body: 'Add more routes as features expand.' },
]);
