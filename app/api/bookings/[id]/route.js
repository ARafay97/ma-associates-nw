import { NextResponse } from 'next/server'
import { deleteBooking, STATUSES, updateBookingStatus } from '@/lib/bookings'
import { isAdmin } from '@/lib/auth'

const unauthorised = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

export async function PATCH(request, { params }) {
  if (!(await isAdmin())) return unauthorised()
  const { id } = await params
  const { status } = await request.json().catch(() => ({}))
  if (!STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const booking = await updateBookingStatus(id, status)
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ booking })
}

export async function DELETE(_request, { params }) {
  if (!(await isAdmin())) return unauthorised()
  const { id } = await params
  const ok = await deleteBooking(id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
