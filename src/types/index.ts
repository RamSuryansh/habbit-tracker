export type Theme = 'light' | 'dark'

export type TimeFormat = '12h' | '24h'

export type Frequency = 'daily' | 'custom'

export type View = 'today' | 'calendar' | 'stats' | 'habits'

export type TimeRange = '7d' | '30d' | '90d' | '180d' | '365d'

export interface ChartDataPoint {
  label: string
  completed: number
  total: number
  startDate: Date
  endDate: Date
}

export interface Habit {
  id: string
  name: string
  description: string
  emoji: string
  color: string
  category: string
  frequency: Frequency
  targetDays: number[] // 0=Sun..6=Sat
  reminderEnabled: boolean
  reminderTime: string // "HH:mm" format
  createdAt: string
  archived: boolean
}

export type Completions = Record<string, string[]>

export interface HabitStore {
  habits: Habit[]
  completions: Completions
  theme: Theme
  timeFormat: TimeFormat
  notifiedToday: Record<string, string[]>
  dismissedReminders: string[]

  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void
  editHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void
  deleteHabit: (id: string) => void
  archiveHabit: (id: string) => void
  unarchiveHabit: (id: string) => void
  toggleCompletion: (habitId: string, date: string) => void
  toggleTheme: () => void
  setTimeFormat: (format: TimeFormat) => void
  markNotified: (habitId: string, date: string) => void
  dismissReminder: (habitId: string) => void
  resetDailyReminders: (date: string) => void
}
