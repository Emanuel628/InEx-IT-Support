import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

import { DashboardPage } from '@/pages/dashboard/DashboardPage';

import { TicketsWorkspacePage } from '@/pages/tickets/TicketsWorkspacePage';
import { CreateTicketWorkspacePage } from '@/pages/tickets/CreateTicketWorkspacePage';
import { TicketDetailWorkspacePage } from '@/pages/tickets/TicketDetailWorkspacePage';

import { ErrorsPage } from '@/pages/errors/ErrorsPage';
import { CreateErrorPage } from '@/pages/errors/CreateErrorPage';
import { ErrorDetailPage } from '@/pages/errors/ErrorDetailPage';

import { UsersPage } from '@/pages/users/UsersPage';
import { UserDetailPage } from '@/pages/users/UserDetailPage';

import { BusinessesPage } from '@/pages/businesses/BusinessesPage';
import { BusinessDetailPage } from '@/pages/businesses/BusinessDetailPage';

import { KnowledgeBasePage } from '@/pages/knowledge/KnowledgeBasePage';
import { KnowledgeArticleDetailPage } from '@/pages/knowledge/KnowledgeArticleDetailPage';

import { ReportsPage } from '@/pages/reports/ReportsPage';
import { ActivityPage } from '@/pages/activity/ActivityPage';
import { DataPage } from '@/pages/data/DataPage';

import { SettingsPage } from '@/pages/settings/SettingsPage';
import { TeamPage } from '@/pages/settings/TeamPage';
import { CategoriesStatusesPage } from '@/pages/settings/CategoriesStatusesPage';

import { BackupsPage } from '@/pages/backups/BackupsPage';

import { LoginPage } from '@/pages/system/LoginPage';
import { NotFoundPage } from '@/pages/system/NotFoundPage';

const incidentsListPage = (
  <PlaceholderPage
    title="Incidents"
    description="Major support event tracking for larger InEx Ledger problems."
    cards={[
      { title: 'Active Incidents', body: 'Monitor larger support events and current status.' },
      { title: 'Impact', body: 'Track affected areas, customer impact, and workaround notes.' },
      { title: 'Linked Records', body: 'Tie incidents to tickets, errors, releases, and resolutions.' },
    ]}
  />
);

const incidentCreatePage = (
  <PlaceholderPage
    title="Create Incident"
    description="Scaffold page for logging a larger support event."
    cards={[
      { title: 'Summary', body: 'Capture title, status, severity, and affected areas.' },
      { title: 'Impact', body: 'Document customer impact, workaround, and timeline notes.' },
      { title: 'Links', body: 'Prepare links to tickets, errors, releases, and resolutions.' },
    ]}
  />
);

const incidentDetailPage = (
  <PlaceholderPage
    title="Incident Detail"
    description="Detailed view for one incident and its linked support history."
    cards={[
      { title: 'Incident State', body: 'Review status, severity, environment, and affected areas.' },
      { title: 'Timeline', body: 'Track investigation, workaround, and resolution notes.' },
      { title: 'Connected Records', body: 'Inspect linked tickets, errors, releases, and resolutions.' },
    ]}
  />
);

const knowledgeCreatePage = (
  <PlaceholderPage
    title="New Knowledge Article"
    description="Scaffold page for reusable troubleshooting and support procedures."
    cards={[
      { title: 'Article Basics', body: 'Set title, type, category, and app area.' },
      { title: 'Support Guidance', body: 'Capture symptoms, cause, troubleshooting, and resolution steps.' },
      { title: 'Related Records', body: 'Link the article to tickets, resolutions, and known issues.' },
    ]}
  />
);

const resolutionsListPage = (
  <PlaceholderPage
    title="Resolutions"
    description="Historical records of what fixed real InEx Ledger support problems."
    cards={[
      { title: 'Solved Cases', body: 'Review exact fixes and verification steps from prior issues.' },
      { title: 'Root Cause History', body: 'Track recurring problem patterns and final fixes.' },
      { title: 'Linked Records', body: 'Connect resolutions to tickets, errors, incidents, and releases.' },
    ]}
  />
);

const resolutionCreatePage = (
  <PlaceholderPage
    title="New Resolution"
    description="Scaffold page for documenting an exact historical fix."
    cards={[
      { title: 'Problem Summary', body: 'Record what broke and who was affected.' },
      { title: 'Fix Applied', body: 'Capture the exact change, command, or workflow that fixed it.' },
      { title: 'Verification', body: 'Document how the fix was confirmed and what to watch afterward.' },
    ]}
  />
);

const resolutionDetailPage = (
  <PlaceholderPage
    title="Resolution Detail"
    description="Detailed historical fix record for a resolved support problem."
    cards={[
      { title: 'Root Cause', body: 'Review the confirmed cause of the issue.' },
      { title: 'Fix Record', body: 'See the exact files, commands, and notes used to fix it.' },
      { title: 'Verification Trail', body: 'Inspect validation steps, rollback notes, and linked records.' },
    ]}
  />
);

const releasesListPage = (
  <PlaceholderPage
    title="Releases"
    description="Support-side release and deploy context for troubleshooting recent changes."
    cards={[
      { title: 'Recent Changes', body: 'Track recent deploys, migrations, and known risks.' },
      { title: 'Verification', body: 'Review release checklists and rollback notes.' },
      { title: 'Linked Issues', body: 'Connect releases to tickets, errors, incidents, and resolutions.' },
    ]}
  />
);

const releaseCreatePage = (
  <PlaceholderPage
    title="New Release Record"
    description="Scaffold page for documenting a product change or deployment."
    cards={[
      { title: 'Release Basics', body: 'Capture version, commit, environment, and release date.' },
      { title: 'Change Summary', body: 'Document changed areas, migrations, and known risks.' },
      { title: 'Support Context', body: 'Link the release to tickets, errors, incidents, and resolutions.' },
    ]}
  />
);

const releaseDetailPage = (
  <PlaceholderPage
    title="Release Detail"
    description="Detailed support view for one release record."
    cards={[
      { title: 'Release Snapshot', body: 'Review version, commit, environment, and date.' },
      { title: 'Risk + Verification', body: 'Inspect known risks, verification checklist, and rollback notes.' },
      { title: 'Linked Records', body: 'See related tickets, errors, incidents, and resolutions.' },
    ]}
  />
);

const workflowSettingsPage = (
  <PlaceholderPage
    title="Workflow Settings"
    description="Local-first support workflow vocabulary and status configuration."
    cards={[
      { title: 'Statuses', body: 'Configure support workflow states and display order.' },
      { title: 'Priorities + Sources', body: 'Adjust local dropdown values for triage.' },
      { title: 'Defaults', body: 'Define support-side defaults for forms and assignments.' },
    ]}
  />
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },

      { path: 'dashboard', element: <DashboardPage /> },

      { path: 'tickets', element: <TicketsWorkspacePage /> },
      { path: 'tickets/new', element: <CreateTicketWorkspacePage /> },
      { path: 'tickets/:ticketId', element: <TicketDetailWorkspacePage /> },

      { path: 'errors', element: <ErrorsPage /> },
      { path: 'errors/new', element: <CreateErrorPage /> },
      { path: 'errors/:errorId', element: <ErrorDetailPage /> },

      { path: 'incidents', element: incidentsListPage },
      { path: 'incidents/new', element: incidentCreatePage },
      { path: 'incidents/:incidentId', element: incidentDetailPage },

      { path: 'users', element: <UsersPage /> },
      { path: 'users/:userId', element: <UserDetailPage /> },

      { path: 'businesses', element: <BusinessesPage /> },
      { path: 'businesses/:businessId', element: <BusinessDetailPage /> },

      { path: 'knowledge', element: <KnowledgeBasePage /> },
      { path: 'knowledge/new', element: knowledgeCreatePage },
      { path: 'knowledge/:articleId', element: <KnowledgeArticleDetailPage /> },

      { path: 'resolutions', element: resolutionsListPage },
      { path: 'resolutions/new', element: resolutionCreatePage },
      { path: 'resolutions/:resolutionId', element: resolutionDetailPage },

      { path: 'releases', element: releasesListPage },
      { path: 'releases/new', element: releaseCreatePage },
      { path: 'releases/:releaseId', element: releaseDetailPage },

      { path: 'reports', element: <ReportsPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'data', element: <DataPage /> },
      { path: 'backups', element: <BackupsPage /> },

      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/team', element: <TeamPage /> },
      { path: 'settings/categories', element: <CategoriesStatusesPage /> },
      { path: 'settings/workflow', element: workflowSettingsPage },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
