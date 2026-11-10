import { useState } from 'react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Our Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

const services = [
  { title: 'Brand Identity', text: 'Logos, colour palettes and brand guidelines that give your business a look people remember.' },
  { title: 'Print Design', text: 'Brochures, flyers, business cards, posters and signage, designed and ready for print.' },
  { title: 'Digital Graphics', text: 'Social media graphics, web banners and marketing visuals that stand out online.' },
]

function Navbar() {
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

function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24"
    >
      {/* soft blue shapes behind the glass so the blur effect is visible */}
      <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl" />
      <div className="absolute -right-10 bottom-20 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-2xl" />

      <div className="group relative w-full max-w-4xl rounded-3xl border-2 border-blue-300/70 bg-blue-600/60 p-[50px] text-center shadow-xl shadow-blue-300/50 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white hover:bg-blue-600/70 hover:shadow-2xl hover:shadow-blue-400/60">
        <h1 className="text-4xl font-extrabold tracking-tight text-white opacity-50 transition-opacity duration-500 group-hover:opacity-80 sm:text-6xl md:text-7xl">
          MA ASSOCIATES NW LTD
        </h1>
        <div className="mx-auto my-6 h-1 w-24 rounded-full bg-white transition-all duration-500 group-hover:w-48" />
        <p className="text-lg text-blue-50">Graphic design that makes your brand stand out.</p>
        <a
          href="#contact"
          className="mt-8 inline-block rounded-full border-2 border-white bg-white px-8 py-3 font-semibold text-blue-700 transition-all duration-300 hover:bg-blue-800 hover:text-white hover:shadow-lg hover:shadow-blue-900/30"
        >
          Get in touch
        </a>
      </div>
    </section>
  )
}

function OurWork() {
  return (
    <section id="work" className="border-t-2 border-blue-100 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-blue-800 sm:text-4xl">Our Work</h2>
        <div className="mx-auto mb-12 mt-4 h-1 w-16 rounded-full bg-blue-600" />
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border-2 border-blue-700 bg-blue-600 p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300"
            >
              <div className="mb-4 h-1 w-10 rounded-full bg-white" />
              <h3 className="mb-3 text-xl font-semibold text-white">{s.title}</h3>
              <p className="text-blue-50">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="border-t-2 border-blue-100 bg-blue-50/40 px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-blue-800 sm:text-4xl">Contact</h2>
        <div className="mx-auto mb-12 mt-4 h-1 w-16 rounded-full bg-blue-600" />
        <div className="grid gap-6 sm:grid-cols-2">
          <a
            href="mailto:atifali@live.co.uk"
            className="rounded-2xl border-2 border-blue-700 bg-blue-600 p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-100">Email</p>
            <p className="break-all text-lg font-medium text-white">atifali@live.co.uk</p>
          </a>
          <a
            href="tel:07921818214"
            className="rounded-2xl border-2 border-blue-700 bg-blue-600 p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-100">Phone</p>
            <p className="text-lg font-medium text-white">07921 818214</p>
          </a>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />
      <main>
        <Hero />
        <OurWork />
        <Contact />
      </main>
      <footer className="border-t-2 border-blue-600 bg-white py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} MA Associates NW Ltd. All rights reserved.
      </footer>
    </div>
  )
}
