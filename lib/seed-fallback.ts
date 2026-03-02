// Fallback seed data — used when Supabase is unreachable (e.g. no internet access)
export const FALLBACK_PRODUCTS = [
  // BİM
  {
    id: 'p1', catalog_id: 'c1', market_id: 'm1',
    name: 'BİM Blender 1000W', price: 299.90, old_price: 449.90,
    category: 'Elektronik', image_url: null, created_at: '',
    market: { name: 'BİM', color_hex: '#FF6B00' },
    catalog: { valid_until: '2026-03-09', title: 'BİM 3-9 Mart Aktüeli' },
  },
  {
    id: 'p2', catalog_id: 'c1', market_id: 'm1',
    name: "Çikolatalı Gofret 3'lü", price: 24.90, old_price: null,
    category: 'Gıda', image_url: null, created_at: '',
    market: { name: 'BİM', color_hex: '#FF6B00' },
    catalog: { valid_until: '2026-03-09', title: 'BİM 3-9 Mart Aktüeli' },
  },
  {
    id: 'p3', catalog_id: 'c1', market_id: 'm1',
    name: 'Erkek Spor Ayakkabı', price: 199.90, old_price: 299.90,
    category: 'Tekstil', image_url: null, created_at: '',
    market: { name: 'BİM', color_hex: '#FF6B00' },
    catalog: { valid_until: '2026-03-09', title: 'BİM 3-9 Mart Aktüeli' },
  },
  {
    id: 'p4', catalog_id: 'c1', market_id: 'm1',
    name: 'Yapışmaz Tava 28cm', price: 149.90, old_price: null,
    category: 'Ev & Yaşam', image_url: null, created_at: '',
    market: { name: 'BİM', color_hex: '#FF6B00' },
    catalog: { valid_until: '2026-03-09', title: 'BİM 3-9 Mart Aktüeli' },
  },
  {
    id: 'p5', catalog_id: 'c1', market_id: 'm1',
    name: 'Şampuan 400ml', price: 39.90, old_price: 59.90,
    category: 'Kişisel Bakım', image_url: null, created_at: '',
    market: { name: 'BİM', color_hex: '#FF6B00' },
    catalog: { valid_until: '2026-03-09', title: 'BİM 3-9 Mart Aktüeli' },
  },
  // A101
  {
    id: 'p6', catalog_id: 'c2', market_id: 'm2',
    name: 'A101 Airfryer 4L', price: 799.90, old_price: 1199.90,
    category: 'Elektronik', image_url: null, created_at: '',
    market: { name: 'A101', color_hex: '#E31E24' },
    catalog: { valid_until: '2026-03-08', title: 'A101 Mart Aktüeli' },
  },
  {
    id: 'p7', catalog_id: 'c2', market_id: 'm2',
    name: 'Zeytinyağı 1L', price: 189.90, old_price: 219.90,
    category: 'Gıda', image_url: null, created_at: '',
    market: { name: 'A101', color_hex: '#E31E24' },
    catalog: { valid_until: '2026-03-08', title: 'A101 Mart Aktüeli' },
  },
  {
    id: 'p8', catalog_id: 'c2', market_id: 'm2',
    name: 'Kadın Pijama Takımı', price: 249.90, old_price: 349.90,
    category: 'Tekstil', image_url: null, created_at: '',
    market: { name: 'A101', color_hex: '#E31E24' },
    catalog: { valid_until: '2026-03-08', title: 'A101 Mart Aktüeli' },
  },
  {
    id: 'p9', catalog_id: 'c2', market_id: 'm2',
    name: 'Robot Süpürge', price: 1299.90, old_price: 1999.90,
    category: 'Ev & Yaşam', image_url: null, created_at: '',
    market: { name: 'A101', color_hex: '#E31E24' },
    catalog: { valid_until: '2026-03-08', title: 'A101 Mart Aktüeli' },
  },
  {
    id: 'p10', catalog_id: 'c2', market_id: 'm2',
    name: "Diş Fırçası 3'lü", price: 29.90, old_price: null,
    category: 'Kişisel Bakım', image_url: null, created_at: '',
    market: { name: 'A101', color_hex: '#E31E24' },
    catalog: { valid_until: '2026-03-08', title: 'A101 Mart Aktüeli' },
  },
  // ŞOK
  {
    id: 'p11', catalog_id: 'c3', market_id: 'm3',
    name: 'ŞOK Çamaşır Makinesi 8kg', price: 8499.90, old_price: 12999.90,
    category: 'Ev & Yaşam', image_url: null, created_at: '',
    market: { name: 'ŞOK', color_hex: '#6B1FA2' },
    catalog: { valid_until: '2026-03-07', title: 'ŞOK Bu Hafta' },
  },
  {
    id: 'p12', catalog_id: 'c3', market_id: 'm3',
    name: 'Fındıklı Çikolata 100g', price: 19.90, old_price: 24.90,
    category: 'Gıda', image_url: null, created_at: '',
    market: { name: 'ŞOK', color_hex: '#6B1FA2' },
    catalog: { valid_until: '2026-03-07', title: 'ŞOK Bu Hafta' },
  },
  {
    id: 'p13', catalog_id: 'c3', market_id: 'm3',
    name: 'Erkek Polar Hırka', price: 299.90, old_price: null,
    category: 'Tekstil', image_url: null, created_at: '',
    market: { name: 'ŞOK', color_hex: '#6B1FA2' },
    catalog: { valid_until: '2026-03-07', title: 'ŞOK Bu Hafta' },
  },
  {
    id: 'p14', catalog_id: 'c3', market_id: 'm3',
    name: 'Kablosuz Kulaklık', price: 449.90, old_price: 699.90,
    category: 'Elektronik', image_url: null, created_at: '',
    market: { name: 'ŞOK', color_hex: '#6B1FA2' },
    catalog: { valid_until: '2026-03-07', title: 'ŞOK Bu Hafta' },
  },
  {
    id: 'p15', catalog_id: 'c3', market_id: 'm3',
    name: 'Duş Jeli 500ml', price: 44.90, old_price: 64.90,
    category: 'Kişisel Bakım', image_url: null, created_at: '',
    market: { name: 'ŞOK', color_hex: '#6B1FA2' },
    catalog: { valid_until: '2026-03-07', title: 'ŞOK Bu Hafta' },
  },
]

export const FALLBACK_MARKETS = [
  { id: 'm1', name: 'BİM', color_hex: '#FF6B00', logo_url: null, created_at: '' },
  { id: 'm2', name: 'A101', color_hex: '#E31E24', logo_url: null, created_at: '' },
  { id: 'm3', name: 'ŞOK', color_hex: '#6B1FA2', logo_url: null, created_at: '' },
]
