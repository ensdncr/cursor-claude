'use client'

import { useState } from 'react'
import CatalogCard, { type CatalogCardData } from './CatalogCard'
import CatalogViewer from './CatalogViewer'
import { MARKET_COLORS } from '@/lib/types'

const MARKETS = ['BİM', 'A101', 'ŞOK']

interface Props {
  catalogs: CatalogCardData[]
}

export default function CatalogGrid({ catalogs }: Props) {
  const [selectedMarket, setSelectedMarket] = useState('')
  const [viewing, setViewing] = useState<CatalogCardData | null>(null)

  const filtered = selectedMarket
    ? catalogs.filter(c => c.market?.name === selectedMarket)
    : catalogs

  return (
    <>
      {/* Market filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setSelectedMarket('')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
            selectedMarket === ''
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          Tümü ({catalogs.length})
        </button>
        {MARKETS.map(market => {
          const count = catalogs.filter(c => c.market?.name === market).length
          if (count === 0) return null
          const color = MARKET_COLORS[market]
          const isActive = selectedMarket === market
          return (
            <button
              key={market}
              onClick={() => setSelectedMarket(p => p === market ? '' : market)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                isActive ? 'text-white' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
              style={isActive ? { backgroundColor: color, borderColor: color } : {}}
            >
              {market} ({count})
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📂</p>
          <p className="text-gray-500 font-medium">Henüz katalog yüklenmemiş</p>
          <p className="text-gray-400 text-sm mt-1">Yakında eklenecek!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map(catalog => (
            <CatalogCard key={catalog.id} catalog={catalog} onClick={setViewing} />
          ))}
        </div>
      )}

      {/* Lightbox viewer */}
      {viewing && (
        <CatalogViewer catalog={viewing} onClose={() => setViewing(null)} />
      )}
    </>
  )
}
