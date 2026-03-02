'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MARKET_COLORS } from '@/lib/types'

export interface CatalogCardData {
  id: string
  title: string
  valid_from: string
  valid_until: string
  file_url: string | null
  file_type: string | null
  market?: { name: string; color_hex: string }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
}

function DaysLeft({ validUntil }: { validUntil: string }) {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const end = new Date(validUntil)
    end.setHours(0, 0, 0, 0)
    setDays(Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  }, [validUntil])

  if (days === null || days < 0) return null

  const cls = days <= 2
    ? 'bg-red-100 text-red-700 border-red-200'
    : days <= 4
    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
    : 'bg-green-100 text-green-700 border-green-200'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {days === 0 ? 'Son gün!' : `${days} gün kaldı`}
    </span>
  )
}

interface Props {
  catalog: CatalogCardData
  onClick: (catalog: CatalogCardData) => void
}

export default function CatalogCard({ catalog, onClick }: Props) {
  const marketName = catalog.market?.name || ''
  const color = MARKET_COLORS[marketName] || '#666'
  const isPdf = catalog.file_type === 'pdf' || catalog.file_url?.endsWith('.pdf')

  return (
    <div
      onClick={() => onClick(catalog)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        {catalog.file_url && !isPdf ? (
          <Image
            src={catalog.file_url}
            alt={catalog.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${color}15, ${color}30)` }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg"
              style={{ backgroundColor: color }}>
              {marketName}
            </div>
            {isPdf && (
              <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                PDF Katalog
              </span>
            )}
            {!catalog.file_url && (
              <span className="text-xs text-gray-400">Görsel yükleniyor</span>
            )}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-800 shadow">
            {isPdf ? '📄 PDF Aç' : '🔍 Büyüt'}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded flex items-center justify-center text-white font-black text-[8px] flex-shrink-0"
            style={{ backgroundColor: color }}>
            {marketName.slice(0, 1)}
          </div>
          <span className="text-xs font-bold" style={{ color }}>{marketName}</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{catalog.title}</h3>
        <p className="text-xs text-gray-400">
          {formatDate(catalog.valid_from)} – {formatDate(catalog.valid_until)}
        </p>
        <DaysLeft validUntil={catalog.valid_until} />
      </div>
    </div>
  )
}
