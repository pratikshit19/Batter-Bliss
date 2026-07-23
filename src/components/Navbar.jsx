import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [scrolled,      setScrolled]   = useState(false)
  const [menuOpen,      setMenuOpen]   = useState(false)
  const [activeSection, setActive]     = useState('home')
  const [menuUrl,       setMenuUrl]    = useState(null)

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

  /* Fetch uploaded menu URL from settings */
  useEffect(() => {
    supabase.from('settings').select('value').eq('key', 'menu_url').single()
      .then(({ data }) => { if (data?.value) setMenuUrl(data.value) })
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
          className="flex items-center cursor-pointer"
        >
          <img
            src="/images/logo.png"
            alt="Batter & Bliss"
            className="h-14 w-auto object-contain"
            style={{ mixBlendMode: 'multiply' }}
          />
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
          {/* View Menu — only shown when admin has uploaded a menu */}
          {menuUrl && (
            <li>
              <a
                id="nav-view-menu-btn"
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full font-sans text-sm transition-all duration-250
                           text-brown-mid hover:bg-rose/10 hover:text-brown-dark"
              >
                📋 View Menu
              </a>
            </li>
          )}
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
        {menuUrl && (
          <a
            href={menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="text-left px-4 py-3 rounded-xl text-brown-mid text-base font-medium
                       hover:bg-rose/10 hover:text-brown-dark transition-all duration-200"
          >
            📋 View Menu
          </a>
        )}
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
