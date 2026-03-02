'use client'

import { useState, useCallback } from 'react'
import ProductCard from './ProductCard'
import FilterBar from './FilterBar'

interface ProductWithRelations {
  id: string
  catalog_id: string
  market_id: string
  name: string
  price: number
  old_price: number | null
  category: string
  image_url: string | null
  created_at: string
  market?: { name: string; color_hex: string }
  catalog?: { valid_until: string; title: string }
}

interface ProductGridProps {
  initialProducts: ProductWithRelations[]
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [products] = useState<ProductWithRelations[]>(initialProducts)
  const [filtered, setFiltered] = useState<ProductWithRelations[]>(initialProducts)

  const handleFiltersChange = useCallback(
    (filters: { market: string; category: string; search: string }) => {
      let result = products

      if (filters.market) {
        result = result.filter(p => p.market?.name === filters.market)
      }

      if (filters.category) {
        result = result.filter(p => p.category === filters.category)
      }

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim()
        result = result.filter(p => p.name.toLowerCase().includes(q))
      }

      setFiltered(result)
    },
    [products]
  )

  return (
    <div className="flex flex-col gap-6">
      <FilterBar onFiltersChange={handleFiltersChange} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{filtered.length}</span> ürün gösteriliyor
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500 font-medium">Ürün bulunamadı</p>
          <p className="text-gray-400 text-sm mt-1">Farklı bir arama deneyin</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
