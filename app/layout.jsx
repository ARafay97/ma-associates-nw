import './globals.css'

export const metadata = {
  title: 'MA Associates NW Ltd | Graphic Design',
  description: 'Graphic design that makes your brand stand out.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-800">{children}</body>
    </html>
  )
}
