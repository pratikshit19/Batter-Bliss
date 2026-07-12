import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [activeSection, setActive]  = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['home', 'about', 'menu', 'why-us', 'order', 'testimonials']
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); el && obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const links = [
    { id: 'home',   label: 'Home' },
    { id: 'about',  label: 'About' },
    { id: 'menu',   label: 'Menu' },
    { id: 'why-us', label: 'Why Us' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
      scrolled
        ? 'bg-cream-light/95 backdrop-blur-md shadow-[0_2px_20px_rgba(44,26,14,0.09)] py-3'
        : 'py-4 bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <button
          onClick={() => scrollTo('home')}
          aria-label="Go to top"
          className="flex items-center gap-2.5 cursor-pointer"
        >
          {/* SVG Cloche */}
          <svg width="36" height="36" viewBox="0 0 42 42" fill="none">
            <ellipse cx="21" cy="35.5" rx="15" ry="2.2" stroke="#5C3317" strokeWidth="1.4"/>
            <rect x="13" y="32.5" width="16" height="3" rx="1.5" stroke="#5C3317" strokeWidth="1.4"/>
            <path d="M21 7C21 7 10.5 13 10.5 22.5C10.5 28.8 15.2 32.5 21 32.5C26.8 32.5 31.5 28.8 31.5 22.5C31.5 13 21 7 21 7Z"
              stroke="#5C3317" strokeWidth="1.4" fill="none"/>
            <path d="M19 5Q21 3 23 5" stroke="#C4846A" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <circle cx="21" cy="4" r="1.6" fill="#C4846A"/>
            <path d="M17 21Q19 19 21 21Q23 23 25 21" stroke="#C4846A" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
          </svg>
          <span className="flex flex-col leading-none gap-0.5">
            <span className="font-serif text-[0.95rem] font-bold text-brown-dark tracking-wide">Batter</span>
            <span className="script text-[0.85rem] text-rose leading-none">&amp;</span>
            <span className="font-serif text-[0.95rem] font-bold text-brown-dark tracking-wide">Bliss</span>
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`px-4 py-2 rounded-full font-sans text-sm transition-all duration-250 cursor-pointer ${
                  activeSection === id
                    ? 'bg-rose/15 text-brown-dark font-medium'
                    : 'text-brown-mid hover:bg-rose/10 hover:text-brown-dark'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
          <li>
            <button
              id="nav-order-btn"
              onClick={() => scrollTo('order')}
              className="ml-2 px-5 py-2.5 rounded-full bg-brown-dark text-cream-light text-sm font-medium
                         shadow-[0_4px_16px_rgba(44,26,14,0.25)] hover:bg-brown-mid hover:-translate-y-0.5
                         transition-all duration-250 cursor-pointer"
            >
              Order Now 🛍
            </button>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1 cursor-pointer"
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-brown-dark rounded transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}/>
          <span className={`block w-6 h-0.5 bg-brown-dark rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}/>
          <span className={`block w-6 h-0.5 bg-brown-dark rounded transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}/>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden fixed top-0 right-0 h-screen w-72 bg-cream-light shadow-2xl
                       flex flex-col pt-20 pb-8 px-6 gap-2 transition-transform duration-350 z-40 ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {links.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="text-left px-4 py-3 rounded-xl text-brown-mid text-base font-medium
                       hover:bg-rose/10 hover:text-brown-dark transition-all duration-200 cursor-pointer"
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => scrollTo('order')}
          className="mt-4 w-full py-3 rounded-full bg-brown-dark text-cream-light font-medium
                     shadow-md hover:bg-brown-mid transition-all duration-250 cursor-pointer"
        >
          Order Now 🛍
        </button>
      </div>

      {/* Drawer backdrop */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-brown-dark/30 backdrop-blur-sm z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  )
}
