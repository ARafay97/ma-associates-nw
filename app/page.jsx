import Navbar from '@/components/Navbar'
import Booking from '@/components/Booking'
import { Hero, OurWork, Contact, Footer } from '@/components/Sections'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <OurWork />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
