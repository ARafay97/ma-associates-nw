import { isAdmin } from '@/lib/auth'
import { listBookings } from '@/lib/bookings'
import LoginForm from './LoginForm'
import Dashboard from './Dashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin | MA Associates NW Ltd',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  if (!(await isAdmin())) return <LoginForm />
  const bookings = await listBookings()
  return <Dashboard initialBookings={bookings} />
}
