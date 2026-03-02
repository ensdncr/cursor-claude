'use client'

import { useState, useEffect } from 'react'
import { MARKET_COLORS } from '@/lib/types'

interface CatalogWithStats {
  id: string
  title: string
  valid_from: string
  valid_until: string
  product_count: number
  market: { name: string; color_hex: string }
}

interface CatalogListProps {
  onUpdate: () => void
}

export default function CatalogList({ onUpdate }: CatalogListProps) {
  const [catalogs, setCatalogs] = useState<CatalogWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCatalogs()
  }, [])

  async function fetchCatalogs() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/catalogs')
      if (res.ok) {
        const data = await res.json()
        setCatalogs(data)
      }
    } catch {
      console.error('Catalog fetch error')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu katalogu ve tüm ürünlerini silmek istediğinizden emin misiniz?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/catalogs?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCatalogs(prev => prev.filter(c => c.id !== id))
        onUpdate()
      }
    } catch {
      console.error('Delete error')
    } finally {
      setDeletingId(null)
    }
  }

  function isExpired(validUntil: string): boolean {
    return new Date(validUntil) < new Date(new Date().toDateString())
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-48 mb-2" />
            <div className="h-3 bg-gray-700 rounded w-32" />
          </div>
        ))}
      </div>
    )
  }

  if (catalogs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">📂</p>
        <p className="text-gray-400">Henüz katalog yüklenmemiş</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Kataloglar ({catalogs.length})</h2>
      <div className="space-y-3">
        {catalogs.map(catalog => {
          const expired = isExpired(catalog.valid_until)
          const marketColor = MARKET_COLORS[catalog.market?.name] || '#666'

          return (
            <div
              key={catalog.id}
              className={`bg-gray-800 rounded-xl p-4 flex items-center gap-4 ${expired ? 'opacity-60' : ''}`}
            >
              {/* Market badge */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                style={{ backgroundColor: marketColor }}
              >
                {catalog.market?.name}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold text-sm truncate">{catalog.title}</h3>
                  {expired && (
                    <span className="bg-red-900/50 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-800">
                      Süresi doldu
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-0.5">
                  {formatDate(catalog.valid_from)} – {formatDate(catalog.valid_until)}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {catalog.product_count} ürün
                </p>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(catalog.id)}
                disabled={deletingId === catalog.id}
                className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-900/20 disabled:opacity-50 flex-shrink-0"
                title="Katalogu sil"
              >
                {deletingId === catalog.id ? (
                  <span className="animate-spin block">⏳</span>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
