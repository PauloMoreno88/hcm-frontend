interface RankCardProps {
  name: string
  rank: string
  xp: number
  xpGoal: number
  nextRank: string
}

export function RankCard({ name, rank, xp, xpGoal, nextRank }: RankCardProps) {
  const progress = Math.min(100, (xp / xpGoal) * 100)

  return (
    <div
      className="relative rounded-[2rem] p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #1a1a1a 0%, #131313 100%)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.40)',
      }}
    >
      {/* Glow */}
      <div
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(63,255,139,0.07) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-5">
        {/* Avatar / rank icon */}
        <div
          className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center flex-shrink-0 text-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(63,255,139,0.15) 0%, rgba(19,234,121,0.08) 100%)',
            boxShadow: '0 0 20px rgba(63,255,139,0.15)',
          }}
        >
          🏅
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-on-surface-variant text-xs uppercase tracking-wider mb-0.5">
            {name}
          </p>
          <h2 className="font-display font-bold text-xl text-on-surface">{rank}</h2>

          {/* XP bar */}
          <div className="mt-3 flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-on-surface-variant">
                {xp.toLocaleString('pt-BR')} XP
              </span>
              <span className="text-xs font-semibold text-primary">
                {xpGoal.toLocaleString('pt-BR')} XP → {nextRank}
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #3fff8b 0%, #13ea79 100%)',
                  boxShadow: '0 0 8px rgba(63,255,139,0.50)',
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
