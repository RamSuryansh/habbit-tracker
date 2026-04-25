import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addMonths, subMonths, format, isSameDay } from 'date-fns'
import { getCalendarDays, getDateKey } from '@/utils/date'
import { useHabitStore, getHabitsForDay } from '@/stores/habitStore'
import { DAY_LABELS_SHORT } from '@/utils/constants'
import DayCell from './DayCell'
import HabitCard from '@/components/habits/HabitCard'
import type { Habit } from '@/types'

interface CalendarViewProps {
  onEditHabit: (habit: Habit) => void
}

export default function CalendarView({ onEditHabit }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const habits = useHabitStore((s) => s.habits)
  const completions = useHabitStore((s) => s.completions)

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const calendarDays = getCalendarDays(year, month)

  const dayCellData = useMemo(() => {
    return calendarDays.map((date) => {
      const dateKey = getDateKey(date)
      const dayHabits = getHabitsForDay(habits, date.getDay())
      const dayCompletions = completions[dateKey] ?? []
      const completedCount = dayHabits.filter((h) => dayCompletions.includes(h.id)).length
      return { completedCount, total: dayHabits.length }
    })
  }, [calendarDays, habits, completions])

  const selectedHabits = selectedDate
    ? getHabitsForDay(habits, selectedDate.getDay())
    : []

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 rounded-xl text-xs font-medium text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS_SHORT.map((label, i) => (
          <div
            key={i}
            className="text-center text-xs font-medium text-gray-400 dark:text-slate-500 py-2"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, i) => (
          <DayCell
            key={i}
            date={date}
            currentMonth={currentMonth}
            selected={selectedDate != null && isSameDay(date, selectedDate)}
            onSelect={setSelectedDate}
            completedCount={dayCellData[i].completedCount}
            total={dayCellData[i].total}
          />
        ))}
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-3">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          {selectedHabits.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">
              No habits scheduled for this day
            </p>
          ) : (
            <div className="space-y-2">
              {selectedHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  date={getDateKey(selectedDate)}
                  onEdit={onEditHabit}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
