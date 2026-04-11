import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/users', label: 'Users' },
  { to: '/assets', label: 'Assets' },
  { to: '/knowledge', label: 'Knowledge Base' },
  { to: '/reports', label: 'Reports' },
  { to: '/activity', label: 'Activity' },
  { to: '/data', label: 'Data' },
  { to: '/settings', label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>InEx IT Support</h1>
      <p>Local-first support operations dashboard</p>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
