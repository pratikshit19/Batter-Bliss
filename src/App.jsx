import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import CartDrawer       from './components/CartDrawer'
import Navbar          from './components/Navbar'
import HeroCarousel    from './components/HeroCarousel'
import FestivalSection from './components/FestivalSection'
import Marquee         from './components/Marquee'
import About           from './components/About'
import Menu            from './components/Menu'
import WhyUs           from './components/WhyUs'
import Testimonials    from './components/Testimonials'
import Footer          from './components/Footer'
import AdminLogin      from './pages/AdminLogin'
import AdminDashboard  from './pages/AdminDashboard'
import ProtectedRoute  from './components/ProtectedRoute'
import MenuPage        from './pages/MenuPage'

function MainSite() {
  const location = useLocation()

  /* Scroll to section if navigated here from /menu */
  useEffect(() => {
    const target = location.state?.scrollTo
    if (target) {
      const el = document.getElementById(target)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120)
      }
    }
  }, [location.state])

  return (
    <>
      <Navbar />
      <main>
        <HeroCarousel />
        <FestivalSection />
        <Marquee />
        <Menu />
        <About />
        <Testimonials />
        <WhyUs />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/"            element={<MainSite />} />
        <Route path="/menu"         element={<MenuPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin"       element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
      <CartDrawer />
    </CartProvider>
  )
}
