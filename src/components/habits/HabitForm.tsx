/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/set-state-in-effect */
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { useHabitStore } from '@/stores/habitStore'
import type { Habit } from '@/types'
import { CATEGORIES, COLORS, DAY_LABELS, EMOJIS } from '@/utils/constants'
import { requestPermission } from '@/utils/notifications'
import { useEffect, useState } from 'react'

interface HabitFormProps {
  open: boolean
  onClose: () => void
  editingHabit?: Habit | null
}

const defaultForm: {
  name: string
  description: string
  emoji: string
  color: string
  category: string
  frequency: 'daily' | 'custom'
  targetDays: number[]
  reminderEnabled: boolean
  reminderTime: string
} = {
  name: '',
  description: '',
  emoji: '💪',
  color: COLORS[0],
  category: CATEGORIES[0],
  frequency: 'daily',
  targetDays: [0, 1, 2, 3, 4, 5, 6],
  reminderEnabled: false,
  reminderTime: '09:00',
}

export default function HabitForm({
  open,
  onClose,
  editingHabit,
}: HabitFormProps) {
  const addHabit = useHabitStore((s) => s.addHabit)
  const editHabit = useHabitStore((s) => s.editHabit)
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (editingHabit) {
      setForm({
        name: editingHabit.name,
        description: editingHabit.description,
        emoji: editingHabit.emoji,
        color: editingHabit.color,
        category: editingHabit.category,
        frequency: editingHabit.frequency,
        targetDays: editingHabit.targetDays,
        reminderEnabled: editingHabit.reminderEnabled,
        reminderTime: editingHabit.reminderTime,
      })
    } else {
      setForm(defaultForm)
    }
  }, [editingHabit, open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return

    if (editingHabit) {
      editHabit(editingHabit.id, form)
    } else {
      addHabit(form)
    }
    onClose()
  }

  function toggleDay(day: number) {
    setForm((f) => ({
      ...f,
      targetDays: f.targetDays.includes(day)
        ? f.targetDays.filter((d) => d !== day)
        : [...f.targetDays, day].sort(),
    }))
  }

  async function handleReminderToggle(): Promise<void> {
    const next = !form.reminderEnabled
    setForm((f) => ({ ...f, reminderEnabled: next }))
    if (next) await requestPermission()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingHabit ? 'Edit Habit' : 'New Habit'}
    >
      <form onSubmit={handleSubmit} className='space-y-5'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
            Name
          </label>
          <input
            type='text'
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder='e.g. Drink 8 glasses of water'
            className='w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow'
            autoFocus
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
            Description (optional)
          </label>
          <input
            type='text'
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder='Short description...'
            className='w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Emoji
          </label>
          <div className='flex flex-wrap gap-2'>
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type='button'
                onClick={() => setForm((f) => ({ ...f, emoji }))}
                className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                  form.emoji === emoji
                    ? 'bg-indigo-100 dark:bg-indigo-500/20 ring-2 ring-indigo-500 scale-110'
                    : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Color
          </label>
          <div className='flex gap-2'>
            {COLORS.map((color) => (
              <button
                key={color}
                type='button'
                onClick={() => setForm((f) => ({ ...f, color }))}
                className={`w-9 h-9 rounded-full transition-all cursor-pointer ${
                  form.color === color
                    ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 scale-110'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Category
          </label>
          <div className='flex flex-wrap gap-2'>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type='button'
                onClick={() => setForm((f) => ({ ...f, category: cat }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  form.category === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Schedule
          </label>
          <div className='flex gap-2 mb-3'>
            <button
              type='button'
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  frequency: 'daily',
                  targetDays: [0, 1, 2, 3, 4, 5, 6],
                }))
              }
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                form.frequency === 'daily'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Every day
            </button>
            <button
              type='button'
              onClick={() => setForm((f) => ({ ...f, frequency: 'custom' }))}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                form.frequency === 'custom'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Custom days
            </button>
          </div>
          {form.frequency === 'custom' && (
            <div className='flex gap-2'>
              {DAY_LABELS.map((label, i) => (
                <button
                  key={i}
                  type='button'
                  onClick={() => toggleDay(i)}
                  className={`w-10 h-10 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    form.targetDays.includes(i)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Daily Reminder
            </label>
            <button
              type='button'
              role='switch'
              aria-checked={form.reminderEnabled}
              onClick={handleReminderToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                form.reminderEnabled
                  ? 'bg-indigo-600'
                  : 'bg-gray-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {form.reminderEnabled && (
            <div className='mt-3'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                Reminder Time
              </label>
              <input
                type='time'
                value={form.reminderTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reminderTime: e.target.value }))
                }
                className='w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow'
              />
            </div>
          )}
        </div>

        <div className='flex gap-3 pt-2'>
          <Button
            type='button'
            variant='secondary'
            onClick={onClose}
            className='flex-1'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={!form.name.trim() || form.targetDays.length === 0}
            className='flex-1'
          >
            {editingHabit ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
