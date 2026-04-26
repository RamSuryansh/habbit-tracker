import { useHabitStore } from '@/stores/habitStore'
import type { Habit } from '@/types'
import { getDateKey, getLast7Days } from '@/utils/date'
import { subDays } from 'date-fns'
import { useMemo } from 'react'

interface HabitStats {
  currentStreak: number
  bestStreak: number
  completionRate7d: number
  completionRate30d: number
  totalCompletions: number
}

interface OverallStats {
  totalHabits: number
  totalCompletions: number
  overallRate7d: number
  overallRate30d: number
  bestOverallStreak: number
  todayCompleted: number
  todayTotal: number
  last7Days: { date: Date; completed: number; total: number }[]
  perHabit: (HabitStats & { habit: Habit })[]
}

function computeStreak(
  habitId: string,
  targetDays: number[],
  completions: Record<string, string[]>,
): { current: number; best: number } {
  const today = new Date()
  let current = 0
  let best = 0
  let streak = 0
  let broken = false

  for (let i = 0; i < 365; i++) {
    const d = subDays(today, i)
    const dayOfWeek = d.getDay()
    if (!targetDays.includes(dayOfWeek)) continue

    const key = getDateKey(d)
    const completed = completions[key]?.includes(habitId) ?? false

    if (completed) {
      streak++
      if (!broken) current = streak
      best = Math.max(best, streak)
    } else {
      if (!broken) broken = true
      streak = 0
      if (best >= 365 - i) break
    }
  }

  return { current, best }
}

function computeRate(
  habitId: string,
  targetDays: number[],
  completions: Record<string, string[]>,
  days: number,
): number {
  const today = new Date()
  let eligible = 0
  let completed = 0

  for (let i = 0; i < days; i++) {
    const d = subDays(today, i)
    if (!targetDays.includes(d.getDay())) continue
    eligible++
    const key = getDateKey(d)
    if (completions[key]?.includes(habitId)) completed++
  }

  return eligible === 0 ? 0 : completed / eligible
}

export function useHabitStats(): OverallStats {
  const habits = useHabitStore((s) => s.habits)
  const completions = useHabitStore((s) => s.completions)

  return useMemo(() => {
    const active = habits.filter((h) => !h.archived)
    const today = new Date()
    const todayKey = getDateKey(today)
    const dayOfWeek = today.getDay()

    const todayHabits = active.filter((h) => h.targetDays.includes(dayOfWeek))
    const todayCompleted = todayHabits.filter((h) =>
      completions[todayKey]?.includes(h.id),
    ).length

    const perHabit = active.map((habit) => {
      const { current, best } = computeStreak(
        habit.id,
        habit.targetDays,
        completions,
      )
      const totalCompletions = Object.values(completions).filter((ids) =>
        ids.includes(habit.id),
      ).length

      return {
        habit,
        currentStreak: current,
        bestStreak: best,
        completionRate7d: computeRate(
          habit.id,
          habit.targetDays,
          completions,
          7,
        ),
        completionRate30d: computeRate(
          habit.id,
          habit.targetDays,
          completions,
          30,
        ),
        totalCompletions,
      }
    })

    const last7Days = getLast7Days().map((date) => {
      const key = getDateKey(date)
      const dayHabits = active.filter((h) =>
        h.targetDays.includes(date.getDay()),
      )
      const completed = dayHabits.filter((h) =>
        completions[key]?.includes(h.id),
      ).length
      return { date, completed, total: dayHabits.length }
    })

    const totalCompletions = Object.values(completions).reduce(
      (sum, ids) => sum + ids.length,
      0,
    )

    const rates7d = perHabit.map((p) => p.completionRate7d)
    const rates30d = perHabit.map((p) => p.completionRate30d)

    return {
      totalHabits: active.length,
      totalCompletions,
      overallRate7d:
        rates7d.length > 0
          ? rates7d.reduce((a, b) => a + b, 0) / rates7d.length
          : 0,
      overallRate30d:
        rates30d.length > 0
          ? rates30d.reduce((a, b) => a + b, 0) / rates30d.length
          : 0,
      bestOverallStreak: Math.max(0, ...perHabit.map((p) => p.bestStreak)),
      todayCompleted,
      todayTotal: todayHabits.length,
      last7Days,
      perHabit,
    }
  }, [habits, completions])
}
