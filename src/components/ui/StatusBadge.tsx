import type { MaintenanceStatus } from '../../types/api.types'

const CONFIG: Record<MaintenanceStatus, { label: string; color: string; bg: string }> = {
  TODO:        { label: 'A fazer',  color: '#adaaaa', bg: 'rgba(173,170,170,0.12)' },
  IN_PROGRESS: { label: 'Fazendo',  color: '#ffd460', bg: 'rgba(255,212,96,0.12)'  },
  DONE:        { label: 'Feito',    color: '#3fff8b', bg: 'rgba(63,255,139,0.10)'  },
}

interface StatusBadgeProps {
  status: MaintenanceStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color, bg } = CONFIG[status] ?? CONFIG.DONE
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: bg, color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      {label}
    </span>
  )
}

export { CONFIG as STATUS_CONFIG }
export type { MaintenanceStatus }
