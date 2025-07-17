import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  change?: number
}

export function StatsCard({ title, value, icon, change }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className={`mt-4 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
          <span className="ml-1 text-sm font-medium">
            {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'} from last month
          </span>
        </div>
      )}
    </div>
  )
}