import { useEffect, useRef } from 'react'
import { useHabitStore } from '@/stores/habitStore'
import { getToday } from '@/utils/date'
import { requestPermission, showNotification, getPermissionStatus } from '@/utils/notifications'

export function useReminders(): void {
  const habits = useHabitStore((s) => s.habits)
  const markNotified = useHabitStore((s) => s.markNotified)
  const resetDailyReminders = useHabitStore((s) => s.resetDailyReminders)

  const lastDateRef = useRef(getToday())

  useEffect(() => {
    const hasAnyReminder = habits.some((h) => h.reminderEnabled && !h.archived)
    if (hasAnyReminder && getPermissionStatus() === 'default') {
      requestPermission()
    }
  }, [habits])

  useEffect(() => {
    function checkReminders() {
      const now = new Date()
      const todayKey = getToday()
      const dayOfWeek = now.getDay()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      if (lastDateRef.current !== todayKey) {
        resetDailyReminders(todayKey)
        lastDateRef.current = todayKey
      }

      const state = useHabitStore.getState()

      for (const habit of state.habits) {
        if (habit.archived) continue
        if (!habit.reminderEnabled) continue
        if (!habit.targetDays.includes(dayOfWeek)) continue
        if (state.completions[todayKey]?.includes(habit.id)) continue
        if (currentTime < habit.reminderTime) continue
        if (state.notifiedToday[todayKey]?.includes(habit.id)) continue

        showNotification(
          `${habit.emoji} ${habit.name}`,
          habit.description || 'Time to work on your habit!',
          `habit-${habit.id}-${todayKey}`,
        )
        markNotified(habit.id, todayKey)
      }
    }

    checkReminders()

    const interval = setInterval(checkReminders, 30_000)

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        checkReminders()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [markNotified, resetDailyReminders])
}
