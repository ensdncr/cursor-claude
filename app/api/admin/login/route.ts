import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin şifresi yapılandırılmamış' }, { status: 500 })
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Hatalı şifre' }, { status: 401 })
    }

    // Generate a simple session token
    const token = crypto.createHmac('sha256', adminPassword)
      .update(`admin-${Date.now()}`)
      .digest('hex')

    // Store token hash in a way we can verify later
    // In production use a proper session store; here we embed the HMAC of the password
    const sessionToken = Buffer.from(
      JSON.stringify({ valid: true, ts: Date.now(), sig: token.slice(0, 16) })
    ).toString('base64')

    return NextResponse.json({ token: sessionToken })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
