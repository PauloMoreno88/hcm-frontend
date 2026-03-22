interface BadgeCardProps {
  emoji: string
  title: string
  description: string
  unlocked: boolean
}

export function BadgeCard({ emoji, title, description, unlocked }: BadgeCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-3 p-4 rounded-[1.5rem] text-center transition-all duration-200"
      style={{
        background: unlocked ? 'rgba(63,255,139,0.06)' : '#1a1a1a',
        border: unlocked
          ? '1px solid rgba(63,255,139,0.15)'
          : '1px solid rgba(72,72,71,0.15)',
        opacity: unlocked ? 1 : 0.5,
      }}
    >
      {/* Ícone */}
      <div
        className="w-12 h-12 rounded-[1rem] flex items-center justify-center text-2xl relative"
        style={{
          background: unlocked
            ? 'rgba(63,255,139,0.12)'
            : 'rgba(255,255,255,0.04)',
        }}
      >
        {unlocked ? emoji : '🔒'}
        {unlocked && (
          <div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: '#3fff8b' }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#005d2c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Texto */}
      <div>
        <p
          className="font-display font-bold text-xs leading-tight"
          style={{ color: unlocked ? '#ffffff' : '#adaaaa' }}
        >
          {title}
        </p>
        <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
