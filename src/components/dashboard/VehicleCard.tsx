import { HealthRing } from './HealthRing'

interface VehicleCardProps {
  name:               string
  model:              string
  healthScore:        number
  status:             string
  statusOk:           boolean
  healthScoreEnabled: boolean
  onEdit?:            () => void
}

function getAlert(score: number): { message: string; color: string } {
  if (score >= 80) return {
    message: 'Nenhum alerta crítico. Todos os sistemas dentro dos parâmetros ideais.',
    color: '#3fff8b',
  }
  if (score >= 60) return {
    message: 'Algumas manutenções podem estar próximas do prazo. Fique de olho no histórico.',
    color: '#f5a623',
  }
  if (score >= 40) return {
    message: 'Atenção: uma ou mais manutenções estão atrasadas. Agende um serviço em breve.',
    color: '#f5a623',
  }
  return {
    message: 'Manutenção urgente necessária. Verifique o histórico e agende um serviço imediatamente.',
    color: '#ff716c',
  }
}

export function VehicleCard({ name, model, healthScore, status, statusOk, healthScoreEnabled, onEdit }: VehicleCardProps) {
  const statusColor = statusOk ? '#3fff8b' : '#ff716c'
  const alert       = getAlert(healthScore)

  return (
    <div className="relative card-hero overflow-hidden">
      {/* Edit button */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/[0.08] cursor-pointer z-10"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          aria-label="Editar veículo"
        >
          <EditIcon />
        </button>
      )}

      {/* Ambient glow */}
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(63,255,139,0.07) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {/* Status badge */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 w-fit text-xs font-semibold"
            style={{
              background: `${statusColor}18`,
              color: statusColor,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
            {status}
          </span>

          {/* Vehicle name */}
          <div>
            <p className="section-label mb-0.5">Seu veículo</p>
            <h2 className="font-display font-bold text-2xl text-on-surface leading-tight">
              {name}
            </h2>
            <p className="text-sm text-on-surface-variant mt-0.5">{model}</p>
          </div>

          {/* Alert */}
          {healthScoreEnabled && (
            <div
              className="flex items-start gap-2 rounded-2xl p-3"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <ShieldIcon color={alert.color} className="flex-shrink-0 mt-px" />
              <p className="text-xs leading-relaxed" style={{ color: alert.color }}>
                {alert.message}
              </p>
            </div>
          )}
        </div>

        {/* Health ring */}
        {healthScoreEnabled && (
          <div className="flex-shrink-0">
            <HealthRing score={healthScore} size={140} strokeWidth={10} />
          </div>
        )}
      </div>
    </div>
  )
}

function EditIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}

function ShieldIcon({ className, color = '#3fff8b' }: { className?: string; color?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
