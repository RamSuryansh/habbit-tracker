import type { TimeFormat } from '@/types'
import {
  differenceInDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isToday as isDateToday,
  isSameDay,
  max as maxDate,
  min as minDate,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns'

export function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function getToday(): string {
  return getDateKey(new Date())
}

export function formatDate(
  date: Date,
  pattern: string = 'MMM d, yyyy',
): string {
  return format(date, pattern)
}

export function isToday(date: Date): boolean {
  return isDateToday(date)
}

export function getMonthDays(year: number, month: number): Date[] {
  const start = startOfMonth(new Date(year, month))
  const end = endOfMonth(new Date(year, month))
  return eachDayOfInterval({ start, end })
}

export function getCalendarDays(year: number, month: number): Date[] {
  const monthStart = startOfMonth(new Date(year, month))
  const monthEnd = endOfMonth(new Date(year, month))
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)
  return eachDayOfInterval({ start: calStart, end: calEnd })
}

export function getLast7Days(): Date[] {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i))
}

export function isSameDate(a: Date, b: Date): boolean {
  return isSameDay(a, b)
}

export function daysSince(dateStr: string): number {
  return differenceInDays(new Date(), parseISO(dateStr))
}

export function parseDate(dateKey: string): Date {
  return parseISO(dateKey)
}

export function formatTime(time: string, timeFormat: TimeFormat): string {
  if (timeFormat === '24h') return time
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export function getDateRange(days: number): Date[] {
  const today = new Date()
  return Array.from({ length: days }, (_, i) => subDays(today, days - 1 - i))
}

export function getWeekBuckets(
  start: Date,
  end: Date,
): { start: Date; end: Date; label: string }[] {
  const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 })
  return weeks.map((weekStart, i) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 })
    return {
      start: maxDate([weekStart, start]),
      end: minDate([weekEnd, end]),
      label: `W${i + 1}`,
    }
  })
}

export function getMonthBuckets(
  start: Date,
  end: Date,
): { start: Date; end: Date; label: string }[] {
  const months = eachMonthOfInterval({ start, end })
  return months.map((monthStart) => {
    const monthEnd = endOfMonth(monthStart)
    return {
      start: maxDate([monthStart, start]),
      end: minDate([monthEnd, end]),
      label: format(monthStart, 'MMM'),
    }
  })
}
