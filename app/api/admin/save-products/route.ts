import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

interface ProductInput {
  name: string
  price: number
  old_price: number | null
  category: string
}

export async function POST(req: NextRequest) {
  try {
    const { catalogId, market, products } = await req.json()

    if (!catalogId || !market || !products || products.length === 0) {
      return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get market ID
    const { data: marketData, error: marketError } = await supabase
      .from('markets')
      .select('id')
      .eq('name', market)
      .single()

    if (marketError || !marketData) {
      return NextResponse.json({ error: 'Market bulunamadı' }, { status: 404 })
    }

    // Insert all products
    const productsToInsert = products.map((p: ProductInput) => ({
      catalog_id: catalogId,
      market_id: marketData.id,
      name: p.name.trim(),
      price: Math.max(0, p.price),
      old_price: p.old_price ? Math.max(0, p.old_price) : null,
      category: p.category || 'Diğer',
    }))

    const { data, error } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select('id')

    if (error) throw error

    return NextResponse.json({
      success: true,
      count: data?.length ?? 0,
    })
  } catch (err: any) {
    console.error('Save products error:', err)
    return NextResponse.json({ error: err.message || 'Kayıt başarısız' }, { status: 500 })
  }
}
