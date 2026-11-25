'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = ['new', 'confirmed', 'completed', 'cancelled']

const badge = {
  new: 'bg-blue-600 text-white',
  confirmed: 'bg-emerald-600 text-white',
  completed: 'bg-slate-500 text-white',
  cancelled: 'bg-red-100 text-red-700',
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatStamp(iso) {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function Dashboard({ initialBookings }) {
  const router = useRouter()
  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState('')

  const counts = useMemo(() => {
    const c = { all: bookings.length }
    for (const s of STATUSES) c[s] = bookings.filter((b) => b.status === s).length
    return c
  }, [bookings])

  const visible = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  async function call(id, method, body) {
    setBusy(id)
    setError('')
    const res = await fetch(`/api/bookings/${id}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    setBusy(null)
    if (res.status === 401) {
      router.refresh() // session expired → back to login
      return null
    }
    if (!res.ok) {
      setError('That didn’t work. Please try again.')
      return null
    }
    return res.json()
  }

  async function setStatus(id, status) {
    const data = await call(id, 'PATCH', { status })
    if (data) setBookings((list) => list.map((b) => (b.id === id ? data.booking : b)))
  }

  async function remove(id) {
    if (!window.confirm('Delete this booking? This can’t be undone.')) return
    const data = await call(id, 'DELETE')
    if (data) setBookings((list) => list.filter((b) => b.id !== id))
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-blue-50/40">
      <header className="border-b-2 border-blue-800 bg-blue-600 shadow-lg shadow-blue-900/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="text-lg font-bold tracking-wide text-white hover:text-blue-100">
            MA ASSOCIATES <span className="font-medium text-blue-100">· Admin</span>
          </a>
          <button
            onClick={logout}
            className="rounded-full border border-blue-300/60 bg-blue-500 px-5 py-2 font-medium text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-blue-700"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold text-blue-800 sm:text-4xl">Bookings</h1>
        <div className="mb-8 mt-4 h-1 w-16 rounded-full bg-blue-600" />

        <div className="mb-8 flex flex-wrap gap-2">
          {['all', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold capitalize transition ${
                filter === s
                  ? 'border-blue-700 bg-blue-600 text-white'
                  : 'border-blue-200 bg-white text-blue-800 hover:border-blue-600'
              }`}
            >
              {s} ({counts[s]})
            </button>
          ))}
        </div>

        {error && <p className="mb-6 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p>}

        {visible.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-white p-12 text-center text-slate-500">
            {bookings.length === 0 ? 'No bookings yet.' : 'No bookings with this status.'}
          </div>
        ) : (
          <div className="grid gap-5">
            {visible.map((b) => (
              <article
                key={b.id}
                className={`rounded-2xl border-2 border-blue-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:shadow-blue-100 ${
                  busy === b.id ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-blue-900">{b.name}</h2>
                      <span className={`rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${badge[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-blue-700">
                      {formatDate(b.date)} · {b.time}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{b.service}</p>
                  </div>
                  <div className="text-right text-sm">
                    <a href={`mailto:${b.email}`} className="block break-all font-medium text-blue-700 hover:underline">
                      {b.email}
                    </a>
                    {b.phone && (
                      <a href={`tel:${b.phone.replace(/\s/g, '')}`} className="block text-blue-700 hover:underline">
                        {b.phone}
                      </a>
                    )}
                    <p className="mt-1 text-xs text-slate-400">Received {formatStamp(b.createdAt)}</p>
                  </div>
                </div>

                {b.message && (
                  <p className="mt-4 whitespace-pre-wrap rounded-xl bg-blue-50 p-4 text-slate-700">{b.message}</p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {STATUSES.filter((s) => s !== b.status).map((s) => (
                    <button
                      key={s}
                      disabled={busy === b.id}
                      onClick={() => setStatus(b.id, s)}
                      className="rounded-full border-2 border-blue-200 px-4 py-1.5 text-sm font-semibold capitalize text-blue-800 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      Mark {s}
                    </button>
                  ))}
                  <button
                    disabled={busy === b.id}
                    onClick={() => remove(b.id)}
                    className="ml-auto rounded-full border-2 border-red-200 px-4 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
