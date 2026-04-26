import { useHabitStore } from '@/stores/habitStore'
import type { Habit } from '@/types'
import { formatTime, getToday } from '@/utils/date'
import {
  Archive,
  Check,
  Clock,
  Flame,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

interface HabitCardProps {
  habit: Habit
  date?: string
  streak?: number
  onEdit: (habit: Habit) => void
}

export default function HabitCard({
  habit,
  date,
  streak = 0,
  onEdit,
}: HabitCardProps) {
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion)
  const deleteHabit = useHabitStore((s) => s.deleteHabit)
  const archiveHabit = useHabitStore((s) => s.archiveHabit)
  const timeFormat = useHabitStore((s) => s.timeFormat)
  const [showMenu, setShowMenu] = useState(false)

  const dateKey = date ?? getToday()
  const isCompleted = useHabitStore(
    (s) => s.completions[dateKey]?.includes(habit.id) ?? false,
  )

  return (
    <div
      className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50'
          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900/50'
      }`}
    >
      <button
        onClick={() => toggleCompletion(habit.id, dateKey)}
        className='shrink-0 cursor-pointer'
      >
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
            isCompleted ? 'scale-95' : 'hover:scale-105'
          }`}
          style={{
            backgroundColor: isCompleted ? habit.color : `${habit.color}15`,
            border: isCompleted ? 'none' : `2px solid ${habit.color}40`,
          }}
        >
          {isCompleted ? (
            <Check size={20} className='text-white' strokeWidth={3} />
          ) : (
            <span className='text-lg'>{habit.emoji}</span>
          )}
        </div>
      </button>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <p
            className={`font-medium truncate transition-all duration-200 ${
              isCompleted
                ? 'line-through text-gray-400 dark:text-slate-500'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {habit.name}
          </p>
          {streak >= 3 && !isCompleted && (
            <span className='flex items-center gap-0.5 text-xs font-medium text-orange-500 dark:text-orange-400'>
              <Flame size={14} /> {streak}
            </span>
          )}
        </div>
        {habit.description && (
          <p className='text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5'>
            {habit.description}
          </p>
        )}
        {habit.reminderEnabled && (
          <p className='flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 mt-0.5'>
            <Clock size={12} />
            {formatTime(habit.reminderTime, timeFormat)}
          </p>
        )}
      </div>

      <div className='relative'>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className='p-1.5 rounded-lg text-gray-300 dark:text-slate-600 hover:text-gray-500 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer'
        >
          <MoreHorizontal size={18} />
        </button>

        {showMenu && (
          <>
            <div
              className='fixed inset-0 z-40'
              onClick={() => setShowMenu(false)}
            />
            <div className='absolute right-0 top-full mt-1 z-50 w-40 py-1 rounded-xl bg-white dark:bg-slate-700 shadow-xl border border-gray-200 dark:border-slate-600'>
              <button
                onClick={() => {
                  onEdit(habit)
                  setShowMenu(false)
                }}
                className='flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer'
              >
                <Pencil size={15} /> Edit
              </button>
              <button
                onClick={() => {
                  archiveHabit(habit.id)
                  setShowMenu(false)
                }}
                className='flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer'
              >
                <Archive size={15} /> Archive
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this habit and all its data?')) {
                    deleteHabit(habit.id)
                  }
                  setShowMenu(false)
                }}
                className='flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer'
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
