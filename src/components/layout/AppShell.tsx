import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-panel">
        <Topbar />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
