'use client'

import { useState } from 'react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Our Work', href: '#work' },
  { label: 'Book', href: '#book' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-blue-800 bg-blue-600/90 shadow-lg shadow-blue-900/20 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="text-lg font-bold tracking-wide text-white transition-colors hover:text-blue-100">
          MA ASSOCIATES
        </a>

        <button
          className="rounded-md border border-white px-3 py-1 text-white transition hover:bg-white hover:text-blue-700 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>

        <ul className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col gap-2 border-b-2 border-blue-800 bg-blue-600 px-6 py-4 md:static md:flex md:w-auto md:flex-row md:gap-2 md:border-0 md:bg-transparent md:p-0`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-full border border-blue-300/60 bg-blue-500 px-5 py-2 font-medium text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-blue-700"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
