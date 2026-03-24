import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useVehicleStore } from '../store/vehicleStore'
import { useVehicles } from '../hooks/useVehicles'
import { useMaintenances } from '../hooks/useMaintenances'
import { AppLayout } from '../components/layout/AppLayout'
import { VehicleCard } from '../components/dashboard/VehicleCard'
import { MetricCard } from '../components/dashboard/MetricCard'
import { NextMaintenance } from '../components/dashboard/NextMaintenance'
import { MaintenanceTimeline } from '../components/dashboard/MaintenanceTimeline'

export function DashboardPage() {
  const { user }      = useAuthStore()
  const healthEnabled = user?.healthScoreEnabled !== false
  const navigate      = useNavigate()
  const hour          = new Date().getHours()
  const greeting      = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  /* ── Dados da API ──────────────────────────────────────────────────── */
  const { vehicles, isLoading: loadingVehicles } = useVehicles()

  const { selectedVehicleId, setSelectedVehicleId } = useVehicleStore()

  // Inicializa com o primeiro veículo quando a lista carrega e não há seleção persistida
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id)
    }
  }, [vehicles, selectedVehicleId, setSelectedVehicleId])

  const vehicle = vehicles.find(v => v.id === selectedVehicleId) ?? vehicles[0] ?? null

  const { maintenances, isLoading: loadingMaintenances } = useMaintenances(vehicle?.id)

  const today = new Date().toISOString().split('T')[0]
  const completed  = maintenances.filter(m => m.date.slice(0, 10) <= today)
  const scheduled  = maintenances.filter(m => m.date.slice(0, 10) >  today)

  // Próxima manutenção agendada (mais próxima primeiro)
  const nextScheduled = scheduled.sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
  const kmRemaining   = nextScheduled?.km && vehicle
    ? Math.max(0, nextScheduled.km - vehicle.odometer)
    : null

  // Últimas 2 manutenções concluídas para o timeline
  const timelineItems = completed.slice(0, 2).map(m => ({
    id:    m.id,
    title: m.type,
    date:  new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
    value: (m.price ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  }))

  const totalInvestment   = completed.reduce((sum, m) => sum + (m.price ?? 0), 0)
  const scheduledTotal    = scheduled.reduce((sum, m) => sum + (m.price ?? 0), 0)
  const scheduledTotalFmt = scheduledTotal > 0
    ? scheduledTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : undefined

  const allMetrics = [
    { id: 'odometer',   icon: <OdometerIcon />, label: 'Odômetro',            value: vehicle ? vehicle.odometer.toLocaleString('pt-BR') : '—', unit: 'km', accentColor: '#6e9bff', onClick: vehicle ? () => navigate(`/edit-vehicle/${vehicle.id}`) : undefined },
    { id: 'health',     icon: <HeartIcon />,    label: 'Health Score',         value: vehicle ? `${vehicle.healthScore}` : '—',                unit: '%',  accentColor: '#3fff8b' },
    { id: 'scheduled',  icon: <CalendarIcon />, label: 'Próximas manutenções', value: vehicle ? `${scheduled.length}` : '—', subtitle: vehicle ? scheduledTotalFmt : undefined, accentColor: '#7ae6ff', onClick: vehicle ? () => navigate('/history?filter=scheduled') : undefined },
    { id: 'investment', icon: <MoneyIcon />,    label: 'Investimento total',   value: totalInvestment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), accentColor: '#3fff8b', onClick: vehicle ? () => navigate('/history?filter=all') : undefined },
  ]
  const metrics = allMetrics.filter(m => m.id !== 'health' || healthEnabled)

  return (
    <AppLayout>
      <div className="page-content">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-on-surface-variant">{greeting},</p>
            <h1 className="font-display font-bold text-2xl text-on-surface leading-tight">
              {user?.name ?? 'Usuário'} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-colors hover:bg-surface-highest cursor-pointer"
              style={{ background: '#1a1a1a' }}
              aria-label="Notificações"
            >
              <BellIcon />
              <span
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                style={{ background: '#ff716c', boxShadow: '0 0 5px rgba(255,113,108,0.6)' }}
              />
            </button>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-on-primary flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)' }}
            >
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </header>

        {/* Vehicle selector — só aparece com 2+ veículos */}
        {!loadingVehicles && vehicles.length > 1 && (
          <div
            className="flex items-center gap-3 h-12 px-4 rounded-full"
            style={{ background: '#1a1a1a' }}
          >
            <CarSelectorIcon />
            <select
              value={selectedVehicleId ?? ''}
              onChange={e => setSelectedVehicleId(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-on-surface focus:outline-none cursor-pointer appearance-none"
              style={{ caretColor: '#3fff8b' }}
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id} style={{ background: '#1a1a1a' }}>
                  {v.nickname} — {v.brand} {v.model}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        )}

        {/* Vehicle Card */}
        {loadingVehicles ? (
          <SkeletonCard height={200} />
        ) : vehicle ? (
          <VehicleCard
            name={vehicle.nickname}
            model={`${vehicle.brand} ${vehicle.model} · ${vehicle.year}`}
            healthScore={vehicle.healthScore}
            status={healthEnabled ? (vehicle.healthScore >= 80 ? 'Em Plena Saúde' : vehicle.healthScore >= 50 ? 'Atenção necessária' : 'Manutenção urgente') : 'Ativo'}
            statusOk={healthEnabled ? vehicle.healthScore >= 80 : true}
            healthScoreEnabled={healthEnabled}
            onEdit={() => navigate(`/edit-vehicle/${vehicle.id}`)}
          />
        ) : (
          <EmptyVehicle onAdd={() => navigate('/add-vehicle')} />
        )}

        {/* Metrics */}
        <section className="flex flex-col gap-3">
          <p className="section-label px-1">Métricas</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {metrics.map(m => <MetricCard key={m.id} {...m} />)}
          </div>
        </section>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loadingVehicles || loadingMaintenances ? (
            <SkeletonCard height={160} />
          ) : nextScheduled ? (
            <NextMaintenance
              title={nextScheduled.type}
              description={nextScheduled.description ?? 'Manutenção agendada'}
              kmRemaining={kmRemaining ?? undefined}
              onBook={() => navigate('/add-maintenance?mode=schedule')}
            />
          ) : (
            <NextMaintenance
              title="Sem manutenção agendada"
              description="Agende um serviço para monitorar aqui."
              onBook={() => navigate('/add-maintenance?mode=schedule')}
            />
          )}
          {loadingVehicles || loadingMaintenances ? (
            <SkeletonCard height={180} />
          ) : (
            <MaintenanceTimeline
              items={timelineItems}
              onViewAll={() => navigate('/history')}
              onAdd={() => navigate('/add-maintenance')}
            />
          )}
        </div>

      </div>
    </AppLayout>
  )
}

/* ── Skeleton loader ────────────────────────────────────────────────────── */
function SkeletonCard({ height }: { height: number }) {
  return (
    <div
      className="rounded-[1.75rem] animate-pulse"
      style={{ height, background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)', backgroundSize: '200% 100%' }}
    />
  )
}

/* ── Empty state ────────────────────────────────────────────────────────── */
function EmptyVehicle({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="card-hero flex flex-col items-center justify-center gap-4 py-10 text-center"
    >
      <div
        className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center"
        style={{ background: 'rgba(63,255,139,0.10)' }}
      >
        <CarIcon size={24} color="#3fff8b" />
      </div>
      <div>
        <p className="font-display font-bold text-lg text-on-surface">Nenhum veículo cadastrado</p>
        <p className="text-sm text-on-surface-variant mt-1">Adicione seu veículo para começar</p>
      </div>
      <button
        onClick={onAdd}
        className="h-10 px-6 rounded-full text-sm font-semibold text-on-primary cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)' }}
      >
        Adicionar veículo
      </button>
    </div>
  )
}

/* ── Ícones ─────────────────────────────────────────────────────────────── */
function OdometerIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="12"/></svg> }
function HeartIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> }
function MoneyIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function CalendarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function BellIcon()     { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function CarIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5v-3l2-6h10l2 6v3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>
}
function CarSelectorIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5v-3l2-6h10l2 6v3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg> }
function ChevronIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg> }
