'use client'

import { useState, useRef } from 'react'

interface UploadSectionProps {
  onSuccess: () => void
}

const MARKETS = [
  { name: 'BİM', color: '#FF6B00' },
  { name: 'A101', color: '#E31E24' },
  { name: 'ŞOK', color: '#6B1FA2' },
]

export default function UploadSection({ onSuccess }: UploadSectionProps) {
  const [selectedMarket, setSelectedMarket] = useState('')
  const [catalogTitle, setCatalogTitle] = useState('')
  const [validFrom, setValidFrom] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  async function handleUpload() {
    if (!selectedMarket || !catalogTitle || !validFrom || !validUntil || !file) {
      setError('Lütfen tüm alanları doldurun ve dosya seçin.')
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('market', selectedMarket)
      formData.append('title', catalogTitle)
      formData.append('validFrom', validFrom)
      formData.append('validUntil', validUntil)

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Yükleme başarısız')
      }

      setDone(true)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  function reset() {
    setDone(false)
    setSelectedMarket('')
    setCatalogTitle('')
    setValidFrom('')
    setValidUntil('')
    setFile(null)
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  if (done) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-4">✅</p>
        <h3 className="text-2xl font-bold text-white mb-2">Katalog yüklendi!</h3>
        <p className="text-gray-400 mb-8">Kullanıcılar artık bu katalogu görebilir.</p>
        <button onClick={reset} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Yeni Katalog Yükle
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold mb-6">Yeni Katalog Yükle</h2>

      <div className="bg-gray-800 rounded-2xl p-6 space-y-5">
        {/* Market */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Market *</label>
          <div className="flex gap-3">
            {MARKETS.map(m => (
              <button
                key={m.name}
                onClick={() => setSelectedMarket(m.name)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                  selectedMarket === m.name ? 'text-white border-transparent' : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500'
                }`}
                style={selectedMarket === m.name ? { backgroundColor: m.color, borderColor: m.color } : {}}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Katalog Başlığı *</label>
          <input
            type="text"
            value={catalogTitle}
            onChange={e => setCatalogTitle(e.target.value)}
            placeholder="örn: BİM 10-16 Mart Aktüeli"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Başlangıç *</label>
            <input type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bitiş *</label>
            <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>

        {/* File */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Katalog Dosyası * <span className="text-gray-500">(JPG, PNG, PDF)</span>
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 transition-colors"
          >
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
            {file ? (
              <div>
                <p className="text-3xl mb-1">{file.type.includes('pdf') ? '📄' : '🖼️'}</p>
                <p className="text-white font-medium text-sm">{file.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-3xl mb-2">📂</p>
                <p className="text-gray-300 font-medium">Dosya seçmek için tıklayın</p>
                <p className="text-gray-500 text-sm">JPG, PNG veya PDF · Maks 20MB</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-xl">{error}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <><span className="animate-spin">⏳</span> Yükleniyor...</>
          ) : (
            <>📤 Katalogu Yükle</>
          )}
        </button>
      </div>
    </div>
  )
}
