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

    // Determine file type
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    const fileType = isPdf ? 'pdf' : 'image'
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${market.toLowerCase()}-${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()

    let fileUrl: string | null = null

    const { error: uploadError } = await supabase.storage
      .from('catalogs')
      .upload(fileName, Buffer.from(bytes), {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
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
        file_url: fileUrl,
        file_type: fileType,
      })
      .select('id')
      .single()

    if (catalogError || !catalog) {
      throw catalogError || new Error('Katalog oluşturulamadı')
    }

    return NextResponse.json({ catalogId: catalog.id, fileUrl })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message || 'Yükleme başarısız' }, { status: 500 })
  }
}
