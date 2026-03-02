import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const EXTRACT_PROMPT = `Bu market aktüel kataloğundan tüm ürünleri çıkar. Her ürün için: name (string), price (sadece sayı, float), old_price (varsa sayı, yoksa null), category (Elektronik/Gıda/Tekstil/Ev & Yaşam/Kişisel Bakım/Diğer'den biri) döndür. Sadece JSON array döndür, başka metin ekleme. Örnek format: [{"name":"Ürün Adı","price":29.90,"old_price":49.90,"category":"Gıda"}]`

export async function POST(req: NextRequest) {
  try {
    const { fileUrl, catalogId } = await req.json()

    if (!fileUrl && !catalogId) {
      return NextResponse.json({ error: 'Dosya URL veya katalog ID gerekli' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return mock data for testing when API key is not set
      return NextResponse.json({
        products: getMockProducts(),
      })
    }

    let messageContent: Anthropic.MessageParam['content']

    if (fileUrl && (fileUrl.includes('.jpg') || fileUrl.includes('.jpeg') || fileUrl.includes('.png'))) {
      // Image file - fetch and send as base64
      const imageRes = await fetch(fileUrl)
      if (!imageRes.ok) {
        throw new Error('Görüntü dosyası yüklenemedi')
      }
      const imageBuffer = await imageRes.arrayBuffer()
      const base64 = Buffer.from(imageBuffer).toString('base64')
      const mediaType = fileUrl.includes('.png') ? 'image/png' : 'image/jpeg'

      messageContent = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64,
          },
        },
        {
          type: 'text',
          text: EXTRACT_PROMPT,
        },
      ]
    } else if (fileUrl && fileUrl.includes('.pdf')) {
      // PDF file - fetch and send as base64
      const pdfRes = await fetch(fileUrl)
      if (!pdfRes.ok) {
        throw new Error('PDF dosyası yüklenemedi')
      }
      const pdfBuffer = await pdfRes.arrayBuffer()
      const base64 = Buffer.from(pdfBuffer).toString('base64')

      messageContent = [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: base64,
          },
        } as any,
        {
          type: 'text',
          text: EXTRACT_PROMPT,
        },
      ]
    } else {
      // No valid file, return mock data
      return NextResponse.json({ products: getMockProducts() })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: messageContent,
        },
      ],
    })

    const responseText = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('')

    // Parse JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Geçerli ürün listesi bulunamadı')
    }

    const products = JSON.parse(jsonMatch[0])

    return NextResponse.json({ products })
  } catch (err: any) {
    console.error('Extract error:', err)

    // Return mock data on error for demo purposes
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ products: getMockProducts() })
    }

    return NextResponse.json({ error: err.message || 'Ürün çıkarma başarısız' }, { status: 500 })
  }
}

function getMockProducts() {
  return [
    { name: 'Örnek Ürün 1', price: 99.90, old_price: 149.90, category: 'Elektronik' },
    { name: 'Örnek Ürün 2', price: 24.90, old_price: null, category: 'Gıda' },
    { name: 'Örnek Ürün 3', price: 199.90, old_price: 299.90, category: 'Tekstil' },
    { name: 'Örnek Ürün 4', price: 79.90, old_price: null, category: 'Ev & Yaşam' },
    { name: 'Örnek Ürün 5', price: 39.90, old_price: 59.90, category: 'Kişisel Bakım' },
  ]
}
