import { formatDate } from '@/utils/date'

interface DayData {
  date: Date
  completed: number
  total: number
}

interface CompletionChartProps {
  data: DayData[]
}

export default function CompletionChart({ data }: CompletionChartProps) {

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Last 7 days
      </h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((day, i) => {
          const height = day.total > 0 ? (day.completed / day.total) * 100 : 0
          const isToday = i === data.length - 1

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1.5"
            >
              <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">
                {day.total > 0
                  ? `${day.completed}/${day.total}`
                  : '-'}
              </span>
              <div className="w-full h-24 flex items-end">
                <div
                  className={`w-full rounded-lg transition-all duration-500 ${
                    height === 100
                      ? 'bg-green-500'
                      : height > 0
                        ? 'bg-indigo-500'
                        : 'bg-gray-200 dark:bg-slate-700'
                  }`}
                  style={{
                    height: `${Math.max(height, 4)}%`,
                  }}
                />
              </div>
              <span
                className={`text-[11px] ${
                  isToday
                    ? 'font-semibold text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-slate-500'
                }`}
              >
                {formatDate(day.date, 'EEE')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
