import { Sun, Moon, Plus, Settings, Clock } from 'lucide-react'
import { useState } from 'react'
import { useHabitStore } from '@/stores/habitStore'
import Button from '@/components/ui/Button'
import type { TimeFormat } from '@/types'

interface HeaderProps {
  onAddHabit: () => void
}

export default function Header({ onAddHabit }: HeaderProps) {
  const theme = useHabitStore((s) => s.theme)
  const toggleTheme = useHabitStore((s) => s.toggleTheme)
  const timeFormat = useHabitStore((s) => s.timeFormat)
  const setTimeFormat = useHabitStore((s) => s.setTimeFormat)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <header className="flex items-center justify-between py-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Habit Tracker
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          {showSettings && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSettings(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 w-56 py-2 rounded-xl bg-white dark:bg-slate-700 shadow-xl border border-gray-200 dark:border-slate-600">
                <div className="px-3 py-2">
                  <p className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">
                    <Clock size={14} /> Time Format
                  </p>
                  <div className="flex gap-1">
                    {(['12h', '24h'] as TimeFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setTimeFormat(fmt)}
                        className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          timeFormat === fmt
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-500'
                        }`}
                      >
                        {fmt === '12h' ? '12 Hour' : '24 Hour'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <Button onClick={onAddHabit} size="sm">
          <Plus size={18} />
          <span className="hidden sm:inline">Add Habit</span>
        </Button>
      </div>
    </header>
  )
}
