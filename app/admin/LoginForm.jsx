'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass =
  'w-full rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    })
    if (res.ok) {
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Login failed.')
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl" />
      <div className="absolute -right-10 bottom-20 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-3xl border-2 border-blue-300/70 bg-blue-600/60 p-10 shadow-xl shadow-blue-300/50 backdrop-blur-xl"
      >
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-white">Admin Login</h1>
        <div className="mx-auto mb-8 mt-4 h-1 w-16 rounded-full bg-white" />

        <label htmlFor="username" className="mb-2 block text-sm font-semibold uppercase tracking-widest text-blue-50">
          Username
        </label>
        <input id="username" name="username" required autoComplete="username" className={`${inputClass} mb-5`} />

        <label htmlFor="password" className="mb-2 block text-sm font-semibold uppercase tracking-widest text-blue-50">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={inputClass} />

        {error && <p className="mt-5 rounded-xl bg-white/90 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-full border-2 border-white bg-white px-8 py-3 font-semibold text-blue-700 transition-all duration-300 hover:bg-blue-800 hover:text-white disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
