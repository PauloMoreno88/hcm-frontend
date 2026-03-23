import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { HistoryItem } from '../components/history/HistoryItem'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { Button } from '../components/ui/Button'
import { useVehicles } from '../hooks/useVehicles'
import { useMaintenances } from '../hooks/useMaintenances'
import { useVehicleStore } from '../store/vehicleStore'
import type { Maintenance } from '../types/api.types'

const FILTERS: { label: string; value: string }[] = [
  { label: 'Todos',         value: 'all' },
  { label: 'Agendadas',     value: 'scheduled' },
  { label: 'Troca de Óleo', value: 'Troca de Óleo' },
  { label: 'Freios',        value: 'Freios' },
  { label: 'Pneus',         value: 'Pneus' },
  { label: 'Motor',         value: 'Motor' },
  { label: 'Transmissão',   value: 'Transmissão' },
  { label: 'Outros',        value: 'Outros' },
]

export function HistoryPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const validFilters = FILTERS.map(f => f.value)
  const initialFilter = searchParams.get('filter') ?? 'all'
  const [filter, setFilter] = useState<string>(validFilters.includes(initialFilter) ? initialFilter : 'all')
  const [search, setSearch] = useState('')

  const { vehicles, isLoading: loadingVehicles } = useVehicles()
  const { selectedVehicleId } = useVehicleStore()
  const vehicle = vehicles.find(v => v.id === selectedVehicleId) ?? vehicles[0] ?? null
  const { maintenances, isLoading: loadingMaintenances, isRemoving, remove } = useMaintenances(vehicle?.id)
  const isLoading = loadingVehicles || loadingMaintenances

  const [deleteTarget, setDeleteTarget] = useState<Maintenance | null>(null)

  /* ── Derived values ─────────────────────────────────────────────────── */
  const today = new Date().toISOString().split('T')[0]

  const totalInvestment = useMemo(
    () => maintenances
      .filter(m => m.date.slice(0, 10) <= today)
      .reduce((s, m) => s + (m.price ?? 0), 0),
    [maintenances, today],
  )

  const filtered = useMemo(() => {
    let list = maintenances
    if (filter === 'scheduled') {
      list = list.filter(m => m.date.slice(0, 10) > today)
    } else {
      list = list.filter(m => m.date.slice(0, 10) <= today)
      if (filter !== 'all') list = list.filter(m => m.type === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.type.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q),
      )
    }
    return list
  }, [maintenances, filter, search, today])

  /* ── Group by month/year ─────────────────────────────────────────────── */
  const groups = useMemo(() => {
    const map = new Map<string, Maintenance[]>()
    for (const m of filtered) {
      const key = new Date(m.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      const capitalised = key.charAt(0).toUpperCase() + key.slice(1)
      if (!map.has(capitalised)) map.set(capitalised, [])
      map.get(capitalised)!.push(m)
    }
    return Array.from(map.entries()).map(([period, items]) => ({ period, items }))
  }, [filtered])

  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen">

        {/* Sticky header */}
        <header
          className="sticky top-0 z-20"
          style={{
            background: 'rgba(14,14,14,0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(72,72,71,0.10)',
          }}
        >
          <div className="page-padding w-full pt-6 pb-4 flex flex-col gap-4">

            {/* Title row */}
            <div className="flex items-center justify-between">
              <h1 className="font-display font-bold text-2xl text-on-surface">Histórico</h1>
              <Button size="sm" onClick={() => navigate('/add-maintenance')}>
                <PlusIcon /> Adicionar
              </Button>
            </div>

            {/* Summary chips */}
            <div className="grid grid-cols-2 gap-3">
              <SummaryChip
                label="Investimento total"
                value={totalInvestment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                color="#3fff8b"
              />
              <SummaryChip
                label="Odômetro atual"
                value={vehicle ? `${vehicle.odometer.toLocaleString('pt-BR')} km` : '—'}
                color="#6e9bff"
              />
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-3 h-11 px-4 rounded-full"
              style={{ background: '#1a1a1a' }}
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar manutenções..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
                style={{ caretColor: '#3fff8b' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-on-surface-variant cursor-pointer">
                  <CloseIcon />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className="flex-shrink-0 h-8 px-4 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer"
                  style={filter === f.value
                    ? { background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)', color: '#005d2c' }
                    : { background: '#1a1a1a', color: '#adaaaa' }
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* List */}
        <div className="page-padding w-full pt-6 pb-8 flex flex-col gap-6">
          {isLoading ? (
            <SkeletonList />
          ) : groups.length === 0 ? (
            <EmptyState onAdd={() => navigate('/add-maintenance')} />
          ) : (
            groups.map(group => (
              <section key={group.period}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="section-label">{group.period}</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(72,72,71,0.20)' }} />
                </div>
                {group.items.map(item => (
                  <HistoryItem
                    key={item.id}
                    icon={<TypeIcon type={item.type} />}
                    title={item.type}
                    date={new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    cost={item.price ?? 0}
                    odometer={item.km ? `${item.km.toLocaleString('pt-BR')} km` : undefined}
                    notes={item.description}
                    isScheduled={item.date.slice(0, 10) > today}
                    onEdit={() => navigate(`/edit-maintenance/${item.id}`)}
                    onDelete={() => setDeleteTarget(item)}
                  />
                ))}
              </section>
            ))
          )}
        </div>

      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Excluir manutenção"
        description={`Tem certeza que deseja excluir "${deleteTarget?.type}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={isRemoving}
        onConfirm={async () => {
          if (!deleteTarget) return
          await remove(deleteTarget.id)
          setDeleteTarget(null)
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  )
}

/* ── Sub-components ────────────────────────────────────────────────────────── */
function SummaryChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card py-3">
      <p className="section-label mb-1">{label}</p>
      <p className="font-display font-bold text-base" style={{ color }}>{value}</p>
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-4">
      {[180, 140, 160].map((h, i) => (
        <div
          key={i}
          className="rounded-[1.75rem] animate-pulse"
          style={{ height: h, background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)', backgroundSize: '200% 100%' }}
        />
      ))}
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="card-hero flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div
        className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center"
        style={{ background: 'rgba(63,255,139,0.10)' }}
      >
        <WrenchIcon />
      </div>
      <div>
        <p className="font-display font-bold text-lg text-on-surface">Nenhuma manutenção</p>
        <p className="text-sm text-on-surface-variant mt-1">Registre o primeiro serviço do veículo</p>
      </div>
      <button
        onClick={onAdd}
        className="h-10 px-6 rounded-full text-sm font-semibold text-on-primary cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)' }}
      >
        Adicionar manutenção
      </button>
    </div>
  )
}

function TypeIcon({ type }: { type: string }) {
  const size = 17
  switch (type) {
    case 'Troca de Óleo': return <OilIcon size={size} />
    case 'Freios':        return <BrakeIcon size={size} />
    case 'Pneus':         return <TireIcon size={size} />
    case 'Motor':         return <EngineIcon size={size} />
    case 'Transmissão':   return <TransmIcon size={size} />
    default:              return <OtherIcon size={size} />
  }
}

/* ── Icons ─────────────────────────────────────────────────────────────────── */
function OilIcon({ size = 17 })   { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v6l2 2-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6l-2-2 2-2V2"/><line x1="6" y1="12" x2="18" y2="12"/></svg> }
function BrakeIcon({ size = 17 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> }
function TireIcon({ size = 17 })  { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg> }
function EngineIcon({ size = 17 }){ return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 8V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3"/><path d="M14 8V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3"/></svg> }
function TransmIcon({ size = 17 }){ return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><line x1="7" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="17" y2="12"/><line x1="12" y1="7" x2="12" y2="10"/><line x1="12" y1="14" x2="12" y2="17"/></svg> }
function OtherIcon({ size = 17 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg> }
function WrenchIcon()             { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3fff8b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> }
function SearchIcon()             { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function CloseIcon()              { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function PlusIcon()               { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
