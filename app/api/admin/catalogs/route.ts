import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('catalogs')
      .select('*, market:markets(name, color_hex)')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
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

    // Also delete file from storage if exists
    const { data: catalog } = await supabase
      .from('catalogs')
      .select('file_url')
      .eq('id', id)
      .single()

    if (catalog?.file_url) {
      const fileName = catalog.file_url.split('/').pop()
      if (fileName) {
        await supabase.storage.from('catalogs').remove([fileName])
      }
    }

    const { error } = await supabase.from('catalogs').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Silme başarısız' }, { status: 500 })
  }
}
