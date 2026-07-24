import { getActiveFestival } from '../utils/festivalConfig'
import { useCart } from '../context/CartContext'

export default function FestivalSection() {
  const festival = getActiveFestival()
  const { addToCart } = useCart()

  if (!festival || !festival.active) return null

  const handleCustomWhatsApp = (productName) => {
    const text = encodeURIComponent(`Hi Batter & Bliss! 🪢 I want to place a Custom Rakhi Order for "${productName}". Can you help me customize it?`)
    window.open(`https://wa.me/918860503685?text=${text}`, '_blank')
  }

  return (
    <section id="rakhi-special" className="py-16 bg-gradient-to-b from-purple-950 via-purple-900 to-emerald-950 text-white relative overflow-hidden">
      
      {/* Decorative Rakhi Accents */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/80 text-white text-xs font-bold uppercase tracking-widest mb-3 shadow-md border border-red-400/40">
            <span>🪢 Limited Festive Edition</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
            Raksha Bandhan <span className="script text-rose-300 text-[1.25em]">Hampers</span> ♡
          </h2>
          <p className="text-purple-200/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Express your sibling love with handcrafted eggless bakes, premium designer Rakhis, and customizable gift boxes.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {festival.specialProducts.map(product => {
            const isPurple = product.themeColor === 'purple'
            const isGreen = product.themeColor === 'green'

            const cardBorder = isPurple
              ? 'border-purple-500/40 hover:border-purple-400'
              : isGreen
              ? 'border-emerald-500/40 hover:border-emerald-400'
              : 'border-red-500/40 hover:border-red-400'

            const tagColor = isPurple
              ? 'bg-purple-800/90 text-purple-100'
              : isGreen
              ? 'bg-emerald-800/90 text-emerald-100'
              : 'bg-red-800/90 text-red-100'

            return (
              <div
                key={product.id}
                className={`bg-white/10 backdrop-blur-md rounded-3xl p-6 border ${cardBorder} shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5`}
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[0.7rem] font-bold px-3 py-1 rounded-full border border-white/20 ${tagColor}`}>
                      {product.tag}
                    </span>
                    <span className="text-xs font-bold text-white">₹{product.price}</span>
                  </div>

                  {/* Image */}
                  <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-inner relative group">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-purple-200/80 text-xs leading-relaxed mb-6">{product.desc}</p>
                </div>

                {/* Actions */}
                <div>
                  {product.isCustomWhatsApp ? (
                    <button
                      onClick={() => handleCustomWhatsApp(product.name)}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>💬 Custom Order on WhatsApp</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(product.id, {
                        name: product.name,
                        price: product.price,
                        size: product.size,
                        img: product.img
                      })}
                      className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>🛒 Add Hamper (₹{product.price})</span>
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
            <h4 className="font-serif text-lg font-bold text-white mb-1">Want a Custom Rakhi Gift Box? 🎁</h4>
            <p className="text-xs text-purple-200/80">Choose your custom flavors, add personalized notes & designer Rakhis.</p>
          </div>
          <button
            onClick={() => handleCustomWhatsApp('Rakhi Special Custom Hamper')}
            className="px-6 py-3 rounded-full bg-white text-purple-950 font-bold text-xs hover:bg-cream transition-colors shadow-md shrink-0 cursor-pointer"
          >
            💬 WhatsApp Custom Order
          </button>
        </div>

      </div>
    </section>
  )
}
