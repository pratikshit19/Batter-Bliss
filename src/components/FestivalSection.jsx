import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActiveFestival } from '../utils/festivalConfig'
import { useCart } from '../context/CartContext'
import { Sparkles, Gift, ShoppingBag, MessageCircle } from 'lucide-react'

export default function FestivalSection() {
  const navigate = useNavigate()
  const [festival, setFestival] = useState(() => getActiveFestival())
  const { addToCart } = useCart()

  useEffect(() => {
    const handleThemeChange = () => setFestival(getActiveFestival())
    window.addEventListener('festival-theme-change', handleThemeChange)
    return () => window.removeEventListener('festival-theme-change', handleThemeChange)
  }, [])

  if (!festival || !festival.active) return null

  const handleCustomWhatsApp = (productName) => {
    const text = encodeURIComponent(`Hi Batter & Bliss! ${festival.emoji} I want to place a Custom ${festival.name} Order for "${productName}". Can you help me customize it?`)
    window.open(`https://wa.me/918860503685?text=${text}`, '_blank')
  }

  return (
    <section id="rakhi-special" className={`py-16 bg-gradient-to-b ${festival.colors.sectionBg} text-white relative overflow-hidden transition-all duration-500`}>
      
      {/* Decorative Accents */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-widest mb-3 shadow-md border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Limited Festive Edition</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
            {festival.name} <span className="script text-rose-300 text-[1.25em]">Hampers</span>
          </h2>
          <p className="text-cream/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {festival.hero.subtitle}
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {festival.specialProducts.map(product => {
            return (
              <div
                key={product.id}
                onClick={() => navigate(`/festive/${product.id}`)}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group"
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.7rem] font-bold px-3 py-1 rounded-full border border-white/20 bg-white/20 text-white">
                      {product.tag}
                    </span>
                    <span className="text-xs font-bold text-white">₹{product.price}</span>
                  </div>

                  {/* Image */}
                  <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-inner relative">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">{product.name}</h3>
                  <p className="text-cream/80 text-xs leading-relaxed mb-6">{product.desc}</p>
                </div>

                {/* Actions */}
                <div>
                  {product.isCustomWhatsApp ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCustomWhatsApp(product.name)
                      }}
                      className="w-full py-3 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-white/30"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Custom Order on WhatsApp</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product.id, {
                          name: product.name,
                          price: product.price,
                          size: product.size,
                          img: product.img
                        })
                      }}
                      className="w-full py-3 rounded-full bg-white text-brown-dark font-bold text-xs shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:bg-cream"
                    >
                      <ShoppingBag className="w-4 h-4 text-brown-dark" />
                      <span>Add Hamper (₹{product.price})</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Custom Order Callout Bar */}
        <div className="mt-12 bg-white/10 border border-white/20 rounded-3xl p-6 text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md">
          <div className="text-left">
            <h4 className="font-serif text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-300 inline" />
              <span>Want a Custom {festival.name} Gift Box?</span>
            </h4>
            <p className="text-xs text-cream/80">Choose your custom flavors, add personalized notes &amp; festive packaging.</p>
          </div>
          <button
            onClick={() => handleCustomWhatsApp(`Custom ${festival.name} Hamper`)}
            className="px-6 py-3 rounded-full bg-white text-brown-dark font-bold text-xs hover:bg-cream transition-colors shadow-md shrink-0 cursor-pointer flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-brown-dark" />
            <span>WhatsApp Custom Order</span>
          </button>
        </div>

      </div>
    </section>
  )
}
