import { CheckCircle2, Calendar, BarChart3 } from 'lucide-react'
import type { View } from '@/types'

interface NavigationProps {
  activeView: View
  onViewChange: (view: View) => void
}

const tabs: { view: View; label: string; icon: typeof CheckCircle2 }[] = [
  { view: 'today', label: 'Today', icon: CheckCircle2 },
  { view: 'calendar', label: 'Calendar', icon: Calendar },
  { view: 'stats', label: 'Stats', icon: BarChart3 },
]

export default function Navigation({ activeView, onViewChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 sm:static sm:border-t-0 sm:bg-transparent sm:dark:bg-transparent sm:backdrop-blur-none sm:mb-6">
      <div className="flex items-center justify-around sm:justify-start sm:gap-1 max-w-4xl mx-auto px-4 sm:px-0">
        {tabs.map(({ view, label, icon: Icon }) => {
          const active = activeView === view
          return (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 sm:py-2 px-4 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                active
                  ? 'text-indigo-600 dark:text-indigo-400 sm:bg-indigo-50 sm:dark:bg-indigo-500/10'
                  : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 sm:hover:bg-gray-50 sm:dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
