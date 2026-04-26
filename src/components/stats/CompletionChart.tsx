import type { ChartDataPoint, TimeRange } from '@/types'

interface CompletionChartProps {
  data: ChartDataPoint[]
  range: TimeRange
  onRangeChange: (range: TimeRange) => void
}

const RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '1M' },
  { value: '90d', label: '3M' },
  { value: '180d', label: '6M' },
  { value: '365d', label: '1Y' },
]

export default function CompletionChart({
  data,
  range,
  onRangeChange,
}: CompletionChartProps) {
  const barCount = data.length
  const compact = barCount > 13
  const showLabelsAbove = barCount <= 13
  const labelInterval = barCount <= 13 ? 1 : barCount <= 30 ? 5 : 2

  return (
    <div className='p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700'>
      <div className='flex items-center justify-between mb-7 border-b border-gray-200 dark:border-slate-700 pb-2'>
        <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Completion Rate
        </h3>
        <div className='flex gap-1'>
          {RANGE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onRangeChange(value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                range === value
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className={`flex items-end ${compact ? 'gap-0.5' : 'gap-2'} h-32`}>
        {data.map((point, i) => {
          const height =
            point.total > 0 ? (point.completed / point.total) * 100 : 0
          const isLast = i === barCount - 1
          const showLabel = i % labelInterval === 0 || isLast

          return (
            <div key={i} className='flex-1 flex flex-col items-center gap-1.5'>
              {showLabelsAbove && (
                <span className='text-[10px] font-medium text-gray-500 dark:text-slate-400'>
                  {point.total > 0 ? `${point.completed}/${point.total}` : '-'}
                </span>
              )}
              <div
                className={`w-full ${showLabelsAbove ? 'h-24' : 'h-28'} flex items-end`}
              >
                <div
                  className={`w-full transition-all duration-500 ${
                    compact ? 'rounded-sm' : 'rounded-lg'
                  } ${
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
                  isLast
                    ? 'font-semibold text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-slate-500'
                } ${!showLabel ? 'invisible' : ''}`}
              >
                {point.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
