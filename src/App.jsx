import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import Marquee      from './components/Marquee'
import About        from './components/About'
import Menu         from './components/Menu'
import WhyUs        from './components/WhyUs'
import OrderForm    from './components/OrderForm'
import Testimonials from './components/Testimonials'
import Footer       from './components/Footer'

export default function App() {
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
