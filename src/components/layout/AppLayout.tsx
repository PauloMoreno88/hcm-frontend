import { type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

export function AppLayout({ children, hideBottomNav = false }: { children: ReactNode; hideBottomNav?: boolean }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      {/* lg:ml-60 matches sidebar w-60 (240px) */}
      <main className={`lg:ml-60 min-h-screen ${hideBottomNav ? 'pb-6' : 'pb-[80px]'} lg:pb-0`}>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}
