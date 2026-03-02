'use client'

import { MARKET_COLORS } from '@/lib/types'

interface MarketLogoProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-20 h-20 text-lg',
}

export default function MarketLogo({ name, size = 'md', showName = false }: MarketLogoProps) {
  const color = MARKET_COLORS[name] || '#666'
  const sizeClass = sizeClasses[size]

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${sizeClass} rounded-xl flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0`}
        style={{ backgroundColor: color }}
      >
        {name === 'BİM' && (
          <span className="font-black tracking-tight">BİM</span>
        )}
        {name === 'A101' && (
          <span className="font-black tracking-tight text-[10px]">A101</span>
        )}
        {name === 'ŞOK' && (
          <span className="font-black tracking-tight">ŞOK</span>
        )}
      </div>
      {showName && (
        <span className="text-xs font-medium text-gray-600">{name}</span>
      )}
    </div>
  )
}
