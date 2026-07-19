import { Routes, Route } from 'react-router-dom'
import Navbar          from './components/Navbar'
import Hero            from './components/Hero'
import Marquee         from './components/Marquee'
import About           from './components/About'
import Menu            from './components/Menu'
import WhyUs           from './components/WhyUs'
import OrderForm       from './components/OrderForm'
import Testimonials    from './components/Testimonials'
import Footer          from './components/Footer'
import AdminLogin      from './pages/AdminLogin'
import AdminDashboard  from './pages/AdminDashboard'
import ProtectedRoute  from './components/ProtectedRoute'

function MainSite() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Menu />
        <WhyUs />
        <OrderForm />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<MainSite />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin"       element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  )
}
