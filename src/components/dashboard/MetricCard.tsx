import { type ReactNode } from 'react'

interface MetricCardProps {
  icon:           ReactNode
  label:          string
  value:          string
  unit?:          string
  subtitle?:      string
  badge?:         string
  badgePositive?: boolean
  accentColor?:   string
  onClick?:       () => void
}

export function MetricCard({
  icon,
  label,
  value,
  unit,
  subtitle,
  badge,
  badgePositive = true,
  accentColor   = '#3fff8b',
  onClick,
}: MetricCardProps) {
  return (
    <div
      className={`card flex flex-col gap-4 hover:-translate-y-0.5 transition-transform duration-200${onClick ? ' cursor-pointer active:scale-95' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
    >
      {/* Icon row */}
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accentColor}15` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>

        {badge && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: badgePositive ? 'rgba(63,255,139,0.12)' : 'rgba(255,113,108,0.12)',
              color:      badgePositive ? '#3fff8b'                 : '#ff716c',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-bold text-xl text-on-surface">{value}</span>
          {unit && (
            <span className="text-xs text-on-surface-variant">{unit}</span>
          )}
        </div>
        <p className="text-xs text-on-surface-variant mt-0.5">{label}</p>
        {subtitle && (
          <p className="text-xs font-medium mt-0.5" style={{ color: accentColor }}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}
