import { NextResponse } from 'next/server'
import { checkCredentials, cookieOptions, createSessionToken, SESSION_COOKIE } from '@/lib/auth'

// Basic brute-force protection: 5 failed attempts per IP every 15 minutes
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5
const attempts = new Map()

function clientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
}

export async function POST(request) {
  const ip = clientIp(request)
  const now = Date.now()
  const entry = attempts.get(ip)
  if (entry && now - entry.first < WINDOW_MS && entry.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 })
  }

  const { username, password } = await request.json().catch(() => ({}))

  if (!checkCredentials(username, password)) {
    if (!entry || now - entry.first >= WINDOW_MS) attempts.set(ip, { first: now, count: 1 })
    else entry.count++
    return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 })
  }

  attempts.delete(ip)
  try {
    const { token, expires } = createSessionToken()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(SESSION_COOKIE, token, cookieOptions(expires))
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Admin login is not configured on the server.' }, { status: 500 })
  }
}
