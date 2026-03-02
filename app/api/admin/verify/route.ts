import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Token gerekli' }, { status: 401 })
    }

    // Decode and validate token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())

    // Token expires after 24 hours
    const MAX_AGE = 24 * 60 * 60 * 1000
    if (!decoded.valid || Date.now() - decoded.ts > MAX_AGE) {
      return NextResponse.json({ error: 'Token geçersiz veya süresi dolmuş' }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
  } catch {
    return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 })
  }
}
