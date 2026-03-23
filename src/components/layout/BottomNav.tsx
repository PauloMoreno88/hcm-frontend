import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/vehicles',  label: 'Veículos',  icon: <VehiclesIcon /> },
  { to: '/history',   label: 'Histórico', icon: <HistoryIcon /> },
  { to: '/stats',     label: 'Stats',     icon: <StatsIcon /> },
  { to: '/profile',   label: 'Perfil',    icon: <ProfileIcon /> },
]

export function BottomNav() {

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around h-[68px] px-2"
      style={{
        background: 'rgba(19,19,19,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(72,72,71,0.12)',
      }}
    >
      {/* First two items */}
      {NAV_ITEMS.slice(0, 2).map(({ to, label, icon }) => (
        <NavItem key={to} to={to} label={label} icon={icon} />
      ))}

      {/* FAB central
      <button
        onClick={() => navigate('/add-maintenance')}
        className="flex items-center justify-center w-13 h-13 rounded-full -mt-5 transition-all active:scale-95 cursor-pointer"
        style={{
          width: 52,
          height: 52,
          background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)',
          boxShadow: '0 0 20px rgba(63,255,139,0.38), 0 6px 16px rgba(0,0,0,0.35)',
        }}
        aria-label="Adicionar manutenção"
      >
        <PlusIcon />
      </button> */}

      {/* Last two items */}
      {NAV_ITEMS.slice(2).map(({ to, label, icon }) => (
        <NavItem key={to} to={to} label={label} icon={icon} />
      ))}
    </nav>
  )
}

function NavItem({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => [
        'flex flex-col items-center gap-1 w-12 py-1 transition-colors duration-150',
        isActive ? 'text-primary' : 'text-on-surface-variant',
      ].join(' ')}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  )
}

function VehiclesIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5v-3l2-6h10l2 6v3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg> }
function DashboardIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg> }
function HistoryIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4"/><polyline points="1 4 3 6 5 4"/></svg> }
function StatsIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function ProfileIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
// function PlusIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#005d2c" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
