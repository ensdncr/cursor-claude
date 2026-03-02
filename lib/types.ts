export interface Market {
  id: string
  name: string
  logo_url: string | null
  color_hex: string
  created_at: string
}

export interface Catalog {
  id: string
  market_id: string
  title: string
  valid_from: string
  valid_until: string
  source_file_url: string | null
  created_at: string
  market?: Market
}

export interface Product {
  id: string
  catalog_id: string
  market_id: string
  name: string
  price: number
  old_price: number | null
  category: string
  image_url: string | null
  created_at: string
  catalog?: Catalog
  market?: Market
}

export interface Category {
  id: string
  name: string
}

export type MarketName = 'BİM' | 'A101' | 'ŞOK'

export const MARKET_COLORS: Record<string, string> = {
  'BİM': '#FF6B00',
  'A101': '#E31E24',
  'ŞOK': '#6B1FA2',
}

export const CATEGORIES = [
  'Elektronik',
  'Gıda',
  'Tekstil',
  'Ev & Yaşam',
  'Kişisel Bakım',
  'Diğer',
] as const

export type CategoryName = typeof CATEGORIES[number]
