// Fallback seed data — katalog görseli olmadan demo için
export const FALLBACK_CATALOGS = [
  {
    id: 'c1',
    market_id: 'm1',
    title: 'BİM 3-9 Mart Aktüeli',
    valid_from: '2026-03-03',
    valid_until: '2026-03-09',
    file_url: null,
    file_type: 'image',
    created_at: '',
    market: { name: 'BİM', color_hex: '#FF6B00' },
  },
  {
    id: 'c2',
    market_id: 'm2',
    title: 'A101 Mart Aktüeli',
    valid_from: '2026-03-01',
    valid_until: '2026-03-08',
    file_url: null,
    file_type: 'image',
    created_at: '',
    market: { name: 'A101', color_hex: '#E31E24' },
  },
  {
    id: 'c3',
    market_id: 'm3',
    title: 'ŞOK Bu Hafta',
    valid_from: '2026-03-03',
    valid_until: '2026-03-07',
    file_url: null,
    file_type: 'image',
    created_at: '',
    market: { name: 'ŞOK', color_hex: '#6B1FA2' },
  },
]

export const FALLBACK_MARKETS = [
  { id: 'm1', name: 'BİM', color_hex: '#FF6B00', logo_url: null, created_at: '' },
  { id: 'm2', name: 'A101', color_hex: '#E31E24', logo_url: null, created_at: '' },
  { id: 'm3', name: 'ŞOK', color_hex: '#6B1FA2', logo_url: null, created_at: '' },
]
