import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(_req: NextRequest) {
  try {
    const supabase = createServiceClient()
    const today = new Date().toISOString().split('T')[0]
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const [catalogsRes, productsRes, expiringRes] = await Promise.all([
      supabase
        .from('catalogs')
        .select('id', { count: 'exact' })
        .gte('valid_until', today),
      supabase
        .from('products')
        .select('id', { count: 'exact' }),
      supabase
        .from('catalogs')
        .select('id', { count: 'exact' })
        .gte('valid_until', today)
        .lte('valid_until', nextWeek),
    ])

    return NextResponse.json({
      activeCatalogs: catalogsRes.count ?? 0,
      totalProducts: productsRes.count ?? 0,
      expiringThisWeek: expiringRes.count ?? 0,
    })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
