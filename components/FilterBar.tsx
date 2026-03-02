'use client'

import { useState, useEffect } from 'react'
import { CATEGORIES, MARKET_COLORS } from '@/lib/types'
import MarketLogo from './MarketLogo'

const MARKETS = ['BİM', 'A101', 'ŞOK']

interface FilterBarProps {
  onFiltersChange: (filters: { market: string; category: string; search: string }) => void
}

export default function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [selectedMarket, setSelectedMarket] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    onFiltersChange({ market: selectedMarket, category: selectedCategory, search })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarket, selectedCategory, search])

  const handleMarketClick = (market: string) => {
    setSelectedMarket(prev => prev === market ? '' : market)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          placeholder="Ürün ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Market filter */}
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Market</p>
        <div className="flex gap-2 flex-wrap">
          {MARKETS.map(market => {
            const isActive = selectedMarket === market
            const color = MARKET_COLORS[market]
            return (
              <button
                key={market}
                onClick={() => handleMarketClick(market)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
                style={isActive ? { backgroundColor: color, borderColor: color } : {}}
              >
                <MarketLogo name={market} size="sm" />
                {market}
              </button>
            )
          })}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Kategori</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              selectedCategory === ''
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            Tümü
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(prev => prev === cat ? '' : cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                selectedCategory === cat
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
