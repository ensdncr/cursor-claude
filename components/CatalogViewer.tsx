'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import type { CatalogCardData } from './CatalogCard'
import { MARKET_COLORS } from '@/lib/types'

interface Props {
  catalog: CatalogCardData
  onClose: () => void
}

export default function CatalogViewer({ catalog, onClose }: Props) {
  const color = MARKET_COLORS[catalog.market?.name || ''] || '#666'
  const isPdf = catalog.file_type === 'pdf' || catalog.file_url?.endsWith('.pdf')

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs"
            style={{ backgroundColor: color }}>
            {catalog.market?.name}
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{catalog.title}</p>
            <p className="text-gray-400 text-xs">
              {new Date(catalog.valid_from).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} –{' '}
              {new Date(catalog.valid_until).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {catalog.file_url && (
            <a
              href={catalog.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {isPdf ? '↗ PDF Aç' : '↗ Tam Boyut'}
            </a>
          )}
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4">
        {!catalog.file_url ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-4xl mb-3">🖼️</p>
            <p>Katalog görseli henüz yüklenmemiş</p>
          </div>
        ) : isPdf ? (
          <iframe
            src={catalog.file_url}
            className="w-full max-w-4xl h-full min-h-[70vh] rounded-xl border-0"
            title={catalog.title}
          />
        ) : (
          <div className="relative max-w-2xl w-full">
            <Image
              src={catalog.file_url}
              alt={catalog.title}
              width={800}
              height={1100}
              className="w-full h-auto rounded-xl shadow-2xl"
              priority
            />
          </div>
        )}
      </div>
    </div>
  )
}
