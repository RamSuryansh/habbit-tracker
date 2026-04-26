import ProgressRing from '@/components/ui/ProgressRing'
import { useHabitStats } from '@/hooks/useHabitStats'
import { getHabitsForDay, useHabitStore } from '@/stores/habitStore'
import type { Habit } from '@/types'
import { Target } from 'lucide-react'
import HabitCard from './HabitCard'

interface HabitListProps {
  onEditHabit: (habit: Habit) => void
  onAddHabit: () => void
}

export default function HabitList({ onEditHabit, onAddHabit }: HabitListProps) {
  const habits = useHabitStore((s) => s.habits)
  const stats = useHabitStats()
  const today = new Date()
  const todayHabits = getHabitsForDay(habits, today.getDay())

  const progress =
    stats.todayTotal > 0 ? stats.todayCompleted / stats.todayTotal : 0

  if (todayHabits.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <div className='w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4'>
          <Target size={36} className='text-indigo-500' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-1'>
          No habits yet
        </h3>
        <p className='text-sm text-gray-500 dark:text-slate-400 max-w-xs mb-6'>
          Start building better habits today. Add your first habit to get
          started.
        </p>
        <button
          onClick={onAddHabit}
          className='px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer'
        >
          Create your first habit
        </button>
      </div>
    )
  }

  const perHabitMap = new Map(stats.perHabit.map((p) => [p.habit.id, p]))

  return (
    <div>
      <div className='flex items-center gap-5 mb-6'>
        <ProgressRing progress={progress} size={80} strokeWidth={6}>
          <div className='text-center'>
            <p className='text-lg font-bold text-gray-900 dark:text-white leading-none'>
              {stats.todayCompleted}
            </p>
            <p className='text-[10px] text-gray-400 dark:text-slate-500'>
              of {stats.todayTotal}
            </p>
          </div>
        </ProgressRing>
        <div>
          <p className='text-sm font-medium text-gray-900 dark:text-white'>
            {progress === 1
              ? 'All done! Great job!'
              : progress >= 0.5
                ? 'Keep going, almost there!'
                : "Let's build those habits!"}
          </p>
          <p className='text-xs text-gray-500 dark:text-slate-400 mt-0.5'>
            {stats.todayTotal - stats.todayCompleted === 0
              ? 'You completed all habits today'
              : `${stats.todayTotal - stats.todayCompleted} habit${stats.todayTotal - stats.todayCompleted > 1 ? 's' : ''} remaining`}
          </p>
        </div>
      </div>

      <div className='space-y-3'>
        {todayHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            streak={perHabitMap.get(habit.id)?.currentStreak ?? 0}
            onEdit={onEditHabit}
          />
        ))}
      </div>
    </div>
  )
}
