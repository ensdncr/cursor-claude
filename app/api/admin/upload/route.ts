import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const market = formData.get('market') as string
    const title = formData.get('title') as string
    const validFrom = formData.get('validFrom') as string
    const validUntil = formData.get('validUntil') as string

    if (!file || !market || !title || !validFrom || !validUntil) {
      return NextResponse.json({ error: 'Tüm alanlar gereklidir' }, { status: 400 })
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

    // Upload file to Supabase Storage
    const ext = file.name.split('.').pop()
    const fileName = `${market.toLowerCase()}-${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let fileUrl = ''

    const { error: uploadError } = await supabase.storage
      .from('catalogs')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      // If storage bucket doesn't exist yet, proceed without file URL
      console.warn('Storage upload failed:', uploadError.message)
    } else {
      const { data: urlData } = supabase.storage.from('catalogs').getPublicUrl(fileName)
      fileUrl = urlData.publicUrl
    }

    // Create catalog record
    const { data: catalog, error: catalogError } = await supabase
      .from('catalogs')
      .insert({
        market_id: marketData.id,
        title,
        valid_from: validFrom,
        valid_until: validUntil,
        source_file_url: fileUrl || null,
      })
      .select('id')
      .single()

    if (catalogError || !catalog) {
      throw catalogError || new Error('Katalog oluşturulamadı')
    }

    return NextResponse.json({
      catalogId: catalog.id,
      fileUrl,
    })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message || 'Yükleme başarısız' }, { status: 500 })
  }
}
