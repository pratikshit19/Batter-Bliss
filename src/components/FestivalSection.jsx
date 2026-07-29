import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActiveFestival } from '../utils/festivalConfig'
import { useCart } from '../context/CartContext'
import { Sparkles, Gift, ShoppingBag, MessageCircle, Star } from 'lucide-react'

// ── SIGNIFICANT DETAILED EMBLEMS PER FESTIVAL ──

// 🇮🇳 1. INDEPENDENCE DAY - Waving Indian National Flag (Tiranga)
function WavingIndianFlag({ className = "w-16 h-12" }) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none">
      {/* Flag Pole */}
      <rect x="5" y="5" width="4" height="72" rx="2" fill="#D97706" />
      <circle cx="7" cy="5" r="4" fill="#F59E0B" />
      
      {/* Saffron Stripe */}
      <path d="M 9 9 Q 35 15 65 9 Q 95 3 115 9 L 115 29 Q 95 23 65 29 Q 35 35 9 29 Z" fill="#FF9933" />
      
      {/* White Stripe */}
      <path d="M 9 29 Q 35 35 65 29 Q 95 23 115 29 L 115 49 Q 95 43 65 49 Q 35 55 9 49 Z" fill="#FFFFFF" />
      
      {/* Ashoka Chakra */}
      <g transform="translate(62, 39)">
        <circle cx="0" cy="0" r="8" stroke="#000080" strokeWidth="1.2" fill="none" />
        <circle cx="0" cy="0" r="2" fill="#000080" />
        {[...Array(24)].map((_, i) => (
          <line key={i} x1="0" y1="0" x2="0" y2="-8" stroke="#000080" strokeWidth="0.6" transform={`rotate(${i * 15})`} />
        ))}
      </g>
      
      {/* Green Stripe */}
      <path d="M 9 49 Q 35 55 65 49 Q 95 43 115 49 L 115 69 Q 95 63 65 69 Q 35 75 9 69 Z" fill="#138808" />
    </svg>
  )
}

// 🪢 2. RAKSHA BANDHAN - Detailed Designer Rakhi Emblem
function DetailedRakhiEmblem({ className = "w-16 h-16" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <line x1="0" y1="50" x2="100" y2="50" stroke="#DC2626" strokeWidth="4" strokeDasharray="3 1" />
      {[...Array(12)].map((_, i) => (
        <path key={i} d="M 50 50 Q 56 22 50 14 Q 44 22 50 50 Z" fill="#F59E0B" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="24" fill="#581C87" stroke="#FDE047" strokeWidth="2" />
      {[...Array(8)].map((_, i) => (
        <circle key={i} cx={50 + 20 * Math.cos((i * Math.PI) / 4)} cy={50 + 20 * Math.sin((i * Math.PI) / 4)} r="2.5" fill="#FFF" />
      ))}
      <circle cx="50" cy="50" r="10" fill="#DC2626" stroke="#FEF08A" strokeWidth="1.5" />
      <circle cx="48" cy="48" r="3" fill="#FFF" opacity="0.8" />
    </svg>
  )
}

// 🪔 3. DIWALI - Glowing Shahi Diya Lamp & Rangoli
function DetailedDiwaliDiya({ className = "w-16 h-16" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="65" r="30" fill="#F59E0B" opacity="0.4" />
      {[...Array(8)].map((_, i) => (
        <circle key={i} cx={50 + 25 * Math.cos((i * Math.PI) / 4)} cy={65 + 25 * Math.sin((i * Math.PI) / 4)} r="4" fill="#EF4444" />
      ))}
      <path d="M 20 65 Q 50 95 80 65 Q 65 60 50 65 Q 35 60 20 65 Z" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1.5" />
      <path d="M 50 65 Q 62 42 50 18 Q 38 42 50 65 Z" fill="#EF4444" className="animate-pulse" />
      <path d="M 50 65 Q 58 48 50 30 Q 42 48 50 65 Z" fill="#F59E0B" className="animate-pulse" />
      <path d="M 50 65 Q 54 54 50 40 Q 46 54 50 65 Z" fill="#FEF08A" />
    </svg>
  )
}

// 🎄 4. CHRISTMAS - Decorated Christmas Tree
function DetailedChristmasTree({ className = "w-16 h-16" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <rect x="44" y="75" width="12" height="18" fill="#78350F" rx="2" />
      <polygon points="50,15 85,55 15,55" fill="#047857" stroke="#10B981" strokeWidth="1.5" />
      <polygon points="50,30 80,68 20,68" fill="#065F46" stroke="#10B981" strokeWidth="1.5" />
      <polygon points="50,45 75,82 25,82" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
      <circle cx="35" cy="52" r="3.5" fill="#EF4444" />
      <circle cx="65" cy="52" r="3.5" fill="#F59E0B" />
      <circle cx="42" cy="66" r="3.5" fill="#3B82F6" />
      <circle cx="58" cy="66" r="3.5" fill="#EF4444" />
      <polygon points="50,6 53,14 61,14 55,19 57,27 50,22 43,27 45,19 39,14 47,14" fill="#F59E0B" className="animate-pulse" />
    </svg>
  )
}

// 🎨 5. HOLI - Vibrant Color Splat Artwork
function DetailedHoliSplat({ className = "w-16 h-16" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <path d="M 50 20 Q 65 30 75 25 Q 70 40 85 50 Q 70 60 75 75 Q 60 70 50 85 Q 40 70 25 75 Q 30 60 15 50 Q 30 40 25 25 Q 40 30 50 20 Z" fill="#EC4899" opacity="0.85" />
      <circle cx="30" cy="30" r="6" fill="#F59E0B" />
      <circle cx="70" cy="35" r="8" fill="#06B6D4" />
      <circle cx="65" cy="70" r="7" fill="#8B5CF6" />
      <circle cx="35" cy="68" r="5" fill="#10B981" />
      <path d="M 50 35 Q 60 45 50 65 Q 40 45 50 35 Z" fill="#F59E0B" />
    </svg>
  )
}

// ── DYNAMIC HANGING ORNAMENTS PER FESTIVAL ──

function HangingRakhi({ position = 'left' }) {
  const swayClass = position === 'left' ? 'rakhi-sway-left' : position === 'right' ? 'rakhi-sway-right' : 'rakhi-sway-center'
  const posStyle = position === 'left' ? 'left-6 sm:left-14' : position === 'right' ? 'right-6 sm:right-14' : 'left-1/2 -translate-x-1/2 hidden md:block'

  return (
    <div className={`absolute top-0 z-20 pointer-events-none ${posStyle} ${swayClass}`}>
      <div className="w-0.5 h-16 sm:h-24 bg-gradient-to-b from-red-600 via-amber-400 to-red-600 mx-auto opacity-90 shadow-sm" />
      <div className="relative -mt-1 flex flex-col items-center">
        <DetailedRakhiEmblem className="w-12 h-12 sm:w-16 sm:h-16" />
      </div>
    </div>
  )
}

function HangingDiwaliDiya({ position = 'left' }) {
  const swayClass = position === 'left' ? 'rakhi-sway-left' : position === 'right' ? 'rakhi-sway-right' : 'rakhi-sway-center'
  const posStyle = position === 'left' ? 'left-6 sm:left-14' : position === 'right' ? 'right-6 sm:right-14' : 'left-1/2 -translate-x-1/2 hidden md:block'

  return (
    <div className={`absolute top-0 z-20 pointer-events-none ${posStyle} ${swayClass}`}>
      <div className="w-1 h-16 sm:h-24 bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-600 mx-auto opacity-95 shadow-md rounded-full" />
      <div className="relative -mt-1 flex flex-col items-center">
        <DetailedDiwaliDiya className="w-12 h-12 sm:w-16 sm:h-16" />
      </div>
    </div>
  )
}

function HangingIndependenceTiranga({ position = 'left' }) {
  const swayClass = position === 'left' ? 'rakhi-sway-left' : position === 'right' ? 'rakhi-sway-right' : 'rakhi-sway-center'
  const posStyle = position === 'left' ? 'left-6 sm:left-14' : position === 'right' ? 'right-6 sm:right-14' : 'left-1/2 -translate-x-1/2 hidden md:block'

  return (
    <div className={`absolute top-0 z-20 pointer-events-none ${posStyle} ${swayClass}`}>
      <div className="w-1 h-16 sm:h-24 bg-gradient-to-b from-orange-500 via-white to-emerald-600 mx-auto opacity-95 shadow-md rounded-full" />
      <div className="relative -mt-1 flex flex-col items-center">
        <WavingIndianFlag className="w-12 h-10 sm:w-16 sm:h-12 shadow-md" />
      </div>
    </div>
  )
}

function HangingChristmasBauble({ position = 'left' }) {
  const swayClass = position === 'left' ? 'rakhi-sway-left' : position === 'right' ? 'rakhi-sway-right' : 'rakhi-sway-center'
  const posStyle = position === 'left' ? 'left-6 sm:left-14' : position === 'right' ? 'right-6 sm:right-14' : 'left-1/2 -translate-x-1/2 hidden md:block'

  return (
    <div className={`absolute top-0 z-20 pointer-events-none ${posStyle} ${swayClass}`}>
      <div className="w-0.5 h-16 sm:h-24 bg-gradient-to-b from-red-600 via-emerald-400 to-gold mx-auto opacity-90 shadow-sm" />
      <div className="relative -mt-1 flex flex-col items-center">
        <DetailedChristmasTree className="w-12 h-12 sm:w-16 sm:h-16" />
      </div>
    </div>
  )
}

function HangingHoliGulal({ position = 'left' }) {
  const swayClass = position === 'left' ? 'rakhi-sway-left' : position === 'right' ? 'rakhi-sway-right' : 'rakhi-sway-center'
  const posStyle = position === 'left' ? 'left-6 sm:left-14' : position === 'right' ? 'right-6 sm:right-14' : 'left-1/2 -translate-x-1/2 hidden md:block'

  return (
    <div className={`absolute top-0 z-20 pointer-events-none ${posStyle} ${swayClass}`}>
      <div className="w-0.5 h-16 sm:h-24 bg-gradient-to-b from-pink-500 via-purple-400 to-cyan-400 mx-auto opacity-90 shadow-sm" />
      <div className="relative -mt-1 flex flex-col items-center">
        <DetailedHoliSplat className="w-12 h-12 sm:w-16 sm:h-16" />
      </div>
    </div>
  )
}

// ── UNIQUE WATERMARKS PER FESTIVAL ──

function SubtleRakhiWatermark() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] md:w-[920px] md:h-[920px] pointer-events-none z-0 opacity-[0.12] text-amber-300 flex items-center justify-center">
      <div className="absolute w-[180%] h-1 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent top-1/2 -translate-y-1/2" />
      <svg viewBox="0 0 500 500" className="w-full h-full animate-[spin_120s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="250" cy="250" r="230" strokeDasharray="4 6" strokeWidth="2" />
        <circle cx="250" cy="250" r="200" strokeWidth="1" />
        <circle cx="250" cy="250" r="170" strokeDasharray="8 4" strokeWidth="2" />
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 250 250)`}>
            <path d="M 250 50 Q 275 110 250 170 Q 225 110 250 50 Z" fill="currentColor" fillOpacity="0.15" />
            <circle cx="250" cy="70" r="6" fill="currentColor" />
          </g>
        ))}
        <circle cx="250" cy="250" r="130" strokeWidth="2" />
        <circle cx="250" cy="250" r="70" strokeWidth="3" />
      </svg>
    </div>
  )
}

function SubtleDiwaliWatermark() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] md:w-[920px] md:h-[920px] pointer-events-none z-0 opacity-[0.14] text-yellow-300 flex items-center justify-center">
      <svg viewBox="0 0 500 500" className="w-full h-full animate-[spin_100s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="250" cy="250" r="230" strokeWidth="2" />
        {[...Array(8)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 45} 250 250)`}>
            <path d="M 250 20 Q 265 40 250 60 Q 235 40 250 20 Z" fill="currentColor" fillOpacity="0.3" />
            <circle cx="250" cy="40" r="5" fill="#f59e0b" />
          </g>
        ))}
        {[...Array(16)].map((_, i) => (
          <g key={`petal-${i}`} transform={`rotate(${i * 22.5} 250 250)`}>
            <path d="M 250 70 C 290 150 210 150 250 70 Z" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          </g>
        ))}
        <circle cx="250" cy="250" r="100" strokeDasharray="6 4" strokeWidth="2" />
        <circle cx="250" cy="250" r="50" fill="currentColor" fillOpacity="0.2" />
      </svg>
    </div>
  )
}

function SubtleIndependenceWatermark() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] md:w-[920px] md:h-[920px] pointer-events-none z-0 opacity-[0.14] text-blue-300 flex items-center justify-center">
      <svg viewBox="0 0 500 500" className="w-full h-full animate-[spin_90s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="250" cy="250" r="230" strokeWidth="3" />
        <circle cx="250" cy="250" r="215" strokeDasharray="4 4" strokeWidth="1" />
        {[...Array(24)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 15} 250 250)`}>
            <line x1="250" y1="250" x2="250" y2="35" strokeWidth="2" />
            <circle cx="250" cy="45" r="4" fill="currentColor" />
          </g>
        ))}
        <circle cx="250" cy="250" r="70" strokeWidth="3" />
        <circle cx="250" cy="250" r="35" fill="currentColor" fillOpacity="0.3" />
      </svg>
    </div>
  )
}

function SubtleChristmasWatermark() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] md:w-[920px] md:h-[920px] pointer-events-none z-0 opacity-[0.14] text-cyan-200 flex items-center justify-center">
      <svg viewBox="0 0 500 500" className="w-full h-full animate-[spin_140s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="2">
        {[...Array(6)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 60} 250 250)`}>
            <line x1="250" y1="250" x2="250" y2="30" strokeWidth="3" />
            <line x1="250" y1="120" x2="210" y2="80" strokeWidth="2" />
            <line x1="250" y1="120" x2="290" y2="80" strokeWidth="2" />
            <line x1="250" y1="180" x2="200" y2="130" strokeWidth="2" />
            <line x1="250" y1="180" x2="300" y2="130" strokeWidth="2" />
            <circle cx="250" cy="30" r="6" fill="currentColor" />
          </g>
        ))}
        <circle cx="250" cy="250" r="80" strokeDasharray="6 4" />
        <circle cx="250" cy="250" r="40" fill="currentColor" fillOpacity="0.2" />
      </svg>
    </div>
  )
}

function SubtleHoliWatermark() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] md:w-[920px] md:h-[920px] pointer-events-none z-0 opacity-[0.14] text-pink-300 flex items-center justify-center">
      <svg viewBox="0 0 500 500" className="w-full h-full animate-[spin_100s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="1.5">
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 250 250)`}>
            <circle cx="250" cy="80" r="18" fill="currentColor" fillOpacity="0.2" />
            <circle cx="250" cy="140" r="12" fill="currentColor" fillOpacity="0.3" />
            <line x1="250" y1="250" x2="250" y2="80" strokeDasharray="3 3" />
          </g>
        ))}
        <circle cx="250" cy="250" r="90" fill="currentColor" fillOpacity="0.15" />
      </svg>
    </div>
  )
}

function FairyLights() {
  return (
    <div className="absolute top-0 left-0 right-0 h-8 pointer-events-none overflow-hidden z-20 flex justify-between px-4 sm:px-12 opacity-90">
      {[...Array(14)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-px h-3 bg-amber-300/40" />
          <div className={`w-2.5 h-3.5 rounded-full ${i % 3 === 0 ? 'bg-amber-300 fairy-glow-1' : i % 3 === 1 ? 'bg-red-500 fairy-glow-2' : 'bg-emerald-400 fairy-glow-3'}`} />
        </div>
      ))}
    </div>
  )
}

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

  const orbLeft = festival.colors?.orbLeft || 'bg-purple-600/30'
  const orbCenter = festival.colors?.orbCenter || 'bg-pink-600/30'
  const orbRight = festival.colors?.orbRight || 'bg-emerald-600/30'

  const isDiwali = festival.id === 'diwali'
  const isIndependence = festival.id === 'independenceday'
  const isChristmas = festival.id === 'christmas'
  const isHoli = festival.id === 'holi'

  return (
    <section id="rakhi-special" className={`py-14 sm:py-20 bg-gradient-to-r ${festival.colors?.sectionBg || 'from-purple-950 via-pink-950 to-emerald-950'} text-white relative overflow-hidden transition-all duration-500 border-b border-amber-500/20`}>
      
      {/* Fairy Lights Garland */}
      <FairyLights />

      {/* Render 100% Unique Hanging Ornaments per Festival */}
      {isDiwali ? (
        <>
          <HangingDiwaliDiya position="left" />
          <HangingDiwaliDiya position="center" />
          <HangingDiwaliDiya position="right" />
        </>
      ) : isIndependence ? (
        <>
          <HangingIndependenceTiranga position="left" />
          <HangingIndependenceTiranga position="center" />
          <HangingIndependenceTiranga position="right" />
        </>
      ) : isChristmas ? (
        <>
          <HangingChristmasBauble position="left" />
          <HangingChristmasBauble position="center" />
          <HangingChristmasBauble position="right" />
        </>
      ) : isHoli ? (
        <>
          <HangingHoliGulal position="left" />
          <HangingHoliGulal position="center" />
          <HangingHoliGulal position="right" />
        </>
      ) : (
        <>
          <HangingRakhi position="left" />
          <HangingRakhi position="center" />
          <HangingRakhi position="right" />
        </>
      )}

      {/* Render 100% Unique Watermark Artwork per Festival */}
      {isDiwali ? (
        <SubtleDiwaliWatermark />
      ) : isIndependence ? (
        <SubtleIndependenceWatermark />
      ) : isChristmas ? (
        <SubtleChristmasWatermark />
      ) : isHoli ? (
        <SubtleHoliWatermark />
      ) : (
        <SubtleRakhiWatermark />
      )}

      {/* Dynamic Festival Ambient Lighting & Bokeh Orbs */}
      <div className={`absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full ${orbLeft} blur-3xl pointer-events-none`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full ${orbCenter} blur-3xl pointer-events-none`} />
      <div className={`absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full ${orbRight} blur-3xl pointer-events-none`} />

      <div className="max-w-6xl mx-auto px-6 relative z-10 pt-4">
        
        {/* Section Header */}
        <div className="text-center mb-12 relative flex flex-col items-center">
          
          {/* Detailed Emblem Banner Showcase */}
          <div className="mb-4 flex items-center justify-center gap-3">
            {isIndependence ? (
              <WavingIndianFlag className="w-16 h-12 shadow-lg" />
            ) : isDiwali ? (
              <DetailedDiwaliDiya className="w-14 h-14" />
            ) : isChristmas ? (
              <DetailedChristmasTree className="w-14 h-14" />
            ) : isHoli ? (
              <DetailedHoliSplat className="w-14 h-14" />
            ) : (
              <DetailedRakhiEmblem className="w-14 h-14" />
            )}
          </div>

          {/* Metallic Gold Foil Shimmer Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-amber-500/25 text-amber-200 text-xs font-extrabold uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-amber-400/40 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{festival.emoji} {festival.name} Limited Edition</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white leading-tight mb-3 tracking-wide drop-shadow-md">
            {festival.name} <span className="script text-amber-300 text-[1.2em] font-normal">Hampers</span>
          </h2>

          <p className="text-cream/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-sans">
            {festival.hero.subtitle}
          </p>
        </div>

        {/* Product Cards Grid with Gold Glow Borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {festival.specialProducts.map(product => {
            return (
              <div
                key={product.id}
                onClick={() => navigate(`/festive/${product.id}`)}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-amber-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.3)] hover:border-amber-400/70 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 cursor-pointer group gold-glow-border relative"
              >
                {/* Vintage Seal Corner Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-400 text-brown-dark flex items-center justify-center font-extrabold text-[0.65rem] shadow-lg border border-amber-200">
                  {festival.emoji}
                </div>

                <div>
                  {/* Badge & Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.7rem] font-extrabold px-3 py-1 rounded-full border border-amber-300/40 bg-amber-400/20 text-amber-200 backdrop-blur-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      <span>{product.tag}</span>
                    </span>
                    <span className="text-sm font-extrabold text-amber-300 bg-black/30 px-3 py-1 rounded-full border border-amber-400/30">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 border border-white/20 shadow-inner relative">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent" />
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-cream/80 text-xs leading-relaxed mb-6 font-sans">
                    {product.desc}
                  </p>
                </div>

                {/* Actions */}
                <div>
                  {product.isCustomWhatsApp ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCustomWhatsApp(product.name)
                      }}
                      className="w-full py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-extrabold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-white/30"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
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
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-brown-dark font-extrabold text-xs shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] border border-amber-200"
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
        <div className="mt-12 bg-white/10 border border-amber-400/30 rounded-3xl p-6 text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
          <div className="text-left">
            <h4 className="font-serif text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-300 inline" />
              <span>Want a Custom {festival.name} Gift Box?</span>
            </h4>
            <p className="text-xs text-cream/80">Choose your custom flavors, add personalized notes &amp; festive packaging.</p>
          </div>
          <button
            onClick={() => handleCustomWhatsApp(`Custom ${festival.name} Hamper`)}
            className="px-6 py-3 rounded-2xl bg-amber-400 text-brown-dark font-extrabold text-xs hover:bg-amber-300 transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-2 border border-amber-200"
          >
            <MessageCircle className="w-4 h-4 text-brown-dark" />
            <span>WhatsApp Custom Order</span>
          </button>
        </div>

      </div>
    </section>
  )
}
