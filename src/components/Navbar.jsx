import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getActiveFestival } from '../utils/festivalConfig'

const DROPDOWN_ITEMS = {
  brownies: [
    { name: 'All Brownies', price: 550, size: '500g', img: '/images/brownies.png' },
    { name: 'Walnut Brownie', price: 550, size: '500g', img: '/images/brownies.png' },
    { name: 'Chocolate Brownie', price: 550, size: '500g', img: '/images/brownies.png' },
    { name: 'Fudge Brownie', price: 600, size: '500g', img: '/images/brownies.png' },
    { name: 'Nutella Brownie', price: 650, size: '500g', img: '/images/brownies.png' },
    { name: 'Choco-Chip Brownie', price: 550, size: '500g', img: '/images/brownies.png' },
    { name: 'Brownie Bites', price: 80, size: 'per piece', img: '/images/brownies.png' },
  ],
  'tea-cakes': [
    { name: 'All Tea Cakes', price: 400, size: '500g', img: '/images/cake.png' },
    { name: 'Vanilla Cake', price: 400, size: '500g', img: '/images/cake.png' },
    { name: 'Marble Cake', price: 450, size: '500g', img: '/images/cake.png' },
    { name: 'Chocolate Cake', price: 475, size: '500g', img: '/images/cake.png' },
    { name: 'Dry Fruit Cake', price: 475, size: '500g', img: '/images/cake.png' },
    { name: 'Banana Walnut Cake', price: 550, size: '500g', img: '/images/cake.png' },
    { name: 'Coffee Cake', price: 450, size: '500g', img: '/images/cake.png' },
    { name: 'Nutella Cake', price: 500, size: '500g', img: '/images/cake.png' },
  ],
  'guilt-free': [
    { name: 'All Guilt-Free Bakes', price: 500, size: '500g', img: '/images/cake.png' },
    { name: 'Oats Banana Cake', price: 500, size: '500g', img: '/images/cake.png' },
    { name: 'Oats Jaggery Atta Cake', price: 500, size: '500g', img: '/images/cake.png' },
    { name: 'Wholewheat Dates Cake', price: 550, size: '500g', img: '/images/cake.png' },
    { name: 'Dates and Walnut Cake', price: 600, size: '500g', img: '/images/cake.png' },
  ],
  'cake-jars': [
    { name: 'All Cake Jars', price: 250, size: 'per jar', img: '/images/hamper.png' },
    { name: 'Chocolate Cake Jar', price: 250, size: 'per jar', img: '/images/hamper.png' },
    { name: 'Truffle Cake Jar', price: 275, size: 'per jar', img: '/images/hamper.png' },
    { name: 'Dark Chocolate Cake Jar', price: 250, size: 'per jar', img: '/images/hamper.png' },
    { name: 'Nutella Cake Jar', price: 350, size: 'per jar', img: '/images/hamper.png' },
    { name: 'KitKat Cake Jar', price: 300, size: 'per jar', img: '/images/hamper.png' },
  ]
}

const CATEGORY_STRIP = [
  { label: '🪢 Rakhi Special', action: 'rakhi', badge: 'NEW' },
  { label: '🍫 Brownies', action: 'brownies', hasDropdown: true },
  { label: '☕ Tea Cakes', action: 'tea-cakes', hasDropdown: true },
  { label: '🌿 Guilt-Free', action: 'guilt-free', hasDropdown: true },
  { label: '🍯 Cake Jars', action: 'cake-jars', hasDropdown: true },
  { label: '📖 Our Story', action: 'about' },
  { label: '💖 Why Us', action: 'why-us' }
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMenuPage = location.pathname === '/menu'
  const { addToCart, totalItems, setIsCartOpen } = useCart()

  const [festival, setFestival] = useState(() => getActiveFestival())
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const handleThemeChange = () => setFestival(getActiveFestival())
    window.addEventListener('festival-theme-change', handleThemeChange)
    return () => window.removeEventListener('festival-theme-change', handleThemeChange)
  }, [])

  const handleNavClick = (action) => {
    if (action === 'about' || action === 'why-us' || action === 'rakhi') {
      const targetId = action === 'rakhi' ? 'rakhi-special' : action
      if (isMenuPage) {
        navigate('/', { state: { scrollTo: targetId } })
      } else {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/menu', { state: { category: action } })
    }
    setMenuOpen(false)
  }

  const handleDropdownItemClick = (subItem, categoryKey) => {
    setActiveDropdown(null)
    if (subItem.name.startsWith('All ')) {
      navigate('/menu', { state: { category: categoryKey } })
    } else {
      const key = `${subItem.name.toLowerCase().replace(/\s+/g, '-')}_${subItem.size}`
      addToCart(key, {
        name: `${subItem.name} (${subItem.size})`,
        price: subItem.price,
        size: subItem.size,
        img: subItem.img
      })
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate('/menu')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md">
      
      {/* ── FESTIVAL ANNOUNCEMENT BAR ────────────────────────────────────── */}
      {festival && festival.active && (
        <div className={`${festival.colors.bannerBg} text-white py-1.5 px-4 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-inner`}>
          <span>{festival.topBanner.text}</span>
          <button
            onClick={() => handleNavClick('rakhi')}
            className="bg-white text-purple-950 px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold hover:bg-amber-300 transition-colors shadow-xs hidden sm:inline-block cursor-pointer ml-1"
          >
            {festival.topBanner.cta}
          </button>
        </div>
      )}

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
              placeholder="Search For Brownies, Tea Cakes, Rakhi Hampers..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white text-brown-dark text-xs placeholder-brown-light/60 font-sans focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all shadow-inner"
            />
            <span className="absolute left-3 top-2.5 text-brown-light/60 text-xs">🔍</span>
          </form>

          {/* Right Action Icons (WhatsApp & Cart) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">

            {/* WhatsApp Direct Link */}
            <a
              href="https://wa.me/918860503685"
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

      {/* ── TIER 2: Bakingo Category Navigation Strip with Dropdowns ──────────── */}
      <nav className="bg-white border-b border-rose/15 shadow-xs py-2 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-visible scrollbar-none gap-4 sm:gap-6 text-xs sm:text-sm">
          {CATEGORY_STRIP.map(item => {
            const isRakhi = item.action === 'rakhi'
            const hasSubMenu = item.hasDropdown && DROPDOWN_ITEMS[item.action]

            return (
              <div
                key={item.action}
                className="relative group shrink-0"
                onMouseEnter={() => hasSubMenu && setActiveDropdown(item.action)}
                onMouseLeave={() => hasSubMenu && setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleNavClick(item.action)}
                  className={`font-medium transition-colors py-1 relative cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isRakhi ? 'text-purple-900 font-bold' : 'text-brown-dark hover:text-rose'
                  }`}
                >
                  <span>{item.label}</span>
                  {hasSubMenu && <span className="text-[0.6rem] text-brown-light/60">▼</span>}
                  {item.badge && (
                    <span className="text-[0.6rem] bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter animate-pulse shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full ${isRakhi ? 'bg-purple-700' : 'bg-rose'}`} />
                </button>

                {/* Bakingo-Style Dropdown Menu Box */}
                {hasSubMenu && activeDropdown === item.action && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-cream-light border border-rose/20 rounded-2xl shadow-xl py-2 px-1.5 z-50 animate-stepIn">
                    <div className="text-[0.65rem] font-bold text-brown-light/70 uppercase tracking-widest px-3 py-1 mb-1 border-b border-rose/10 flex justify-between">
                      <span>{item.label} Menu</span>
                      <span className="text-rose font-normal">Click to Add 🛒</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-0.5">
                      {DROPDOWN_ITEMS[item.action].map(subItem => (
                        <button
                          key={subItem.name}
                          onClick={() => handleDropdownItemClick(subItem, item.action)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-brown-dark font-medium hover:bg-rose/15 hover:text-rose transition-colors flex items-center justify-between group/item cursor-pointer"
                        >
                          <span className="truncate">{subItem.name}</span>
                          {!subItem.name.startsWith('All ') && (
                            <span className="text-[0.68rem] font-bold text-brown-mid group-hover/item:text-rose shrink-0 ml-2">
                              ₹{subItem.price}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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
