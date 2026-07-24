import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { getStoredMenuItems } from '../utils/menuManager'

export default function MenuPage() {
  const location = useLocation()
  const [menuData, setMenuData] = useState(() => getStoredMenuItems())
  const { addToCart } = useCart()

  useEffect(() => {
    const handleMenuChange = () => setMenuData(getStoredMenuItems())
    window.addEventListener('menu-data-change', handleMenuChange)
    return () => window.removeEventListener('menu-data-change', handleMenuChange)
  }, [])

  // Smooth scroll to category section when passed in location state
  useEffect(() => {
    const catId = location.state?.category
    if (catId) {
      setTimeout(() => {
        const el = document.getElementById(catId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 150)
    }
  }, [location.state])

  const handleAdd = (item, sizeLabel, price, categoryId) => {
    const key = `${item.name.toLowerCase().replace(/\s+/g, '-')}_${sizeLabel}`
    const defaultImg = categoryId === 'brownies' ? '/images/brownies.png' : categoryId === 'cake-jars' ? '/images/hamper.png' : '/images/cake.png'

    addToCart(key, {
      name: `${item.name} (${sizeLabel})`,
      price,
      size: sizeLabel,
      img: item.img || defaultImg
    })
  }

  return (
    <>
      <Navbar />

      {/* Hero banner */}
      <section className="pt-44 sm:pt-48 pb-12 bg-gradient-to-b from-cream to-cream-light text-center px-6 border-b border-rose/10">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-rose mb-2">
          Handcrafted &amp; Eggless
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-brown-dark leading-tight mb-3">
          Our <span className="script text-rose text-[1.15em]">Bake Menu</span> ♡
        </h1>
        <p className="text-brown-light text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Every treat is freshly baked right after your order — premium ingredients, 100% eggless.
        </p>
      </section>

      {/* All Categories Continuous Menu List */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16 min-h-[60vh]">
        {menuData.map(category => (
          <section key={category.id} id={category.id} className="scroll-mt-36 space-y-8">
            
            {/* Category Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-rose/20">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark flex items-center gap-3">
                  <span className="text-3xl">{category.emoji}</span>
                  <span>{category.category}</span>
                </h2>
                {category.note && (
                  <p className="text-xs text-brown-light mt-1 font-sans font-medium">{category.note}</p>
                )}
              </div>
              <span className="text-xs text-brown-light/60 font-semibold">{category.items.length} items</span>
            </div>

            {/* Premium Vertical Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {category.items.map(item => {
                const defaultImg = category.id === 'brownies' ? '/images/brownies.png' : category.id === 'cake-jars' ? '/images/hamper.png' : '/images/cake.png'
                const imgSrc = item.img || defaultImg

                return (
                  <div
                    key={item.name}
                    className="bg-white rounded-3xl overflow-hidden border border-rose/15 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header with Aspect Ratio */}
                      <div className="w-full h-52 relative overflow-hidden bg-cream-light/40">
                        <img
                          src={imgSrc}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/30 via-transparent to-transparent opacity-60" />

                        {/* Unit Badge */}
                        {item.unit && (
                          <div className="absolute top-3 right-3 pointer-events-none">
                            <span className="bg-brown-dark/90 backdrop-blur-md text-cream-light text-[0.62rem] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
                              {item.unit}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-5">
                        <h3 className="font-serif text-xl font-bold text-brown-dark mb-1 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-brown-light/80 leading-relaxed font-sans mb-4">
                          Handcrafted with pure butter &amp; rich Belgian chocolate. Freshly baked to order.
                        </p>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-5 pt-0">
                      {item.p1kg ? (
                        /* Dual Weight Options (500g & 1kg) */
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-rose/10">
                          <button
                            onClick={() => handleAdd(item, '500g', item.p500, category.id)}
                            className="py-2.5 px-3 rounded-2xl bg-cream hover:bg-rose/20 text-brown-dark text-xs font-semibold border border-rose/25 transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95"
                          >
                            <span className="text-[0.65rem] uppercase text-brown-light font-medium">500g</span>
                            <span className="font-bold text-rose text-sm">₹{item.p500}</span>
                          </button>

                          <button
                            onClick={() => handleAdd(item, '1kg', item.p1kg, category.id)}
                            className="py-2.5 px-3 rounded-2xl bg-brown-dark text-cream hover:bg-brown-mid text-xs font-semibold transition-all flex flex-col items-center justify-center cursor-pointer shadow-sm active:scale-95"
                          >
                            <span className="text-[0.65rem] uppercase text-cream/70 font-medium">1kg</span>
                            <span className="font-bold text-amber-300 text-sm">₹{item.p1kg}</span>
                          </button>
                        </div>
                      ) : (
                        /* Single Unit Option (Cake Jars / Bites) */
                        <div className="pt-3 border-t border-rose/10 flex items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="text-[0.65rem] uppercase text-brown-light font-medium">Price</span>
                            <span className="font-bold text-brown-dark text-lg">₹{item.p500}</span>
                          </div>

                          <button
                            onClick={() => handleAdd(item, item.unit || '1 Unit', item.p500, category.id)}
                            className="py-2.5 px-5 rounded-2xl bg-brown-dark text-cream hover:bg-brown-mid text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                          >
                            <span>🛒 Add to Cart</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                )
              })}
            </div>

          </section>
        ))}
      </main>

      <Footer />
    </>
  )
}
