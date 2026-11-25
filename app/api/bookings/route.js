import { NextResponse } from 'next/server'
import { createBooking, listBookings, validateBooking } from '@/lib/bookings'
import { isAdmin } from '@/lib/auth'

// Public: customers submit a booking
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // honeypot field filled in → almost certainly a bot; pretend it worked
  if (body?.company) return NextResponse.json({ ok: true })

  const { booking, error } = validateBooking(body || {})
  if (error) return NextResponse.json({ error }, { status: 400 })

  await createBooking(booking)
  return NextResponse.json({ ok: true }, { status: 201 })
}

// Admin only: list every booking
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  return NextResponse.json({ bookings: await listBookings() })
}
