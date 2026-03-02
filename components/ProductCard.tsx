'use client'

import Image from 'next/image'
import { MARKET_COLORS } from '@/lib/types'
import DaysBadge from './DaysBadge'
import MarketLogo from './MarketLogo'

export interface ProductCardData {
  id: string
  name: string
  price: number
  old_price: number | null
  category: string
  image_url: string | null
  market?: { name: string; color_hex: string }
  catalog?: { valid_until: string; title: string }
}

interface ProductCardProps {
  product: ProductCardData
}

function formatPrice(price: number): string {
  return price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'
}

function getDiscountPercent(price: number, oldPrice: number): number {
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}

export default function ProductCard({ product }: ProductCardProps) {
  const marketName = product.market?.name || ''
  const marketColor = MARKET_COLORS[marketName] || '#666'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover flex flex-col">
      {/* Product image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: marketColor + '20' }}
            >
              {getCategoryEmoji(product.category)}
            </div>
          </div>
        )}

        {/* Discount badge */}
        {product.old_price && product.old_price > product.price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            %{getDiscountPercent(product.price, product.old_price)} İNDİRİM
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Category */}
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1 leading-snug">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold" style={{ color: marketColor }}>
            {formatPrice(product.price)}
          </span>
          {product.old_price && product.old_price > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.old_price)}
            </span>
          )}
        </div>

        {/* Footer: market + days badge */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <MarketLogo name={marketName} size="sm" />
            <span className="text-xs font-medium text-gray-500">{marketName}</span>
          </div>
          {product.catalog?.valid_until && (
            <DaysBadge validUntil={product.catalog.valid_until} />
          )}
        </div>
      </div>
    </div>
  )
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'Elektronik': '📱',
    'Gıda': '🛒',
    'Tekstil': '👕',
    'Ev & Yaşam': '🏠',
    'Kişisel Bakım': '🧴',
    'Diğer': '📦',
  }
  return map[category] || '📦'
}
