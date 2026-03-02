import { createServiceClient } from '@/lib/supabase'
import { FALLBACK_CATALOGS } from '@/lib/seed-fallback'
import CatalogGrid from '@/components/CatalogGrid'
import MarketLogo from '@/components/MarketLogo'
import PwaBanner from '@/components/PwaBanner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>(resolve => setTimeout(() => resolve(fallback), ms)),
  ])
}

async function fetchCatalogs() {
  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('catalogs')
    .select('*, market:markets(name, color_hex)')
    .gte('valid_until', today)
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) return FALLBACK_CATALOGS
  return data
}

async function getCatalogs() {
  return withTimeout(fetchCatalogs(), 2500, FALLBACK_CATALOGS)
}

const MARKETS_INFO = [
  { name: 'BİM', desc: 'Turuncu fırsatlar' },
  { name: 'A101', desc: 'Kırmızı indirimler' },
  { name: 'ŞOK', desc: 'Mor kampanyalar' },
]

export default async function HomePage() {
  const catalogs = await getCatalogs()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">AT</span>
            </div>
            <h1 className="font-bold text-gray-900 text-lg">Aktüel Takip</h1>
          </div>
          <div className="flex items-center gap-1">
            {MARKETS_INFO.map(m => <MarketLogo key={m.name} name={m.name} size="sm" />)}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-red-50 to-purple-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Bu haftanın aktüel katalogları 🛒
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mb-8">
            BİM, A101 ve ŞOK&apos;un güncel katalogları tek yerde — tıkla, incele
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {MARKETS_INFO.map(m => (
              <div key={m.name} className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
                <MarketLogo name={m.name} size="md" />
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                  <p className="text-gray-400 text-xs">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogs */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <CatalogGrid catalogs={catalogs as any} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Aktüel Takip · BİM, A101 ve ŞOK ile resmi bir bağlantımız yoktur.
          </p>
        </div>
      </footer>

      <PwaBanner />
    </div>
  )
}
