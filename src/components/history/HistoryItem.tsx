interface HistoryItemProps {
  icon: React.ReactNode
  title: string
  date: string
  location?: string
  cost: number
  odometer?: string
  notes?: string
  isScheduled?: boolean
  onEdit?:   () => void
  onDelete?: () => void
}

export function HistoryItem({
  icon,
  title,
  date,
  location,
  cost,
  odometer,
  notes,
  isScheduled,
  onEdit,
  onDelete,
}: HistoryItemProps) {
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
            <h3 className="font-display font-semibold text-sm text-on-surface">
              {title}
            </h3>
            <p className="text-on-surface-variant text-xs mt-0.5">
              {date}
              {location && (
                <span className="opacity-60"> · {location}</span>
              )}
            </p>
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
