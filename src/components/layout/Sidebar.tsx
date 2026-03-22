import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard',    icon: <DashboardIcon /> },
  { to: '/vehicles',  label: 'Veículos',     icon: <VehiclesIcon /> },
  { to: '/history',   label: 'Histórico',    icon: <HistoryIcon /> },
  { to: '/stats',     label: 'Estatísticas', icon: <StatsIcon /> },
  { to: '/profile',   label: 'Perfil',       icon: <ProfileIcon /> },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()

  return (
    <aside
      className="hidden lg:flex flex-col w-60 min-h-screen fixed left-0 top-0 z-30 py-6 px-3"
      style={{
        background: 'rgba(19,19,19,0.96)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(72,72,71,0.12)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)',
            boxShadow: '0 0 14px rgba(63,255,139,0.28)',
          }}
        >
          <CarIcon />
        </div>
        <span className="font-display font-bold text-base tracking-tight text-on-surface">
          HCM
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => [
              'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150',
              isActive
                ? 'text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-highest',
            ].join(' ')}
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)',
              boxShadow: '0 0 14px rgba(63,255,139,0.18)',
            } : {}}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <button
        onClick={logout}
        title="Sair da conta"
        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl w-full transition-all hover:bg-surface-highest cursor-pointer"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-on-primary"
          style={{ background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)' }}
        >
          {user?.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="text-xs font-semibold text-on-surface truncate w-full">
            {user?.name ?? 'Usuário'}
          </span>
          <span className="text-[10px] text-on-surface-variant truncate w-full">
            {user?.email ?? ''}
          </span>
        </div>
        <LogoutIcon />
      </button>
    </aside>
  )
}

function CarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005d2c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5v-3l2-6h10l2 6v3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>
}
function VehiclesIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5v-3l2-6h10l2 6v3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>
}
function DashboardIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
}
function HistoryIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4"/><polyline points="1 4 3 6 5 4"/></svg>
}
function StatsIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
}
function ProfileIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function LogoutIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}
