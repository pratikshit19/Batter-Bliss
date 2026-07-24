import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* ── Full Menu Data ──────────────────────────────────────────────── */
const MENU = [
  {
    id: 'tea-cakes',
    category: 'Tea Cakes',
    emoji: '☕',
    note: 'Available in 500g & 1kg',
    items: [
      { name: 'Vanilla Cake',             p500: 400,  p1kg: 750  },
      { name: 'Marble Cake',              p500: 450,  p1kg: 850  },
      { name: 'Chocolate Cake',           p500: 475,  p1kg: 925  },
      { name: 'Dry Fruit Cake',           p500: 475,  p1kg: 925  },
      { name: 'Vanilla Choco-Chip Cake',  p500: 475,  p1kg: 925  },
      { name: 'Mahwa Cake',               p500: 500,  p1kg: 950  },
      { name: 'Banana Walnut Cake',       p500: 550,  p1kg: 1050 },
      { name: 'Coffee Cake',              p500: 450,  p1kg: 850  },
      { name: 'Coffee Walnut Cake',       p500: 500,  p1kg: 950  },
      { name: 'Nutella Cake',             p500: 500,  p1kg: 950  },
      { name: 'Lemon Blueberry Cake',     p500: 550,  p1kg: 1025 },
      { name: 'Classic Choco-Chip Cake',  p500: 500,  p1kg: 950  },
      { name: 'Double Choco-Chip Cake',   p500: 550,  p1kg: 1000 },
    ],
  },
  {
    id: 'brownies',
    category: 'Brownies',
    emoji: '🍫',
    note: 'Available in 500g & 1kg · Bites sold per piece',
    items: [
      { name: 'Walnut Brownie',      p500: 550,  p1kg: 1025 },
      { name: 'Chocolate Brownie',   p500: 550,  p1kg: 1025 },
      { name: 'Fudge Brownie',       p500: 600,  p1kg: 1150 },
      { name: 'Nutella Brownie',     p500: 650,  p1kg: 1175 },
      { name: 'Choco-Chip Brownie',  p500: 550,  p1kg: 1025 },
      { name: 'Brownie Bites',       p500: 80,   p1kg: null, unit: 'per piece' },
    ],
  },
  {
    id: 'guilt-free',
    category: 'Guilt-Free',
    emoji: '🌿',
    note: 'Wholesome ingredients · Available in 500g & 1kg',
    items: [
      { name: 'Banana Walnut Cake',      p500: 575,  p1kg: 1100 },
      { name: 'Oats Banana Cake',        p500: 500,  p1kg: 950  },
      { name: 'Oats Jaggery Atta Cake',  p500: 500,  p1kg: 950  },
      { name: 'Wholewheat Dates Cake',   p500: 550,  p1kg: 1025 },
      { name: 'Dates and Walnut Cake',   p500: 600,  p1kg: 1150 },
    ],
  },
  {
    id: 'cake-jars',
    category: 'Cake Jars',
    emoji: '🍯',
    note: 'Priced per jar',
    items: [
      { name: 'Chocolate Cake Jar',      p500: 250,  p1kg: null, unit: 'per jar' },
      { name: 'Truffle Cake Jar',        p500: 275,  p1kg: null, unit: 'per jar' },
      { name: 'Dark Chocolate Cake Jar', p500: 250,  p1kg: null, unit: 'per jar' },
      { name: 'Nutella Cake Jar',        p500: 350,  p1kg: null, unit: 'per jar' },
      { name: 'Kitkar Cake Jar',         p500: 300,  p1kg: null, unit: 'per jar' },
    ],
  },
]

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState(MENU[0].id)
  const navigate = useNavigate()

  const active = MENU.find(m => m.id === activeTab)

  return (
    <>
      <Navbar />

      {/* Hero banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-cream to-cream-light text-center px-6">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-rose mb-2">
          Batter &amp; Bliss
        </p>
        <h1 className="font-serif text-5xl lg:text-6xl font-semibold text-brown-dark leading-tight mb-3">
          Our <span className="script text-rose text-[1.15em]">Menu</span> ♡
        </h1>
        <p className="text-brown-light text-base max-w-sm mx-auto leading-relaxed">
          Every item freshly baked after your order — never pre-made, never stored.
        </p>
      </section>

      {/* Sticky category tabs */}
      <div className="sticky top-[104px] z-40 bg-cream-light backdrop-blur-md
                      border-b border-rose/10 shadow-[0_2px_12px_rgba(44,26,14,0.06)]">
        <div className="max-w-4xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {MENU.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium
                          transition-all duration-250 cursor-pointer whitespace-nowrap
                ${activeTab === cat.id
                  ? 'bg-brown-dark text-cream-light shadow-md'
                  : 'bg-white border border-rose/20 text-brown-mid hover:border-rose/50 hover:bg-rose/5'
                }`}
            >
              {cat.emoji} {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu table */}
      <main className="max-w-4xl mx-auto px-6 py-12 min-h-[60vh]">

        {/* Category header */}
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-semibold text-brown-dark mb-1">
            {active.emoji} {active.category}
          </h2>
          <p className="text-brown-light text-sm">{active.note}</p>
        </div>

        {/* Price table */}
        <div className="bg-white rounded-3xl border border-rose/12
                        shadow-[0_4px_32px_rgba(44,26,14,0.08)] overflow-hidden">

          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 px-6 py-3
                          bg-cream border-b border-rose/10
                          text-[0.65rem] font-bold uppercase tracking-widest text-brown-light/70">
            <span>Item</span>
            <span className="text-right w-20">500g</span>
            <span className="text-right w-20">1kg</span>
          </div>

          {/* Rows */}
          {active.items.map((item, i) => (
            <div
              key={item.name}
              className={`grid grid-cols-[1fr_auto_auto] gap-x-6 px-6 py-4 items-center
                          border-b border-rose/6 last:border-0 transition-colors duration-150
                          hover:bg-rose/5 ${i % 2 === 0 ? '' : 'bg-cream/30'}`}
            >
              <span className="font-medium text-brown-dark text-sm">{item.name}</span>
              <span className="text-right w-20 font-semibold text-rose text-sm whitespace-nowrap">
                ₹{item.p500}
                {item.unit && (
                  <span className="block text-[0.6rem] font-normal text-brown-light/60">
                    {item.unit}
                  </span>
                )}
              </span>
              <span className="text-right w-20 font-semibold text-brown-mid text-sm whitespace-nowrap">
                {item.p1kg ? `₹${item.p1kg}` : '—'}
              </span>
            </div>
          ))}
        </div>

        {/* Order CTA */}
        <div className="text-center mt-10">
          <p className="text-brown-light text-sm mb-4">
            Loved what you see? Place your order now ♡
          </p>
          <button
            onClick={() => { navigate('/'); setTimeout(() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
            className="px-8 py-3.5 rounded-full bg-brown-dark text-cream-light font-medium text-sm
                       shadow-[0_6px_24px_rgba(44,26,14,0.28)] hover:bg-brown-mid hover:-translate-y-1
                       transition-all duration-300 cursor-pointer"
          >
            Order Now 🛍
          </button>
        </div>

      </main>

      <Footer />
    </>
  )
}
