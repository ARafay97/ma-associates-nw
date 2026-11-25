'use client'

import { useState } from 'react'
import { serviceOptions, timeSlots } from '@/lib/services'

const inputClass =
  'w-full rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
const labelClass = 'mb-2 block text-sm font-semibold uppercase tracking-widest text-blue-800'

function today() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export default function Booking() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      form.reset()
      setStatus('sent')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <section id="book" className="border-t-2 border-blue-100 bg-blue-50/40 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold text-blue-800 sm:text-4xl">Book a Consultation</h2>
        <div className="mx-auto mb-4 mt-4 h-1 w-16 rounded-full bg-blue-600" />
        <p className="mb-12 text-center text-slate-600">
          Tell us about your project and pick a time that suits you. We&apos;ll be in touch to confirm.
        </p>

        {status === 'sent' ? (
          <div className="rounded-2xl border-2 border-blue-700 bg-blue-600 p-10 text-center shadow-xl shadow-blue-200">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white" />
            <h3 className="mb-3 text-2xl font-semibold text-white">Thanks, your booking is in!</h3>
            <p className="text-blue-50">We&apos;ll get back to you shortly to confirm your appointment.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 rounded-full border-2 border-white bg-white px-8 py-3 font-semibold text-blue-700 transition-all duration-300 hover:bg-blue-800 hover:text-white"
            >
              Make another booking
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-6 rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-xl shadow-blue-100 sm:grid-cols-2"
          >
            <div>
              <label htmlFor="name" className={labelClass}>Name</label>
              <input id="name" name="name" required maxLength={100} className={inputClass} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input id="email" name="email" type="email" required maxLength={200} className={inputClass} autoComplete="email" />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone</label>
              <input id="phone" name="phone" type="tel" maxLength={30} className={inputClass} autoComplete="tel" />
            </div>
            <div>
              <label htmlFor="service" className={labelClass}>Service</label>
              <select id="service" name="service" required defaultValue="" className={inputClass}>
                <option value="" disabled>Choose a service</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className={labelClass}>Preferred date</label>
              <input id="date" name="date" type="date" required min={today()} className={inputClass} />
            </div>
            <div>
              <label htmlFor="time" className={labelClass}>Preferred time</label>
              <select id="time" name="time" required defaultValue="" className={inputClass}>
                <option value="" disabled>Choose a time</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className={labelClass}>About your project</label>
              <textarea id="message" name="message" rows={4} maxLength={2000} className={inputClass} />
            </div>
            {/* honeypot: hidden from people, bots tend to fill it in */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            {status === 'error' && (
              <p className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-red-700 sm:col-span-2">{error}</p>
            )}

            <div className="text-center sm:col-span-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="rounded-full border-2 border-blue-700 bg-blue-600 px-10 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Request booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
