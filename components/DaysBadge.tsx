'use client'

interface DaysBadgeProps {
  validUntil: string
}

export default function DaysBadge({ validUntil }: DaysBadgeProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(validUntil)
  end.setHours(0, 0, 0, 0)
  const diffTime = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return null

  let colorClass = ''
  let label = ''

  if (diffDays <= 2) {
    colorClass = 'bg-red-100 text-red-700 border-red-200'
    label = diffDays === 0 ? 'Son gün!' : `${diffDays} gün kaldı`
  } else if (diffDays <= 4) {
    colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200'
    label = `${diffDays} gün kaldı`
  } else {
    colorClass = 'bg-green-100 text-green-700 border-green-200'
    label = `${diffDays} gün kaldı`
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {label}
    </span>
  )
}
