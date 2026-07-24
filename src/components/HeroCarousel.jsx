import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'

const SLIDES = [
  {
    id: 'rakhi-special',
    badge: '🪢 Limited Festival Edition',
    title: 'Sweeten Your Rakhi ♡',
    subtitle: 'Handcrafted Rakhi Gift Hampers, artisan brownies & festive bakes freshly made for your loved ones.',
    primaryBtn: { text: 'Shop Rakhi Hampers 🎁', action: 'rakhi' },
    secondaryBtn: { text: 'View Full Menu 📋', action: 'menu' },
    img: '/images/hamper.png',
    bgGradient: 'from-purple-900/10 via-cream to-pink-500/10',
    itemKey: 'walnut-brownie_500g',
    itemData: { name: 'Walnut Brownie (500g)', price: 550, size: '500g', img: '/images/brownies.png' }
  },
  {
    id: 'brownies-slide',
    badge: '⭐ Bestseller Category',
    title: 'Fudgy, Dense & Rich Brownies',
    subtitle: 'Crinkly top, chocolate-loaded centres & crunchy walnuts. Available in 500g & 1kg packs.',
    primaryBtn: { text: 'Add Walnut Brownie ₹550', action: 'add-walnut' },
    secondaryBtn: { text: 'Explore Brownies 🍫', action: 'menu' },
    img: '/images/brownies.png',
    bgGradient: 'from-amber-900/10 via-cream to-brown-dark/10',
    itemKey: 'walnut-brownie_500g',
    itemData: { name: 'Walnut Brownie (500g)', price: 550, size: '500g', img: '/images/brownies.png' }
  },
  {
    id: 'tea-cakes-slide',
    badge: '☕ Everyday Perfection',
    title: 'Freshly Baked Tea Cakes',
    subtitle: 'Classic Marble, Vanilla, Coffee & Banana Walnut loaves. 100% Eggless & baked on order.',
    primaryBtn: { text: 'Add Marble Cake ₹450', action: 'add-marble' },
    secondaryBtn: { text: 'View Tea Cakes 🎂', action: 'menu' },
    img: '/images/cake.png',
    bgGradient: 'from-rose/10 via-cream to-cream-mid',
    itemKey: 'marble-cake_500g',
    itemData: { name: 'Marble Cake (500g)', price: 450, size: '500g', img: '/images/cake.png' }
  },
  {
    id: 'jars-slide',
    badge: '🍯 Cute & Delicious',
    title: 'Layered Cake Jars & Treats',
    subtitle: 'Truffle, Nutella & KitKat cake jars. Perfect for self-indulgence or personal gifting.',
    primaryBtn: { text: 'Add Nutella Jar ₹350', action: 'add-nutella-jar' },
    secondaryBtn: { text: 'Browse All Jars 🎁', action: 'menu' },
    img: '/images/hero.png',
    bgGradient: 'from-brown-mid/10 via-cream to-rose/15',
    itemKey: 'nutella-cake-jar_per jar',
    itemData: { name: 'Nutella Cake Jar (per jar)', price: 350, size: 'per jar', img: '/images/hamper.png' }
  }
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { addToCart, setIsCartOpen } = useCart()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[currentSlide]

  const handleAction = (type) => {
    if (type === 'add-walnut') {
      addToCart('walnut-brownie_500g', { name: 'Walnut Brownie (500g)', price: 550, size: '500g', img: '/images/brownies.png' })
    } else if (type === 'add-marble') {
      addToCart('marble-cake_500g', { name: 'Marble Cake (500g)', price: 450, size: '500g', img: '/images/cake.png' })
    } else if (type === 'add-nutella-jar') {
      addToCart('nutella-cake-jar_per jar', { name: 'Nutella Cake Jar (per jar)', price: 350, size: 'per jar', img: '/images/hamper.png' })
    } else if (type === 'rakhi') {
      addToCart('walnut-brownie_1kg', { name: 'Rakhi Special Brownie Box (1kg)', price: 1025, size: '1kg', img: '/images/hamper.png' })
    } else if (type === 'menu') {
      window.location.href = '/menu'
    } else {
      setIsCartOpen(true)
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-[580px] pt-36 pb-16 flex flex-col justify-center overflow-hidden bg-cream-light transition-all duration-700"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} transition-all duration-700`} />

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">

          {/* Content side */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left transition-all duration-500">
            <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-brown-dark bg-white/80 border border-rose/30 px-4 py-1.5 rounded-full uppercase shadow-xs">
              {slide.badge}
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-dark leading-[1.12] mb-4">
              {slide.title}
            </h1>

            <p className="text-brown-light text-base sm:text-lg leading-relaxed max-w-lg mb-8">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button
                onClick={() => handleAction(slide.primaryBtn.action)}
                className="px-7 py-3.5 rounded-full bg-brown-dark text-cream-light font-medium text-sm shadow-md hover:bg-brown-mid hover:-translate-y-0.5 transition-all duration-250 cursor-pointer"
              >
                {slide.primaryBtn.text}
              </button>
              <button
                onClick={() => handleAction(slide.secondaryBtn.action)}
                className="px-7 py-3.5 rounded-full border-1.5 border-brown-dark/30 text-brown-dark font-medium text-sm hover:bg-white/80 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer"
              >
                {slide.secondaryBtn.text}
              </button>
            </div>
          </div>

          {/* Visual side */}
          <div className="flex justify-center relative">
            <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(44,26,14,0.18)] border-4 border-white">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between mt-8 relative z-10">
        {/* Indicators */}
        <div className="flex items-center gap-2">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-8 bg-brown-dark' : 'w-2.5 bg-brown-dark/30 hover:bg-brown-dark/60'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
            className="w-9 h-9 rounded-full bg-white/80 border border-brown-dark/20 text-brown-dark flex items-center justify-center font-bold text-sm hover:bg-brown-dark hover:text-white transition-colors cursor-pointer"
            aria-label="Previous Slide"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % SLIDES.length)}
            className="w-9 h-9 rounded-full bg-white/80 border border-brown-dark/20 text-brown-dark flex items-center justify-center font-bold text-sm hover:bg-brown-dark hover:text-white transition-colors cursor-pointer"
            aria-label="Next Slide"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
