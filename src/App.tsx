import HabitForm from '@/components/habits/HabitForm'
import HabitList from '@/components/habits/HabitList'
import Header from '@/components/layout/Header'
import Navigation from '@/components/layout/Navigation'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { useReminders } from '@/hooks/useReminders'
import { useHabitStore } from '@/stores/habitStore'
import type { Habit, View } from '@/types'
import { lazy, Suspense, useEffect, useState } from 'react'

const CalendarView = lazy(() => import('@/components/calendar/CalendarView'))
const StatsView = lazy(() => import('@/components/stats/StatsView'))
const AllHabitsView = lazy(() => import('@/components/habits/AllHabitsView'))

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
    <ErrorBoundary>
      <div className='min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200'>
        <div className='mx-auto max-w-2xl px-4 pb-24 sm:pb-8'>
          <Header onAddHabit={handleAddHabit} />
          <Navigation activeView={activeView} onViewChange={setActiveView} />

          <main>
            {activeView === 'today' && (
              <HabitList
                onEditHabit={handleEditHabit}
                onAddHabit={handleAddHabit}
              />
            )}
            <Suspense
              fallback={
                <div className='flex justify-center py-20'>
                  <div className='w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin' />
                </div>
              }
            >
              {activeView === 'calendar' && (
                <CalendarView onEditHabit={handleEditHabit} />
              )}
              {activeView === 'stats' && <StatsView />}
              {activeView === 'habits' && (
                <AllHabitsView onEditHabit={handleEditHabit} />
              )}
            </Suspense>
          </main>
        </div>

        <HabitForm
          open={showForm}
          onClose={handleCloseForm}
          editingHabit={editingHabit}
        />
      </div>
    </ErrorBoundary>
  )
}
