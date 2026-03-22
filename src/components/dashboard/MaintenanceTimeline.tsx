interface TimelineItem {
  id:          string
  title:       string
  date:        string
  value:       string
  isEstimate?: boolean
  isScheduled?: boolean
}

export function MaintenanceTimeline({
  items,
  onViewAll,
  onAdd,
}: {
  items:      TimelineItem[]
  onViewAll?: () => void
  onAdd?:     () => void
}) {
  return (
    <div className="card flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-base text-on-surface">
          Histórico recente
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-primary hover:brightness-110 transition-all cursor-pointer"
        >
          Ver tudo
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="text-sm text-on-surface-variant">Nenhum registro ainda</p>
          <button
            onClick={onAdd}
            className="h-9 px-5 rounded-full text-xs font-semibold cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)', color: '#005d2c' }}
          >
            Adicionar manutenção
          </button>
        </div>
      )}

      {/* Items */}
      <div>
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-3">
            {/* Thread */}
            <div className="flex flex-col items-center">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                style={{
                  background: item.isScheduled
                    ? 'transparent'
                    : 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)',
                  border: item.isScheduled ? '2px solid #484847' : 'none',
                  boxShadow: item.isScheduled ? 'none' : '0 0 6px rgba(63,255,139,0.35)',
                }}
              />
              {index < items.length - 1 && (
                <div
                  className="w-px flex-1 min-h-[28px] mt-1"
                  style={{ background: 'rgba(72,72,71,0.35)' }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex items-start justify-between flex-1 pb-4">
              <div>
                <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{item.date}</p>
              </div>
              <div className="text-right ml-3 flex-shrink-0">
                <p
                  className="text-sm font-bold"
                  style={{ color: item.isScheduled ? '#6e9bff' : '#3fff8b' }}
                >
                  {item.value}
                </p>
                {item.isEstimate && (
                  <p className="text-[10px] text-on-surface-variant">estimado</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
