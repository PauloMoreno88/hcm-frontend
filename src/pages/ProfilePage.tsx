import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../store/authStore'
import { useVehicles } from '../hooks/useVehicles'
import { useMaintenances } from '../hooks/useMaintenances'
import { Button } from '../components/ui/Button'

function computeRankLabel(xp: number): string {
  if (xp < 500)  return 'Bronze'
  if (xp < 1500) return 'Prata'
  if (xp < 3500) return 'Ouro'
  return 'Gold Master'
}

export function ProfilePage() {
  const { user, logout } = useAuthStore()
  const navigate         = useNavigate()

  const { vehicles }  = useVehicles()
  const vehicle       = vehicles[0] ?? null
  const { maintenances } = useMaintenances(vehicle?.id)

  const today      = new Date().toISOString().split('T')[0]
  const completed  = useMemo(() => maintenances.filter(m => m.date.slice(0, 10) <= today), [maintenances, today])
  const totalCost  = useMemo(() => completed.reduce((s, m) => s + (m.price ?? 0), 0), [completed])
  const xp         = useMemo(() => completed.length * 200 + Math.floor(totalCost), [completed, totalCost])
  const rankLabel  = computeRankLabel(xp)

  const vehicleLabel = vehicle
    ? `${vehicle.nickname} · ${vehicle.year}`
    : 'Nenhum veículo cadastrado'

  const odometerLabel = vehicle
    ? `${vehicle.odometer.toLocaleString('pt-BR')} km`
    : '—'

  const SETTINGS_GROUPS = [
    {
      title: 'Veículo',
      items: [
        { icon: <CarIcon />,    label: 'Meu veículo', description: vehicleLabel },
        { icon: <OdoIcon />,    label: 'Odômetro',    description: odometerLabel },
      ],
    },
    {
      title: 'Conta',
      items: [
        { icon: <UserIcon />,   label: 'Dados pessoais', description: 'Nome, e-mail, foto' },
        { icon: <BellIcon />,   label: 'Notificações',   description: 'Alertas de manutenção' },
        { icon: <ShieldIcon />, label: 'Segurança',      description: 'Senha e autenticação' },
      ],
    },
    {
      title: 'Preferências',
      items: [
        { icon: <MoonIcon />,   label: 'Tema',     description: 'Dark mode' },
        { icon: <GlobeIcon />,  label: 'Idioma',   description: 'Português (BR)' },
        { icon: <RulerIcon />,  label: 'Unidades', description: 'km · litros · R$' },
      ],
    },
    {
      title: 'Suporte',
      items: [
        { icon: <HelpIcon />,   label: 'Ajuda e FAQ', description: '' },
        { icon: <InfoIcon />,   label: 'Sobre o app', description: 'Versão 1.0.0' },
      ],
    },
  ]

  return (
    <AppLayout>
      <div className="page-content">

        {/* Hero */}
        <div className="card-hero relative overflow-hidden flex flex-col items-center gap-4 text-center">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(63,255,139,0.07) 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          {/* Avatar */}
          <div
            className="relative w-20 h-20 rounded-[1.5rem] flex items-center justify-center font-display font-bold text-3xl text-on-primary"
            style={{
              background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)',
              boxShadow: '0 0 22px rgba(63,255,139,0.28)',
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
            <span
              className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6e9bff 0%, #0058ca 100%)' }}
            >
              PRO
            </span>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-on-surface">{user?.name ?? 'Usuário'}</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">{user?.email}</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { label: 'Serviços', value: completed.length.toString() },
              { label: 'Health',   value: vehicle ? `${vehicle.healthScore}%` : '—' },
              { label: 'Rank',     value: rankLabel },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl py-3 flex flex-col items-center gap-0.5"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <span className="font-display font-bold text-base text-primary">{value}</span>
                <span className="text-[10px] text-on-surface-variant">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings groups */}
        {SETTINGS_GROUPS.map(group => (
          <section key={group.title} className="flex flex-col gap-2">
            <p className="section-label px-1">{group.title}</p>
            <div className="rounded-[1.75rem] overflow-hidden" style={{ background: '#1a1a1a' }}>
              {group.items.map((item, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03] cursor-pointer"
                  style={idx < group.items.length - 1 ? { borderBottom: '1px solid rgba(72,72,71,0.10)' } : {}}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <span className="text-on-surface-variant">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">{item.description}</p>
                    )}
                  </div>
                  <ChevronIcon />
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* Logout */}
        <Button
          variant="danger"
          fullWidth
          onClick={() => { logout(); navigate('/login') }}
        >
          <LogoutIcon /> Sair da conta
        </Button>

      </div>
    </AppLayout>
  )
}

function CarIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5v-3l2-6h10l2 6v3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg> }
function OdoIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="12"/></svg> }
function UserIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function BellIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function ShieldIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
function MoonIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> }
function GlobeIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> }
function RulerIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 8.7 8.7 21.3a2.4 2.4 0 0 1-3.4 0L2.7 18.7a2.4 2.4 0 0 1 0-3.4L15.3 2.7a2.4 2.4 0 0 1 3.4 0l2.6 2.6a2.4 2.4 0 0 1 0 3.4"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/></svg> }
function HelpIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
function InfoIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> }
function ChevronIcon(){ return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#484847" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg> }
function LogoutIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
