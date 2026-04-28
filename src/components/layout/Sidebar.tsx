import { NavLink } from 'react-router-dom';

const navGroups = [
  {
    label: 'Support',
    items: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/tickets', label: 'Tickets' },
      { to: '/errors', label: 'Errors' },
      { to: '/incidents', label: 'Incidents' },
    ],
  },
  {
    label: 'Product Context',
    items: [
      { to: '/users', label: 'Users' },
      { to: '/businesses', label: 'Businesses' },
      { to: '/knowledge', label: 'Knowledge Base' },
      { to: '/resolutions', label: 'Resolutions' },
      { to: '/releases', label: 'Releases' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/reports', label: 'Reports' },
      { to: '/activity', label: 'Activity' },
      { to: '/data', label: 'Data' },
      { to: '/backups', label: 'Backups' },
      { to: '/settings', label: 'Settings' },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>InEx IT Support</h1>
      <p>Internal support console for InEx Ledger</p>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navGroups.map((group) => (
          <div key={group.label} className="sidebar-group">
            <div className="sidebar-group-label">{group.label}</div>
            {group.items.map((item) => (
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
          </div>
        ))}
      </nav>
    </aside>
  );
}
