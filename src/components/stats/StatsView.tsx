import { BarChart3, TrendingUp, Award, Zap } from 'lucide-react'
import { useHabitStats } from '@/hooks/useHabitStats'
import StreakCard from './StreakCard'
import CompletionChart from './CompletionChart'

export default function StatsView() {
  const stats = useHabitStats()

  if (stats.totalHabits === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mb-4">
          <BarChart3 size={36} className="text-violet-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          No stats yet
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs">
          Start tracking habits to see your statistics here.
        </p>
      </div>
    )
  }

  const bestHabit = stats.perHabit.reduce(
    (best, curr) =>
      curr.completionRate7d > (best?.completionRate7d ?? 0) ? curr : best,
    stats.perHabit[0],
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StreakCard
          label="Current best streak"
          value={Math.max(0, ...stats.perHabit.map((p) => p.currentStreak))}
          type="current"
        />
        <StreakCard
          label="All-time best streak"
          value={stats.bestOverallStreak}
          type="best"
        />
      </div>

      <CompletionChart data={stats.last7Days} />

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
              7-day rate
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(stats.overallRate7d * 100)}%
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-blue-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
              30-day rate
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(stats.overallRate30d * 100)}%
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={16} className="text-indigo-500" />
          <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
            Total completions
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.totalCompletions}
        </p>
      </div>

      {bestHabit && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-200 dark:border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-indigo-500" />
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Most consistent (7d)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{bestHabit.habit.emoji}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {bestHabit.habit.name}
            </span>
            <span className="ml-auto text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {Math.round(bestHabit.completionRate7d * 100)}%
            </span>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Per habit
        </h3>
        <div className="space-y-2">
          {stats.perHabit.map((ph) => (
            <div
              key={ph.habit.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
            >
              <span className="text-lg">{ph.habit.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {ph.habit.name}
                </p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    Streak: {ph.currentStreak}d
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    Best: {ph.bestStreak}d
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {Math.round(ph.completionRate7d * 100)}%
                </p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500">
                  7-day
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
