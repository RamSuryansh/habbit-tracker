import { Flame, Trophy } from 'lucide-react'

interface StreakCardProps {
  label: string
  value: number
  type: 'current' | 'best'
}

export default function StreakCard({ label, value, type }: StreakCardProps) {
  const Icon = type === 'current' ? Flame : Trophy
  const iconColor = type === 'current' ? 'text-orange-500' : 'text-yellow-500'
  const bgColor =
    type === 'current'
      ? 'bg-orange-50 dark:bg-orange-500/10'
      : 'bg-yellow-50 dark:bg-yellow-500/10'

  return (
    <div className='flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700'>
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgColor}`}
      >
        <Icon size={22} className={iconColor} />
      </div>
      <div>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
          {value}
          <span className='text-sm font-normal text-gray-400 dark:text-slate-500 ml-1'>
            days
          </span>
        </p>
        <p className='text-xs text-gray-500 dark:text-slate-400'>{label}</p>
      </div>
    </div>
  )
}
