import { useState, useEffect } from 'react'
import { getScheduledLaunches, getLaunchState, calculateTimeRemaining } from '../utils/launchManager'
import { getStoredMenuItems } from '../utils/menuManager'
import { useCart } from '../context/CartContext'
import { Rocket, Clock, Bell, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react'

function CountdownDisplay({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(targetDate)
      setTimeLeft(remaining)
      if (remaining.total <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (timeLeft.total <= 0) {
    return (
      <div className="flex items-center justify-center gap-1 text-emerald-400 font-extrabold text-xs py-2 bg-emerald-950/60 rounded-xl border border-emerald-500/30">
        <CheckCircle2 className="w-4 h-4 animate-bounce" />
        <span>LAUNCHED! GOING LIVE NOW!</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center my-3 bg-black/40 p-2.5 rounded-2xl border border-white/10">
      <div className="bg-white/10 rounded-xl p-1.5">
        <span className="font-extrabold text-amber-300 text-sm sm:text-base block">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="text-[0.6rem] uppercase tracking-wider text-cream/70">Days</span>
      </div>
      <div className="bg-white/10 rounded-xl p-1.5">
        <span className="font-extrabold text-amber-300 text-sm sm:text-base block">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[0.6rem] uppercase tracking-wider text-cream/70">Hours</span>
      </div>
      <div className="bg-white/10 rounded-xl p-1.5">
        <span className="font-extrabold text-amber-300 text-sm sm:text-base block">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[0.6rem] uppercase tracking-wider text-cream/70">Mins</span>
      </div>
      <div className="bg-white/10 rounded-xl p-1.5">
        <span className="font-extrabold text-amber-300 text-sm sm:text-base block">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[0.6rem] uppercase tracking-wider text-cream/70">Secs</span>
      </div>
    </div>
  )
}

export default function NewLaunchSection() {
  const [launches, setLaunches] = useState(() => getScheduledLaunches())
  const [categories, setCategories] = useState(() => getStoredMenuItems())
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { addToCart } = useCart()

  useEffect(() => {
    const handleLaunchChange = () => setLaunches(getScheduledLaunches())
    const handleMenuChange = () => setCategories(getStoredMenuItems())
    window.addEventListener('launch-data-change', handleLaunchChange)
    window.addEventListener('menu-data-change', handleMenuChange)
    return () => {
      window.removeEventListener('launch-data-change', handleLaunchChange)
      window.removeEventListener('menu-data-change', handleMenuChange)
    }
  }, [])

  // Filter items that are coming soon or live
  const activeLaunches = launches.filter(item => {
    const state = getLaunchState(item)
    return state === 'coming_soon' || state === 'live'
  })

  const visibleLaunches = selectedCategory === 'all'
    ? activeLaunches
    : activeLaunches.filter(item => item.category === selectedCategory)

  if (activeLaunches.length === 0) return null

  const handleNotifyWhatsApp = (item) => {
    const defaultMsg = `Hi Batter & Bliss! 🚀 I want to be notified when "${item.name}" launches!`
    const text = encodeURIComponent(item.whatsappMessage || defaultMsg)
    window.open(`https://wa.me/918860503685?text=${text}`, '_blank')
  }

  return (
    <section className="py-12 bg-gradient-to-b from-brown-dark via-[#3A2213] to-brown-dark text-cream relative overflow-hidden border-b border-rose/15">
      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-rose/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-3 shadow-md border border-amber-400/30">
            <Rocket className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>Exclusive New Launches</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream mb-2">
            NEW <span className="script text-amber-300 text-[1.25em]">Delights!</span>
          </h2>
          <p className="text-cream/80 text-xs sm:text-sm max-w-lg mx-auto">
            Preview our upcoming gourmet bakes, get instant launch alerts &amp; order just-launched items!
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-brown-dark shadow-md scale-105'
                  : 'bg-white/10 text-cream/80 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
            >
              All Launches ({activeLaunches.length})
            </button>
            {categories.map(cat => {
              const count = activeLaunches.filter(i => i.category === cat.id).length
              if (count === 0) return null

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-400 text-brown-dark shadow-md scale-105'
                      : 'bg-white/10 text-cream/80 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.category || cat.title || cat.id} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleLaunches.map(item => {
            const state = getLaunchState(item)
            const isComingSoon = state === 'coming_soon'
            const isLive = state === 'live'

            return (
              <div
                key={item.id}
                className={`rounded-3xl p-5 border backdrop-blur-md transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden group ${isComingSoon
                  ? 'bg-white/8 border-amber-400/30 hover:border-amber-400/60'
                  : 'bg-emerald-950/40 border-emerald-400/40 hover:border-emerald-400/70'
                  }`}
              >
                <div>
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    {isComingSoon ? (
                      <span className="text-[0.68rem] font-extrabold px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>⏳ COMING SOON</span>
                      </span>
                    ) : (
                      <span className="text-[0.68rem] font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-1.5 animate-pulse">
                        <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                        <span>🚀 JUST LAUNCHED</span>
                      </span>
                    )}

                    <span className="font-extrabold text-amber-300 text-sm">
                      ₹{item.p500}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 border border-white/15 relative group">
                    <img
                      src={item.img || '/images/cake.png'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <span className="absolute bottom-2.5 left-3 text-[0.65rem] uppercase font-extrabold bg-black/60 px-2.5 py-0.5 rounded-full text-cream/90 border border-white/10">
                      {item.category.replace('-', ' ')}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-cream mb-1.5 group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-cream/75 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Countdown Timer for Coming Soon (Optional) */}
                  {isComingSoon && item.showCountdownTimer !== false && (
                    <CountdownDisplay targetDate={item.launchDate} />
                  )}
                </div>

                {/* Bottom Action */}
                <div className="pt-2">
                  {isComingSoon ? (
                    <button
                      onClick={() => handleNotifyWhatsApp(item)}
                      className="w-full py-3 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Bell className="w-4 h-4 text-amber-300" />
                      <span>Notify Me on WhatsApp</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id, {
                        name: item.name,
                        price: item.p500,
                        size: item.unit || '500g',
                        img: item.img || '/images/cake.png'
                      })}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 border border-emerald-300"
                    >
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>Add to Cart (₹{item.p500})</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
