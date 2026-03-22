import { Button } from '../ui/Button'

interface NextMaintenanceProps {
  title:        string
  description:  string
  kmRemaining?: number
  onBook?:      () => void
}

export function NextMaintenance({ title, description, kmRemaining, onBook }: NextMaintenanceProps) {
  const progress = kmRemaining != null
    ? Math.max(0, Math.min(100, ((1000 - kmRemaining) / 1000) * 100))
    : null

  return (
    <div className="card flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,113,108,0.12)' }}
        >
          <WrenchIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-label mb-0.5">Próxima manutenção</p>
          <h3 className="font-display font-semibold text-base text-on-surface">{title}</h3>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Progress — só exibe quando há kmRemaining */}
      {progress != null && kmRemaining != null && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span className="text-xs text-on-surface-variant">Restam</span>
            <span className="text-xs font-bold text-error">
              {kmRemaining.toLocaleString('pt-BR')} km
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3fff8b 0%, #13ea79 100%)',
                boxShadow: '0 0 6px rgba(63,255,139,0.35)',
                transition: 'width 0.7s ease',
              }}
            />
          </div>
        </div>
      )}

      <Button size="sm" onClick={onBook} fullWidth>
        Agendar serviço
      </Button>
    </div>
  )
}

function WrenchIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ff716c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
}
