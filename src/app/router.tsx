import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';

import { DashboardPage } from '@/pages/dashboard/DashboardPage';

import { TicketsWorkspacePage } from '@/pages/tickets/TicketsWorkspacePage';
import { CreateTicketWorkspacePage } from '@/pages/tickets/CreateTicketWorkspacePage';
import { TicketDetailWorkspacePage } from '@/pages/tickets/TicketDetailWorkspacePage';

import { ErrorsPage } from '@/pages/errors/ErrorsPage';
import { CreateErrorPage } from '@/pages/errors/CreateErrorPage';
import { ErrorDetailPage } from '@/pages/errors/ErrorDetailPage';

import { IncidentsPage } from '@/pages/incidents/IncidentsPage';
import { CreateIncidentPage } from '@/pages/incidents/CreateIncidentPage';
import { IncidentDetailPage } from '@/pages/incidents/IncidentDetailPage';

import { UsersPage } from '@/pages/users/UsersPage';
import { UserDetailPage } from '@/pages/users/UserDetailPage';

import { BusinessesPage } from '@/pages/businesses/BusinessesPage';
import { BusinessDetailPage } from '@/pages/businesses/BusinessDetailPage';

import { KnowledgeBasePage } from '@/pages/knowledge/KnowledgeBasePage';
import { CreateKnowledgeArticlePage } from '@/pages/knowledge/CreateKnowledgeArticlePage';
import { KnowledgeArticleDetailPage } from '@/pages/knowledge/KnowledgeArticleDetailPage';

import { ResolutionsPage } from '@/pages/resolutions/ResolutionsPage';
import { CreateResolutionPage } from '@/pages/resolutions/CreateResolutionPage';
import { ResolutionDetailPage } from '@/pages/resolutions/ResolutionDetailPage';

import { ReleasesPage } from '@/pages/releases/ReleasesPage';
import { CreateReleasePage } from '@/pages/releases/CreateReleasePage';
import { ReleaseDetailPage } from '@/pages/releases/ReleaseDetailPage';

import { ReportsPage } from '@/pages/reports/ReportsPage';
import { ActivityPage } from '@/pages/activity/ActivityPage';
import { DataPage } from '@/pages/data/DataPage';

import { SettingsPage } from '@/pages/settings/SettingsPage';
import { TeamPage } from '@/pages/settings/TeamPage';
import { CategoriesStatusesPage } from '@/pages/settings/CategoriesStatusesPage';
import { WorkflowPage } from '@/pages/settings/WorkflowPage';

import { BackupsPage } from '@/pages/backups/BackupsPage';

import { LoginPage } from '@/pages/system/LoginPage';
import { NotFoundPage } from '@/pages/system/NotFoundPage';

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

      { path: 'incidents', element: <IncidentsPage /> },
      { path: 'incidents/new', element: <CreateIncidentPage /> },
      { path: 'incidents/:incidentId', element: <IncidentDetailPage /> },

      { path: 'users', element: <UsersPage /> },
      { path: 'users/:userId', element: <UserDetailPage /> },

      { path: 'businesses', element: <BusinessesPage /> },
      { path: 'businesses/:businessId', element: <BusinessDetailPage /> },

      { path: 'knowledge', element: <KnowledgeBasePage /> },
      { path: 'knowledge/new', element: <CreateKnowledgeArticlePage /> },
      { path: 'knowledge/:articleId', element: <KnowledgeArticleDetailPage /> },

      { path: 'resolutions', element: <ResolutionsPage /> },
      { path: 'resolutions/new', element: <CreateResolutionPage /> },
      { path: 'resolutions/:resolutionId', element: <ResolutionDetailPage /> },

      { path: 'releases', element: <ReleasesPage /> },
      { path: 'releases/new', element: <CreateReleasePage /> },
      { path: 'releases/:releaseId', element: <ReleaseDetailPage /> },

      { path: 'reports', element: <ReportsPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'data', element: <DataPage /> },
      { path: 'backups', element: <BackupsPage /> },

      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/team', element: <TeamPage /> },
      { path: 'settings/categories', element: <CategoriesStatusesPage /> },
      { path: 'settings/workflow', element: <WorkflowPage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
