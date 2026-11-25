import 'server-only'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { serviceOptions, timeSlots } from '@/lib/services'

// Bookings live in a single JSON file. Override the location with BOOKINGS_FILE if needed.
const FILE = process.env.BOOKINGS_FILE || path.join(/*turbopackIgnore: true*/ process.cwd(), 'data', 'bookings.json')

export const STATUSES = ['new', 'confirmed', 'completed', 'cancelled']

// Serialise writes so two requests at once can't overwrite each other
let queue = Promise.resolve()
function withLock(fn) {
  const run = queue.then(fn, fn)
  queue = run.catch(() => {})
  return run
}

async function readAll() {
  try {
    const raw = await fs.readFile(/*turbopackIgnore: true*/ FILE, 'utf8')
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function writeAll(bookings) {
  await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(FILE), { recursive: true })
  const tmp = `${FILE}.${process.pid}.tmp`
  await fs.writeFile(/*turbopackIgnore: true*/ tmp, JSON.stringify(bookings, null, 2))
  await fs.rename(/*turbopackIgnore: true*/ tmp, FILE) // atomic replace, so a crash never leaves a half-written file
}

export async function listBookings() {
  const all = await readAll()
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export function validateBooking(input) {
  const b = {
    name: clean(input.name, 100),
    email: clean(input.email, 200),
    phone: clean(input.phone, 30),
    service: clean(input.service, 100),
    date: clean(input.date, 10),
    time: clean(input.time, 50),
    message: clean(input.message, 2000),
  }
  if (!b.name) return { error: 'Please enter your name.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) return { error: 'Please enter a valid email address.' }
  if (b.phone && !/^[0-9+()\s-]{6,30}$/.test(b.phone)) return { error: 'Please enter a valid phone number.' }
  if (!serviceOptions.includes(b.service)) return { error: 'Please choose a service.' }
  if (!timeSlots.includes(b.time)) return { error: 'Please choose a time.' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date) || Number.isNaN(Date.parse(b.date))) {
    return { error: 'Please choose a valid date.' }
  }
  const todayStr = new Date().toISOString().slice(0, 10)
  if (b.date < todayStr) return { error: 'Please choose a date in the future.' }
  return { booking: b }
}

export function createBooking(data) {
  return withLock(async () => {
    const all = await readAll()
    const booking = {
      id: crypto.randomUUID(),
      ...data,
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    all.push(booking)
    await writeAll(all)
    return booking
  })
}

export function updateBookingStatus(id, status) {
  return withLock(async () => {
    const all = await readAll()
    const booking = all.find((b) => b.id === id)
    if (!booking) return null
    booking.status = status
    booking.updatedAt = new Date().toISOString()
    await writeAll(all)
    return booking
  })
}

export function deleteBooking(id) {
  return withLock(async () => {
    const all = await readAll()
    const next = all.filter((b) => b.id !== id)
    if (next.length === all.length) return false
    await writeAll(next)
    return true
  })
}
