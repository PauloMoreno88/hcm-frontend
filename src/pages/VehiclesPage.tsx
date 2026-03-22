import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { Button } from '../components/ui/Button'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { useVehicles } from '../hooks/useVehicles'
import type { Vehicle } from '../types/api.types'

export function VehiclesPage() {
  const navigate = useNavigate()
  const { vehicles, isLoading, remove, isRemoving } = useVehicles()

  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null)

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await remove(pendingDelete.id)
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <AppLayout>
      <div className="page-content">

        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-on-surface">Veículos</h1>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Gerencie sua garagem
            </p>
          </div>
          <Button size="sm" onClick={() => navigate('/add-vehicle')}>
            <PlusIcon /> Adicionar
          </Button>
        </header>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[180, 180].map((h, i) => (
              <div key={i} className="rounded-[1.75rem] animate-pulse"
                style={{ height: h, background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)', backgroundSize: '200% 100%' }} />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <EmptyState onAdd={() => navigate('/add-vehicle')} />
        ) : (
          <div className="flex flex-col gap-3">
            {vehicles.map(v => (
              <VehicleListCard
                key={v.id}
                vehicle={v}
                onEdit={() => navigate(`/edit-vehicle/${v.id}`)}
                onDelete={() => setPendingDelete(v)}
              />
            ))}
          </div>
        )}

      </div>

      <ConfirmModal
        open={!!pendingDelete}
        title="Excluir veículo"
        description={
          pendingDelete
            ? `Tem certeza que deseja excluir "${pendingDelete.nickname}"? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Sim, excluir"
        isLoading={isRemoving}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AppLayout>
  )
}

/* ── Vehicle list card ───────────────────────────────────────────────────── */
function VehicleListCard({
  vehicle,
  onEdit,
  onDelete,
}: {
  vehicle:  Vehicle
  onEdit:   () => void
  onDelete: () => void
}) {
  const healthColor = vehicle.healthScore >= 80 ? '#3fff8b' : vehicle.healthScore >= 50 ? '#ffd460' : '#ff716c'

  return (
    <div className="card-hero flex items-center gap-4">
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-[1rem] flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(63,255,139,0.10)' }}
      >
        <CarIcon />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-base text-on-surface truncate">
          {vehicle.nickname}
        </p>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {vehicle.brand} {vehicle.model} · {vehicle.year}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-on-surface-variant">
            {vehicle.odometer.toLocaleString('pt-BR')} km
          </span>
          <span className="text-xs font-semibold" style={{ color: healthColor }}>
            Health {vehicle.healthScore}%
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onEdit}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/[0.06] cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.04)' }}
          aria-label="Editar veículo"
        >
          <EditIcon />
        </button>
        <button
          onClick={onDelete}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-red-500/10 cursor-pointer"
          style={{ background: 'rgba(255,113,108,0.06)' }}
          aria-label="Excluir veículo"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="card-hero flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div
        className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center"
        style={{ background: 'rgba(63,255,139,0.10)' }}
      >
        <CarIcon size={24} color="#3fff8b" />
      </div>
      <div>
        <p className="font-display font-bold text-lg text-on-surface">Nenhum veículo</p>
        <p className="text-sm text-on-surface-variant mt-1">Adicione seu primeiro veículo</p>
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

/* ── Icons ─────────────────────────────────────────────────────────────────── */
function CarIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5v-3l2-6h10l2 6v3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>
}
function EditIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}
function TrashIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff716c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
}
function PlusIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}
