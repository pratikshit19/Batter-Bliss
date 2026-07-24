import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CATEGORY_STRIP = [
  { label: 'Rakhi Special', action: 'rakhi', badge: 'NEW' },
  { label: 'Brownies', action: 'brownies' },
  { label: 'Tea Cakes', action: 'tea-cakes' },
  { label: 'Guilt-Free', action: 'guilt-free' },
  { label: 'Cake Jars', action: 'cake-jars' },
  { label: 'Our Story', action: 'about' },
  { label: 'Why Us', action: 'why-us' }
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMenuPage = location.pathname === '/menu'
  const { totalItems, setIsCartOpen } = useCart()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (action) => {
    if (action === 'about' || action === 'why-us') {
      if (isMenuPage) {
        navigate('/', { state: { scrollTo: action } })
      } else {
        document.getElementById(action)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/menu')
    }
    setMenuOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate('/menu')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md">

      {/* ── TIER 1: Bakingo Top Header Bar ───────────────────────────────────── */}
      <div className="bg-brown-dark text-cream py-2.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-6">

          {/* Logo & City Selector */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => navigate('/')}
              aria-label="Batter & Bliss Home"
              className="flex items-center cursor-pointer"
            >
              <img
                src="/images/logo.png"
                alt="Batter & Bliss"
                className="h-10 sm:h-12 w-auto object-contain brightness-125"
                style={{ mixBlendMode: 'screen' }}
              />
            </button>

            {/* City Selector */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-cream/90 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 cursor-pointer hover:bg-white/20 transition-colors">
              <span className="text-rose text-sm">📍</span>
              <span className="font-medium">Delivering To: <strong className="text-cream font-bold">Delhi NCR</strong></span>
              <span className="text-[0.65rem] text-cream/70 ml-0.5">▼</span>
            </div>
          </div>

          {/* Search Bar (Centered, Bakingo Style) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md relative hidden md:block"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search For Brownies, Tea Cakes, Hampers..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white text-brown-dark text-xs placeholder-brown-light/60 font-sans focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all shadow-inner"
            />
            <span className="absolute left-3 top-2.5 text-brown-light/60 text-xs">🔍</span>
          </form>

          {/* Right Action Icons (WhatsApp & Cart) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">

            {/* WhatsApp Direct Link */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-cream/90 hover:text-cream font-medium bg-white/10 px-3 py-1.5 rounded-full border border-white/15 transition-colors"
            >
              <span className="text-sm">💬</span>
              <span>WhatsApp</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose text-white text-xs font-semibold hover:bg-rose/90 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span className="text-sm">🛒</span>
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-brown-dark text-white text-[0.7rem] font-bold px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-1 text-cream text-lg"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>

          </div>
        </div>
      </div>

      {/* ── TIER 2: Bakingo Category Navigation Strip ───────────────────────────── */}
      <nav className="bg-white border-b border-rose/15 shadow-xs py-2 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-4 sm:gap-6 text-xs sm:text-sm">
          {CATEGORY_STRIP.map(item => (
            <button
              key={item.action}
              onClick={() => handleNavClick(item.action)}
              className="flex-shrink-0 font-medium text-brown-dark hover:text-rose transition-colors py-1 relative group cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[0.6rem] bg-rose text-white font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter animate-pulse">
                  {item.badge}
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-cream-light border-b border-rose/20 p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bakes & hampers..."
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-white text-brown-dark text-xs border border-rose/20"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-brown-light">🔍</span>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {CATEGORY_STRIP.map(item => (
              <button
                key={item.action}
                onClick={() => handleNavClick(item.action)}
                className="text-left p-2 rounded-lg bg-white border border-rose/10 text-brown-dark font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

    </header>
  )
}
