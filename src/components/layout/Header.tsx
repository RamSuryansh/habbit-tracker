import { Sun, Moon, Plus } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import Button from '@/components/ui/Button'

interface HeaderProps {
  onAddHabit: () => void
}

export default function Header({ onAddHabit }: HeaderProps) {
  const theme = useHabitStore((s) => s.theme)
  const toggleTheme = useHabitStore((s) => s.toggleTheme)

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
        <Button onClick={onAddHabit} size="sm">
          <Plus size={18} />
          <span className="hidden sm:inline">Add Habit</span>
        </Button>
      </div>
    </header>
  )
}
