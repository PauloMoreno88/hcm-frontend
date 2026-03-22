import { useMemo } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { MetricCard } from '../components/dashboard/MetricCard'
import { RankCard } from '../components/stats/RankCard'
import { CostChart } from '../components/stats/CostChart'
import { BadgeCard } from '../components/stats/BadgeCard'
import { useAuthStore } from '../store/authStore'
import { useVehicles } from '../hooks/useVehicles'
import { useMaintenances } from '../hooks/useMaintenances'
import { useVehicleStore } from '../store/vehicleStore'

/* ── Rank tiers ─────────────────────────────────────────────────────────── */
function computeRank(xp: number): { rank: string; xpGoal: number; nextRank: string } {
  if (xp < 500)  return { rank: 'Mecânico Bronze', xpGoal: 500,  nextRank: 'Mecânico Prata' }
  if (xp < 1500) return { rank: 'Mecânico Prata',  xpGoal: 1500, nextRank: 'Mecânico Ouro' }
  if (xp < 3500) return { rank: 'Mecânico Ouro',   xpGoal: 3500, nextRank: 'Gold Master'    }
  return           { rank: 'Gold Master',           xpGoal: 6000, nextRank: 'Elite Garage'   }
}

export function StatsPage() {
  const { user }    = useAuthStore()
  const { vehicles } = useVehicles()
  const { selectedVehicleId } = useVehicleStore()
  const vehicle = vehicles.find(v => v.id === selectedVehicleId) ?? vehicles[0] ?? null
  const { maintenances, isLoading } = useMaintenances(vehicle?.id)

  /* ── Derived stats ───────────────────────────────────────────────────── */
  const today     = new Date().toISOString().split('T')[0]
  const completed = useMemo(() => maintenances.filter(m => m.date.slice(0, 10) <= today), [maintenances, today])
  const scheduled = useMemo(() => maintenances.filter(m => m.date.slice(0, 10) >  today), [maintenances, today])
  const totalCost = useMemo(() => completed.reduce((s, m) => s + (m.price ?? 0), 0), [completed])

  // XP: 200 por serviço concluído + 1 ponto por R$ gasto
  const xp = useMemo(() => completed.length * 200 + Math.floor(totalCost), [completed, totalCost])
  const { rank, xpGoal, nextRank } = computeRank(xp)

  // Gráfico: últimos 6 meses (apenas concluídas)
  const chartData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const d     = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const label = d.toLocaleDateString('pt-BR', { month: 'short' })
                     .replace('.', '')
                     .replace(/^\w/, c => c.toUpperCase())
      const value = completed
        .filter(m => {
          const md = new Date(m.date)
          return md.getMonth() === d.getMonth() && md.getFullYear() === d.getFullYear()
        })
        .reduce((s, m) => s + (m.price ?? 0), 0)
      return { month: label, value }
    })
  }, [completed])

  const chartTotal = useMemo(() => chartData.reduce((s, d) => s + d.value, 0), [chartData])

  // Km desde último serviço concluído
  const lastServiceKm = useMemo(() => {
    const sorted = [...completed].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return sorted[0]?.km ?? null
  }, [completed])

  const kmSinceService = vehicle && lastServiceKm != null
    ? Math.max(0, vehicle.odometer - lastServiceKm)
    : null

  // Badges baseados em dados reais
  const badges = useMemo(() => [
    {
      emoji: '⚡',
      title: 'Aprendiz Rápido',
      description: 'Primeiro registro feito',
      unlocked: completed.length >= 1,
    },
    {
      emoji: '📅',
      title: 'Planejador Pontual',
      description: '1 manutenção agendada',
      unlocked: scheduled.length >= 1,
    },
    {
      emoji: '🛡️',
      title: 'Piloto Confiável',
      description: '10.000 km rodados',
      unlocked: (vehicle?.odometer ?? 0) >= 10000,
    },
    {
      emoji: '🌿',
      title: 'Eco Optimizer',
      description: '3 serviços realizados',
      unlocked: completed.length >= 3,
    },
    {
      emoji: '🏆',
      title: 'Mecânico Elite',
      description: '10 serviços realizados',
      unlocked: completed.length >= 10,
    },
    {
      emoji: '💎',
      title: 'Master Garage',
      description: '50 manutenções',
      unlocked: completed.length >= 50,
    },
  ], [completed, scheduled, vehicle])

  const unlockedCount = badges.filter(b => b.unlocked).length

  const metrics = [
    {
      id: 'health',
      icon: <HeartIcon />,
      label: 'Health Score',
      value: vehicle ? `${vehicle.healthScore}` : '—',
      unit: '%',
      accentColor: '#3fff8b',
    },
    {
      id: 'km',
      icon: <RouteIcon />,
      label: 'Km desde último serviço',
      value: kmSinceService != null ? kmSinceService.toLocaleString('pt-BR') : '—',
      unit: 'km',
      accentColor: '#6e9bff',
    },
    {
      id: 'services',
      icon: <WrenchIcon />,
      label: 'Serviços realizados',
      value: `${completed.length}`,
      unit: 'total',
      accentColor: '#7ae6ff',
    },
    {
      id: 'investment',
      icon: <MoneyIcon />,
      label: 'Investimento total',
      value: totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      accentColor: '#3fff8b',
    },
  ]

  if (isLoading) {
    return (
      <AppLayout>
        <div className="page-content">
          <header>
            <h1 className="font-display font-bold text-2xl text-on-surface">Estatísticas</h1>
          </header>
          {[220, 200, 140, 120].map((h, i) => (
            <div key={i} className="rounded-[1.75rem] animate-pulse"
              style={{ height: h, background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="page-content">

        <header>
          <h1 className="font-display font-bold text-2xl text-on-surface">Estatísticas</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Desempenho e conquistas do seu veículo
          </p>
        </header>

        <RankCard
          name={user?.name ?? 'Piloto'}
          rank={rank}
          xp={xp}
          xpGoal={xpGoal}
          nextRank={nextRank}
        />

        <CostChart data={chartData} total={chartTotal} />

        <section className="flex flex-col gap-3">
          <p className="section-label px-1">Indicadores</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {metrics.map(m => <MetricCard key={m.id} {...m} />)}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <p className="section-label">Conquistas</p>
            <span className="text-xs font-bold text-primary">
              {unlockedCount}/{badges.length}
            </span>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {badges.map((b, i) => <BadgeCard key={i} {...b} />)}
          </div>
        </section>

      </div>
    </AppLayout>
  )
}

function HeartIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> }
function RouteIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg> }
function MoneyIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function WrenchIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> }
