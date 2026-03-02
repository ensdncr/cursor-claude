import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(_req: NextRequest) {
  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('catalogs')
      .select(`
        *,
        market:markets(name, color_hex),
        products(id)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const catalogs = (data || []).map((c: any) => ({
      ...c,
      product_count: c.products?.length ?? 0,
      products: undefined,
    }))

    return NextResponse.json(catalogs)
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Katalog ID gerekli' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase.from('catalogs').delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Silme başarısız' }, { status: 500 })
  }
}
