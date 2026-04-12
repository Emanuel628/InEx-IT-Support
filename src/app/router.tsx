import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';

import { DashboardPage } from '@/pages/dashboard/DashboardPage';

import { TicketsWorkspacePage } from '@/pages/tickets/TicketsWorkspacePage';
import { CreateTicketWorkspacePage } from '@/pages/tickets/CreateTicketWorkspacePage';
import { TicketDetailWorkspacePage } from '@/pages/tickets/TicketDetailWorkspacePage';

import { UsersPage } from '@/pages/users/UsersPage';
import { UserDetailPage } from '@/pages/users/UserDetailPage';

import { AssetsPage } from '@/pages/assets/AssetsPage';
import { AssetDetailPage } from '@/pages/assets/AssetDetailPage';

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

      { path: 'users', element: <UsersPage /> },
      { path: 'users/:userId', element: <UserDetailPage /> },

      { path: 'assets', element: <AssetsPage /> },
      { path: 'assets/:assetId', element: <AssetDetailPage /> },

      { path: 'knowledge', element: <KnowledgeBasePage /> },
      { path: 'knowledge/:articleId', element: <KnowledgeArticleDetailPage /> },

      { path: 'reports', element: <ReportsPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'data', element: <DataPage /> },

      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/team', element: <TeamPage /> },
      { path: 'settings/categories', element: <CategoriesStatusesPage /> },

      { path: 'backups', element: <BackupsPage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);