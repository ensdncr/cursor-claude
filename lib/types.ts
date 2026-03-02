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
  file_url: string | null
  file_type: string | null
  created_at: string
  market?: Market
}

export type MarketName = 'BİM' | 'A101' | 'ŞOK'

export const MARKET_COLORS: Record<string, string> = {
  'BİM': '#FF6B00',
  'A101': '#E31E24',
  'ŞOK': '#6B1FA2',
}
