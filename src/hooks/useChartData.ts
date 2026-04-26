import { useMemo } from 'react'
import { useHabitStore } from '@/stores/habitStore'
import { getDateKey, getDateRange, getWeekBuckets, getMonthBuckets, formatDate } from '@/utils/date'
import { subDays, eachDayOfInterval } from 'date-fns'
import type { TimeRange, ChartDataPoint } from '@/types'

const RANGE_DAYS: Record<TimeRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '180d': 180,
  '365d': 365,
}

function computeBucketData(
  daysInBucket: Date[],
  activeHabits: { id: string; targetDays: number[] }[],
  completions: Record<string, string[]>,
): { completed: number; total: number } {
  let completed = 0
  let total = 0
  for (const date of daysInBucket) {
    const key = getDateKey(date)
    const dayHabits = activeHabits.filter((h) => h.targetDays.includes(date.getDay()))
    total += dayHabits.length
    completed += dayHabits.filter((h) => completions[key]?.includes(h.id)).length
  }
  return { completed, total }
}

export function useChartData(range: TimeRange): ChartDataPoint[] {
  const habits = useHabitStore((s) => s.habits)
  const completions = useHabitStore((s) => s.completions)

  return useMemo(() => {
    const active = habits.filter((h) => !h.archived)
    const days = RANGE_DAYS[range]
    const today = new Date()
    const startDate = subDays(today, days - 1)

    if (range === '7d') {
      return getDateRange(7).map((date) => {
        const key = getDateKey(date)
        const dayHabits = active.filter((h) => h.targetDays.includes(date.getDay()))
        const completed = dayHabits.filter((h) => completions[key]?.includes(h.id)).length
        return {
          label: formatDate(date, 'EEE'),
          completed,
          total: dayHabits.length,
          startDate: date,
          endDate: date,
        }
      })
    }

    if (range === '30d') {
      return getDateRange(30).map((date) => {
        const key = getDateKey(date)
        const dayHabits = active.filter((h) => h.targetDays.includes(date.getDay()))
        const completed = dayHabits.filter((h) => completions[key]?.includes(h.id)).length
        return {
          label: formatDate(date, 'd'),
          completed,
          total: dayHabits.length,
          startDate: date,
          endDate: date,
        }
      })
    }

    if (range === '90d' || range === '180d') {
      const buckets = getWeekBuckets(startDate, today)
      return buckets.map((bucket) => {
        const daysInBucket = eachDayOfInterval({ start: bucket.start, end: bucket.end })
        const { completed, total } = computeBucketData(daysInBucket, active, completions)
        return {
          label: bucket.label,
          completed,
          total,
          startDate: bucket.start,
          endDate: bucket.end,
        }
      })
    }

    const buckets = getMonthBuckets(startDate, today)
    return buckets.map((bucket) => {
      const daysInBucket = eachDayOfInterval({ start: bucket.start, end: bucket.end })
      const { completed, total } = computeBucketData(daysInBucket, active, completions)
      return {
        label: bucket.label,
        completed,
        total,
        startDate: bucket.start,
        endDate: bucket.end,
      }
    })
  }, [habits, completions, range])
}
