'use client'

import { useState, useRef } from 'react'
import { CATEGORIES } from '@/lib/types'

interface ExtractedProduct {
  name: string
  price: number
  old_price: number | null
  category: string
}

interface UploadSectionProps {
  onSuccess: () => void
}

const MARKETS = [
  { name: 'BİM', color: '#FF6B00' },
  { name: 'A101', color: '#E31E24' },
  { name: 'ŞOK', color: '#6B1FA2' },
]

export default function UploadSection({ onSuccess }: UploadSectionProps) {
  const [selectedMarket, setSelectedMarket] = useState<string>('')
  const [catalogTitle, setCatalogTitle] = useState('')
  const [validFrom, setValidFrom] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState<ExtractedProduct[]>([])
  const [_uploadedFileUrl, setUploadedFileUrl] = useState<string>('')
  const [uploadedCatalogId, setUploadedCatalogId] = useState<string>('')
  const [step, setStep] = useState<'form' | 'products' | 'done'>('form')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  async function handleUploadAndExtract() {
    if (!selectedMarket || !catalogTitle || !validFrom || !validUntil || !file) {
      setError('Lütfen tüm alanları doldurun ve dosya seçin.')
      return
    }

    setError('')
    setUploading(true)

    try {
      // Step 1: Create catalog + upload file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('market', selectedMarket)
      formData.append('title', catalogTitle)
      formData.append('validFrom', validFrom)
      formData.append('validUntil', validUntil)

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.error || 'Yükleme başarısız')
      }

      const { catalogId, fileUrl } = await uploadRes.json()
      setUploadedCatalogId(catalogId)
      setUploadedFileUrl(fileUrl)
      setUploading(false)

      // Step 2: Extract products with Claude
      setExtracting(true)
      const extractRes = await fetch('/api/admin/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl, catalogId }),
      })

      if (!extractRes.ok) {
        const err = await extractRes.json()
        throw new Error(err.error || 'Ürün çıkarma başarısız')
      }

      const { products: extracted } = await extractRes.json()
      setProducts(extracted)
      setStep('products')
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setUploading(false)
      setExtracting(false)
    }
  }

  function updateProduct(index: number, field: keyof ExtractedProduct, value: any) {
    setProducts(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  function removeProduct(index: number) {
    setProducts(prev => prev.filter((_, i) => i !== index))
  }

  function addProduct() {
    setProducts(prev => [...prev, { name: '', price: 0, old_price: null, category: 'Diğer' }])
  }

  async function handleSave() {
    if (products.length === 0) {
      setError('En az bir ürün olmalıdır.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/admin/save-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalogId: uploadedCatalogId,
          market: selectedMarket,
          products,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Kayıt başarısız')
      }

      setStep('done')
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Kayıt sırasında hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  function resetForm() {
    setStep('form')
    setSelectedMarket('')
    setCatalogTitle('')
    setValidFrom('')
    setValidUntil('')
    setFile(null)
    setProducts([])
    setUploadedFileUrl('')
    setUploadedCatalogId('')
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  if (step === 'done') {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-4">✅</p>
        <h3 className="text-2xl font-bold text-white mb-2">Başarıyla kaydedildi!</h3>
        <p className="text-gray-400 mb-8">{products.length} ürün sisteme eklendi.</p>
        <button
          onClick={resetForm}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Yeni Katalog Yükle
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Yeni Katalog Yükle</h2>

      {step === 'form' && (
        <div className="bg-gray-800 rounded-2xl p-6 space-y-6">
          {/* Market selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Market *</label>
            <div className="flex gap-3">
              {MARKETS.map(m => (
                <button
                  key={m.name}
                  onClick={() => setSelectedMarket(m.name)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                    selectedMarket === m.name
                      ? 'text-white border-transparent'
                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                  style={selectedMarket === m.name ? { backgroundColor: m.color, borderColor: m.color } : {}}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog title */}
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

          {/* Date range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Başlangıç Tarihi *</label>
              <input
                type="date"
                value={validFrom}
                onChange={e => setValidFrom(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bitiş Tarihi *</label>
              <input
                type="date"
                value={validUntil}
                onChange={e => setValidUntil(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Katalog Dosyası * <span className="text-gray-500">(PDF, JPEG, PNG)</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 transition-colors"
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div>
                  <p className="text-2xl mb-1">
                    {file.type.includes('pdf') ? '📄' : '🖼️'}
                  </p>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="text-3xl mb-2">📂</p>
                  <p className="text-gray-300 font-medium">Dosya seçmek için tıklayın</p>
                  <p className="text-gray-500 text-sm">PDF, JPEG veya PNG</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-xl">{error}</p>
          )}

          <button
            onClick={handleUploadAndExtract}
            disabled={uploading || extracting}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <span className="animate-spin">⏳</span>
                Dosya yükleniyor...
              </>
            ) : extracting ? (
              <>
                <span className="animate-spin">🤖</span>
                AI ile ürünler çıkarılıyor...
              </>
            ) : (
              <>
                🤖 AI ile Ürünleri Çıkar
              </>
            )}
          </button>
        </div>
      )}

      {/* Product editing table */}
      {step === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Çıkarılan Ürünler</h3>
              <p className="text-gray-400 text-sm">{products.length} ürün bulundu · Düzenleyip onaylayın</p>
            </div>
            <button
              onClick={addProduct}
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              + Ürün Ekle
            </button>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {products.map((product, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 grid grid-cols-12 gap-3 items-start">
                {/* Name */}
                <div className="col-span-12 sm:col-span-4">
                  <label className="text-xs text-gray-400 mb-1 block">Ürün Adı</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={e => updateProduct(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                {/* Price */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Fiyat (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={product.price}
                    onChange={e => updateProduct(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                {/* Old price */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Eski Fiyat (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={product.old_price ?? ''}
                    onChange={e => updateProduct(index, 'old_price', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="—"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                {/* Category */}
                <div className="col-span-12 sm:col-span-3">
                  <label className="text-xs text-gray-400 mb-1 block">Kategori</label>
                  <select
                    value={product.category}
                    onChange={e => updateProduct(index, 'category', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                {/* Delete */}
                <div className="col-span-4 sm:col-span-1 flex items-end justify-end sm:justify-center pb-0.5">
                  <button
                    onClick={() => removeProduct(index)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-900/20"
                    title="Ürünü sil"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-xl">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setStep('form'); setError('') }}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
            >
              Geri Dön
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {saving ? 'Kaydediliyor...' : `✅ ${products.length} Ürünü Onayla ve Kaydet`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
