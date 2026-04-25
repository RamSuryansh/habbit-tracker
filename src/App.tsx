import { useState, useEffect } from 'react'
import { useHabitStore } from '@/stores/habitStore'
import { useReminders } from '@/hooks/useReminders'
import Header from '@/components/layout/Header'
import Navigation from '@/components/layout/Navigation'
import HabitList from '@/components/habits/HabitList'
import HabitForm from '@/components/habits/HabitForm'
import CalendarView from '@/components/calendar/CalendarView'
import StatsView from '@/components/stats/StatsView'
import type { View, Habit } from '@/types'

export default function App() {
  const theme = useHabitStore((s) => s.theme)
  useReminders()
  const [activeView, setActiveView] = useState<View>('today')
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  function handleAddHabit() {
    setEditingHabit(null)
    setShowForm(true)
  }

  function handleEditHabit(habit: Habit) {
    setEditingHabit(habit)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingHabit(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="mx-auto max-w-2xl px-4 pb-24 sm:pb-8">
        <Header onAddHabit={handleAddHabit} />
        <Navigation activeView={activeView} onViewChange={setActiveView} />

        <main>
          {activeView === 'today' && (
            <HabitList onEditHabit={handleEditHabit} onAddHabit={handleAddHabit} />
          )}
          {activeView === 'calendar' && (
            <CalendarView onEditHabit={handleEditHabit} />
          )}
          {activeView === 'stats' && <StatsView />}
        </main>
      </div>

      <HabitForm
        open={showForm}
        onClose={handleCloseForm}
        editingHabit={editingHabit}
      />
    </div>
  )
}
