'use client'

import { useState, useEffect } from 'react'
import { MARKET_COLORS } from '@/lib/types'

interface CatalogEntry {
  id: string
  title: string
  valid_from: string
  valid_until: string
  file_url: string | null
  file_type: string | null
  market: { name: string; color_hex: string }
}

export default function CatalogList({ onUpdate }: { onUpdate: () => void }) {
  const [catalogs, setCatalogs] = useState<CatalogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchCatalogs() }, [])

  async function fetchCatalogs() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/catalogs')
      if (res.ok) setCatalogs(await res.json())
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu katalogu silmek istediğinizden emin misiniz?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/catalogs?id=${id}`, { method: 'DELETE' })
      if (res.ok) { setCatalogs(p => p.filter(c => c.id !== id)); onUpdate() }
    } catch { /* ignore */ } finally {
      setDeletingId(null)
    }
  }

  function isExpired(validUntil: string) {
    return new Date(validUntil) < new Date(new Date().toDateString())
  }

  function fmt(d: string) {
    return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse h-16" />
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
          const color = MARKET_COLORS[catalog.market?.name] || '#666'
          const isPdf = catalog.file_type === 'pdf'

          return (
            <div key={catalog.id}
              className={`bg-gray-800 rounded-xl p-4 flex items-center gap-4 ${expired ? 'opacity-60' : ''}`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                style={{ backgroundColor: color }}>
                {catalog.market?.name}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold text-sm truncate">{catalog.title}</h3>
                  {expired && (
                    <span className="bg-red-900/50 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-800 flex-shrink-0">
                      Süresi doldu
                    </span>
                  )}
                  {catalog.file_url && (
                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                      {isPdf ? '📄 PDF' : '🖼️ Görsel'}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-0.5">{fmt(catalog.valid_from)} – {fmt(catalog.valid_until)}</p>
                {catalog.file_url && (
                  <a href={catalog.file_url} target="_blank" rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 text-xs mt-0.5 inline-block transition-colors">
                    Görüntüle ↗
                  </a>
                )}
              </div>

              <button
                onClick={() => handleDelete(catalog.id)}
                disabled={deletingId === catalog.id}
                className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-900/20 disabled:opacity-50 flex-shrink-0"
              >
                {deletingId === catalog.id ? (
                  <span className="animate-spin block text-sm">⏳</span>
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
