import { useState } from 'react'
import { ListChecks, Pencil, Trash2, Archive, ArchiveRestore } from 'lucide-react'
import { useHabitStore, getActiveHabits, getArchivedHabits } from '@/stores/habitStore'
import { DAY_LABELS } from '@/utils/constants'
import type { Habit } from '@/types'

type Filter = 'all' | 'active' | 'archived'

interface AllHabitsViewProps {
  onEditHabit: (habit: Habit) => void
}

function formatFrequency(habit: Habit): string {
  if (habit.frequency === 'daily') return 'Every day'
  return habit.targetDays.map((d) => DAY_LABELS[d]).join(', ')
}

export default function AllHabitsView({ onEditHabit }: AllHabitsViewProps) {
  const habits = useHabitStore((s) => s.habits)
  const deleteHabit = useHabitStore((s) => s.deleteHabit)
  const archiveHabit = useHabitStore((s) => s.archiveHabit)
  const unarchiveHabit = useHabitStore((s) => s.unarchiveHabit)
  const [filter, setFilter] = useState<Filter>('all')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const active = getActiveHabits(habits)
  const archived = getArchivedHabits(habits)

  const filtered =
    filter === 'active'
      ? active
      : filter === 'archived'
        ? archived
        : [...active, ...archived]

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4">
          <ListChecks size={36} className="text-indigo-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          No habits yet
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs">
          Create habits from the Today tab to see them here.
        </p>
      </div>
    )
  }

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: habits.length },
    { key: 'active', label: 'Active', count: active.length },
    { key: 'archived', label: 'Archived', count: archived.length },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              filter === key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            No {filter === 'archived' ? 'archived' : 'active'} habits
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((habit) => (
            <div
              key={habit.id}
              className={`flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 ${
                habit.archived ? 'opacity-60' : ''
              }`}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${habit.color}15`, border: `2px solid ${habit.color}40` }}
              >
                <span className="text-lg">{habit.emoji}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {habit.name}
                  </p>
                  {habit.archived && (
                    <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400">
                      Archived
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    {formatFrequency(habit)}
                  </span>
                  <span className="text-xs text-gray-300 dark:text-slate-600">|</span>
                  <span className="text-xs text-gray-400 dark:text-slate-500">
                    {habit.category}
                  </span>
                </div>
              </div>

              {confirmDeleteId === habit.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      deleteHabit(habit.id)
                      setConfirmDeleteId(null)
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditHabit(habit)}
                    className="p-2 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() =>
                      habit.archived
                        ? unarchiveHabit(habit.id)
                        : archiveHabit(habit.id)
                    }
                    className="p-2 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title={habit.archived ? 'Unarchive' : 'Archive'}
                  >
                    {habit.archived ? (
                      <ArchiveRestore size={16} />
                    ) : (
                      <Archive size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(habit.id)}
                    className="p-2 rounded-lg text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
