import 'server-only'
import crypto from 'crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'ma_admin_session'
const SESSION_HOURS = 12

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s || s.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be set and at least 32 characters long')
  }
  return s
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url')
}

// Compare two strings without leaking how many characters matched
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest()
  const hb = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(ha, hb)
}

export function checkCredentials(username, password) {
  const u = process.env.ADMIN_USERNAME
  const p = process.env.ADMIN_PASSWORD
  if (!u || !p) return false
  // evaluate both so timing doesn't reveal which one was wrong
  const okUser = safeEqual(username ?? '', u)
  const okPass = safeEqual(password ?? '', p)
  return okUser && okPass
}

export function createSessionToken() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000
  const payload = `admin.${expires}`
  return { token: `${payload}.${sign(payload)}`, expires: new Date(expires) }
}

export function verifySessionToken(token) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [who, expires, sig] = parts
  const payload = `${who}.${expires}`
  if (!safeEqual(sig, sign(payload))) return false
  return who === 'admin' && Number(expires) > Date.now()
}

export async function isAdmin() {
  const store = await cookies()
  try {
    return verifySessionToken(store.get(SESSION_COOKIE)?.value)
  } catch {
    return false
  }
}

export const cookieOptions = (expires) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  expires,
})
