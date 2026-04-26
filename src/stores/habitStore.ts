import type { Habit, HabitStore, TimeFormat } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: [],
      completions: {},
      theme: 'dark',
      timeFormat: '12h' as TimeFormat,
      notifiedToday: {},
      dismissedReminders: [],

      addHabit: (habitData) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habitData,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              archived: false,
            },
          ],
        })),

      editHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h,
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          completions: Object.fromEntries(
            Object.entries(state.completions).map(([date, ids]) => [
              date,
              ids.filter((hid) => hid !== id),
            ]),
          ),
        })),

      archiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, archived: true } : h,
          ),
        })),

      unarchiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, archived: false } : h,
          ),
        })),

      toggleCompletion: (habitId, date) =>
        set((state) => {
          const dayCompletions = state.completions[date] ?? []
          const isCompleted = dayCompletions.includes(habitId)
          return {
            completions: {
              ...state.completions,
              [date]: isCompleted
                ? dayCompletions.filter((id) => id !== habitId)
                : [...dayCompletions, habitId],
            },
          }
        }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      setTimeFormat: (timeFormat) => set({ timeFormat }),

      markNotified: (habitId, date) =>
        set((state) => ({
          notifiedToday: {
            ...state.notifiedToday,
            [date]: [...(state.notifiedToday[date] ?? []), habitId],
          },
        })),

      dismissReminder: (habitId) =>
        set((state) => ({
          dismissedReminders: [...state.dismissedReminders, habitId],
        })),

      resetDailyReminders: (date) =>
        set((state) => {
          const hasCurrentDate = date in state.notifiedToday
          if (
            hasCurrentDate &&
            Object.keys(state.notifiedToday).length === 1 &&
            state.dismissedReminders.length === 0
          ) {
            return {}
          }
          return {
            notifiedToday: hasCurrentDate
              ? { [date]: state.notifiedToday[date] }
              : {},
            dismissedReminders: [],
          }
        }),
    }),
    {
      name: 'habit-tracker-storage',
    },
  ),
)

export function getActiveHabits(habits: Habit[]): Habit[] {
  return habits.filter((h) => !h.archived)
}

export function getArchivedHabits(habits: Habit[]): Habit[] {
  return habits.filter((h) => h.archived)
}

export function getHabitsForDay(habits: Habit[], dayOfWeek: number): Habit[] {
  return getActiveHabits(habits).filter((h) => h.targetDays.includes(dayOfWeek))
}
