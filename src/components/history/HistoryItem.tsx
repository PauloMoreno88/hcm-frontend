import { useState } from 'react'
import { StatusBadge, STATUS_CONFIG } from '../ui/StatusBadge'
import type { MaintenanceStatus } from '../../types/api.types'

interface HistoryItemProps {
  icon: React.ReactNode
  title: string
  date: string
  location?: string
  cost: number
  odometer?: string
  notes?: string
  status?: MaintenanceStatus
  isScheduled?: boolean
  isOverdue?: boolean
  onEdit?:         () => void
  onDelete?:       () => void
  onStatusChange?: (status: MaintenanceStatus) => void
}

export function HistoryItem({
  icon,
  title,
  date,
  location,
  cost,
  odometer,
  notes,
  status,
  isScheduled,
  isOverdue,
  onEdit,
  onDelete,
  onStatusChange,
}: HistoryItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const resolvedStatus: MaintenanceStatus = status ?? 'DONE'

  return (
    <div className="flex gap-4">
      {/* Thread + nó */}
      <div className="flex flex-col items-center pt-1">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isScheduled
              ? 'rgba(110,155,255,0.12)'
              : 'rgba(63,255,139,0.10)',
          }}
        >
          <span style={{ color: isScheduled ? '#6e9bff' : '#3fff8b' }}>
            {icon}
          </span>
        </div>
        {/* linha */}
        <div
          className="w-px flex-1 min-h-[24px] mt-2"
          style={{ background: 'rgba(72,72,71,0.30)' }}
        />
      </div>

      {/* Conteúdo */}
      <div
        className="flex-1 mb-4 rounded-[1.5rem] p-4"
        style={{ background: '#1a1a1a' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-sm text-on-surface">
                {title}
              </h3>
              {isOverdue && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
                  style={{ background: 'rgba(255,113,108,0.12)', color: '#ff716c' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#ff716c' }} />
                  Atrasada
                </span>
              )}
            </div>
            <p className="text-on-surface-variant text-xs mt-0.5">
              {date}
              {location && (
                <span className="opacity-60"> · {location}</span>
              )}
            </p>

            {/* Status badge + quick change */}
            <div className="relative mt-2 inline-block">
              <button
                onClick={() => onStatusChange ? setMenuOpen(o => !o) : undefined}
                className={onStatusChange ? 'cursor-pointer' : 'cursor-default'}
                aria-label="Alterar status"
              >
                <StatusBadge status={resolvedStatus} />
                {onStatusChange && (
                  <span className="ml-0.5 text-[9px] text-on-surface-variant opacity-50">▾</span>
                )}
              </button>

              {menuOpen && onStatusChange && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  {/* Dropdown */}
                  <div
                    className="absolute left-0 top-full mt-1 z-20 rounded-2xl overflow-hidden"
                    style={{ background: '#242424', minWidth: 148, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                  >
                    {(Object.entries(STATUS_CONFIG) as [MaintenanceStatus, typeof STATUS_CONFIG[MaintenanceStatus]][]).map(([value, cfg]) => (
                      <button
                        key={value}
                        onClick={() => { onStatusChange(value); setMenuOpen(false) }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/5 cursor-pointer"
                        style={{ color: resolvedStatus === value ? cfg.color : '#adaaaa' }}
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: cfg.color }}
                        />
                        {cfg.label}
                        {resolvedStatus === value && (
                          <span className="ml-auto" style={{ color: cfg.color }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {odometer && (
              <div className="flex items-center gap-1 mt-2">
                <OdometerIcon />
                <span className="text-xs text-on-surface-variant">{odometer}</span>
              </div>
            )}
            {notes && (
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed opacity-70">
                {notes}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span
              className="font-display font-bold text-base"
              style={{ color: isScheduled ? '#6e9bff' : '#3fff8b' }}
            >
              {cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            {isScheduled && (
              <p className="text-[10px] text-on-surface-variant">estimado</p>
            )}
            {(onEdit || onDelete) && (
              <div className="flex items-center gap-1.5">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer transition-colors hover:bg-white/[0.08]"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                    aria-label="Editar"
                  >
                    <EditIcon />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer transition-colors hover:bg-red-500/10"
                    style={{ background: 'rgba(255,113,108,0.08)' }}
                    aria-label="Excluir"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EditIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}
function TrashIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ff716c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
}
function OdometerIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#adaaaa"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="12" x2="15" y2="12" />
    </svg>
  )
}
