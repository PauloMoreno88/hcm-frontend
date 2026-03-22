interface MonthData {
  month: string
  value: number
}

interface CostChartProps {
  data: MonthData[]
  total: number
}

export function CostChart({ data, total }: CostChartProps) {
  const max = Math.max(...data.map((d) => d.value))

  return (
    <div
      className="rounded-[1.75rem] p-5 flex flex-col gap-5"
      style={{ background: '#1a1a1a', boxShadow: '0 8px 24px rgba(0,0,0,0.30)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-0.5">
            Custo com manutenções
          </p>
          <p className="font-display font-bold text-2xl text-on-surface">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">Últimos 6 meses</p>
        </div>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: 'rgba(63,255,139,0.12)', color: '#3fff8b' }}
        >
          YTD
        </span>
      </div>

      {/* Barras */}
      <div className="flex items-end gap-2 h-28">
        {data.map((d, i) => {
          const heightPct = max > 0 ? (d.value / max) * 100 : 0
          const isHighest = d.value === max

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end" style={{ height: 88 }}>
                <div
                  className="w-full rounded-xl"
                  style={{
                    height: `${Math.max(heightPct, 8)}%`,
                    background: isHighest
                      ? 'linear-gradient(180deg, #3fff8b 0%, #13ea79 100%)'
                      : 'rgba(63,255,139,0.18)',
                    boxShadow: isHighest
                      ? '0 0 12px rgba(63,255,139,0.35)'
                      : 'none',
                    transition: 'height 0.6s ease',
                  }}
                />
              </div>
              <span className="text-[10px] text-on-surface-variant">{d.month}</span>
            </div>
          )
        })}
      </div>

      {/* Linha de grid sutil */}
      <div className="flex justify-between text-[10px] text-on-surface-variant/40">
        <span>R$ 0</span>
        <span>R$ {(max / 2).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
        <span>R$ {max.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
      </div>
    </div>
  )
}
