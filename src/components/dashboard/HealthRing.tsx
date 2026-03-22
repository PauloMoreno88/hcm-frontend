interface HealthRingProps {
  score: number        // 0–100
  size?: number        // px, default 160
  strokeWidth?: number // default 12
}

export function HealthRing({ score, size = 160, strokeWidth = 12 }: HealthRingProps) {
  const r = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - score / 100)

  // Cor baseada no score
  const color =
    score >= 80 ? '#3fff8b' :
    score >= 50 ? '#6e9bff' :
    '#ff716c'

  const glowColor =
    score >= 80 ? 'rgba(63,255,139,0.35)' :
    score >= 50 ? 'rgba(110,155,255,0.35)' :
    'rgba(255,113,108,0.35)'

  const filterId = `ring-glow-${score}`

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        overflow="visible"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={color} floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`ring-grad-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={score >= 80 ? '#13ea79' : color} />
          </linearGradient>
        </defs>

        {/* Track (trilha) */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={`url(#ring-grad-${score})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.8s ease',
            filter: `drop-shadow(0 0 10px ${glowColor})`,
          }}
        />
      </svg>

      {/* Texto central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span
          className="font-display font-extrabold leading-none"
          style={{ fontSize: size * 0.22, color }}
        >
          {score}%
        </span>
        <span className="text-on-surface-variant text-[11px] font-medium">
          Health Score
        </span>
      </div>
    </div>
  )
}
