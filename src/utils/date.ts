import { format, startOfMonth, endOfMonth, eachDayOfInterval, subDays, isSameDay, isToday as isDateToday, startOfWeek, endOfWeek, differenceInDays, parseISO } from 'date-fns'

export function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function getToday(): string {
  return getDateKey(new Date())
}

export function formatDate(date: Date, pattern: string = 'MMM d, yyyy'): string {
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
