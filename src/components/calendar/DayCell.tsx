import { useHabitStore, getHabitsForDay } from '@/stores/habitStore'
import { getDateKey, isToday } from '@/utils/date'
import { isSameMonth } from 'date-fns'

interface DayCellProps {
  date: Date
  currentMonth: Date
  onSelect: (date: Date) => void
  selected: boolean
}

export default function DayCell({ date, currentMonth, onSelect, selected }: DayCellProps) {
  const habits = useHabitStore((s) => s.habits)
  const completions = useHabitStore((s) => s.completions)

  const inMonth = isSameMonth(date, currentMonth)
  const today = isToday(date)
  const dateKey = getDateKey(date)
  const dayHabits = getHabitsForDay(habits, date.getDay())
  const dayCompletions = completions[dateKey] ?? []
  const completedCount = dayHabits.filter((h) =>
    dayCompletions.includes(h.id),
  ).length
  const total = dayHabits.length
  const ratio = total > 0 ? completedCount / total : -1

  let bgClass = ''
  if (ratio === 1) bgClass = 'bg-green-500/20 dark:bg-green-500/15'
  else if (ratio >= 0.5) bgClass = 'bg-green-500/10 dark:bg-green-500/8'
  else if (ratio > 0) bgClass = 'bg-green-500/5 dark:bg-green-500/5'

  return (
    <button
      onClick={() => onSelect(date)}
      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all cursor-pointer ${
        !inMonth
          ? 'text-gray-300 dark:text-slate-700'
          : today
            ? 'font-bold text-indigo-600 dark:text-indigo-400'
            : 'text-gray-700 dark:text-gray-300'
      } ${
        selected
          ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
          : ''
      } ${inMonth ? bgClass : ''} hover:bg-gray-100 dark:hover:bg-slate-800`}
    >
      <span>{date.getDate()}</span>
      {inMonth && total > 0 && (
        <div className="flex gap-0.5 mt-0.5">
          {ratio === 1 && (
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          )}
          {ratio > 0 && ratio < 1 && (
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          )}
          {ratio === 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-600" />
          )}
        </div>
      )}
    </button>
  )
}
