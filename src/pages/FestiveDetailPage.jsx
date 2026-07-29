import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { FESTIVALS, getActiveFestival } from '../utils/festivalConfig'
import { Sparkles } from 'lucide-react'

// ── SIGNIFICANT DETAILED EMBLEMS PER FESTIVAL ──

// 🇮🇳 1. INDEPENDENCE DAY - Waving Indian National Flag (Tiranga)
function WavingIndianFlag({ className = "w-16 h-12" }) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none">
      <rect x="5" y="5" width="4" height="72" rx="2" fill="#D97706" />
      <circle cx="7" cy="5" r="4" fill="#F59E0B" />
      <path d="M 9 9 Q 35 15 65 9 Q 95 3 115 9 L 115 29 Q 95 23 65 29 Q 35 35 9 29 Z" fill="#FF9933" />
      <path d="M 9 29 Q 35 35 65 29 Q 95 23 115 29 L 115 49 Q 95 43 65 49 Q 35 55 9 49 Z" fill="#FFFFFF" />
      <g transform="translate(62, 39)">
        <circle cx="0" cy="0" r="8" stroke="#000080" strokeWidth="1.2" fill="none" />
        <circle cx="0" cy="0" r="2" fill="#000080" />
        {[...Array(24)].map((_, i) => (
          <line key={i} x1="0" y1="0" x2="0" y2="-8" stroke="#000080" strokeWidth="0.6" transform={`rotate(${i * 15})`} />
        ))}
      </g>
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

export default function FestiveDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, setIsCartOpen } = useCart()

  let festivalTheme = getActiveFestival() || FESTIVALS.rakhi
  let product = null

  for (const fKey in FESTIVALS) {
    const f = FESTIVALS[fKey]
    const p = f.specialProducts?.find(sp => sp.id === id || sp.id === id?.toLowerCase())
    if (p) {
      product = p
      festivalTheme = f
      break
    }
  }

  if (!product) {
    product = festivalTheme.specialProducts[0]
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [customCardMessage, setCustomCardMessage] = useState('')
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Sneha Kapur',
      date: '3 days ago',
      rating: 5,
      verified: true,
      title: 'Amazing Festive Gift Box!',
      comment: 'My family was so happy! The bakes were delicious and fresh, and the festive presentation was elegant.',
      helpful: 12
    },
    {
      id: 2,
      name: 'Aman Deep',
      date: '1 week ago',
      rating: 5,
      verified: true,
      title: 'Luxury festive packaging',
      comment: 'The presentation was top tier. Pure luxury taste for festive gifting.',
      helpful: 9
    }
  ])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newName, setNewName] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submittedMessage, setSubmittedMessage] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (!product) return null

  const galleryImages = [
    product.img || '/images/hamper.png',
    '/images/brownies.png',
    '/images/cake.png'
  ]

  const handleAddToCart = (openCart = false) => {
    if (product.isCustomWhatsApp) {
      const text = encodeURIComponent(`Hi Batter & Bliss! ${festivalTheme.emoji} I want to order "${product.name}" with custom card message: "${customCardMessage}"`)
      window.open(`https://wa.me/918860503685?text=${text}`, '_blank')
      return
    }

    addToCart(product.id, {
      name: `${product.name} (${product.size})${customCardMessage.trim() ? ` - "${customCardMessage}"` : ''}`,
      price: product.price,
      size: product.size,
      img: product.img || '/images/hamper.png',
      customMessage: customCardMessage.trim()
    })

    if (openCart) {
      setIsCartOpen(true)
    }
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!newName.trim() || !newComment.trim()) return

    const newRev = {
      id: Date.now(),
      name: newName.trim(),
      date: 'Just now',
      rating: newRating,
      verified: true,
      title: 'Festive Delight!',
      comment: newComment.trim(),
      helpful: 0
    }

    setReviews([newRev, ...reviews])
    setNewName('')
    setNewComment('')
    setShowReviewForm(false)
    setSubmittedMessage(true)
    setTimeout(() => setSubmittedMessage(false), 4000)
  }

  const isDiwali = festivalTheme.id === 'diwali'
  const isIndependence = festivalTheme.id === 'independenceday'
  const isChristmas = festivalTheme.id === 'christmas'
  const isHoli = festivalTheme.id === 'holi'

  const themeGradient = festivalTheme.colors?.sectionBg || 'from-purple-950 via-pink-950 to-emerald-950'

  return (
    <>
      <Navbar />

      <main className={`pt-40 sm:pt-44 pb-20 bg-gradient-to-r ${themeGradient} text-white min-h-screen relative overflow-hidden transition-all duration-500`}>
        
        {/* Fairy Lights Garland */}
        <FairyLights />

        {/* Unique Hanging Ornaments per Festival */}
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

        {/* Unique Watermark per Festival */}
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

        {/* Ambient Glow Orbs */}
        <div className={`absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full ${festivalTheme.colors?.orbLeft || 'bg-purple-600/30'} blur-3xl pointer-events-none`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full ${festivalTheme.colors?.orbCenter || 'bg-pink-600/30'} blur-3xl pointer-events-none`} />
        <div className={`absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full ${festivalTheme.colors?.orbRight || 'bg-emerald-600/30'} blur-3xl pointer-events-none`} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

          {/* Breadcrumbs */}
          <nav className="text-xs text-cream/70 mb-6 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-1">
            <Link to="/" className="hover:text-rose-300 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-rose-200 font-semibold">{festivalTheme.name} Special</span>
            <span>›</span>
            <span className="text-white font-bold truncate">{product.name}</span>
          </nav>

          {/* Detailed Emblem Banner Showcase */}
          <div className="mb-4 flex items-center justify-start gap-3">
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
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-amber-500/25 text-amber-200 text-xs font-extrabold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-amber-400/40 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{festivalTheme.name} Festive Gift Box</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>

          {/* Main Product Layout */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-amber-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 gold-glow-border relative">
            
            {/* Vintage Seal Badge */}
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-400 text-brown-dark flex items-center justify-center font-extrabold text-[0.65rem] shadow-lg border border-amber-200">
              {festivalTheme.emoji}
            </div>

            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
              
              {/* Thumbnails */}
              <div className="flex sm:flex-col gap-3 justify-center">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-amber-300 scale-105 shadow-lg'
                        : 'border-white/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 h-[320px] sm:h-[420px] rounded-3xl overflow-hidden bg-black/20 relative group border border-white/20 shadow-inner">
                <img
                  src={galleryImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <span className="absolute top-4 left-4 bg-amber-400 text-brown-dark font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                  {product.tag}
                </span>
              </div>

            </div>

            {/* Right Column: Details & Ordering */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amber-400/90 text-brown-dark text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span>4.9</span> <span>⭐</span>
                  </span>
                  <span className="text-xs text-cream/80 font-medium">({reviews.length} Festive Reviews)</span>
                </div>

                <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-white/15">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-cream/70 font-medium">
                    ({product.size} · Inclusive of Taxes &amp; Festive Packaging)
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-cream/90 leading-relaxed mb-6">
                  {product.desc}
                </p>

                <div className="bg-white/10 rounded-2xl p-4 border border-amber-400/30 space-y-2 mb-6 text-xs">
                  <span className="font-bold text-amber-200 uppercase tracking-wider block text-[0.68rem]">
                    ✨ What's Inside This {festivalTheme.name} Box:
                  </span>
                  <ul className="space-y-1.5 text-cream/90 font-medium">
                    <li className="flex items-center gap-2">
                      <span>{festivalTheme.emoji}</span>
                      <span>Handcrafted {festivalTheme.name} Festive Specials Included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>🎁</span>
                      <span>Luxury Ribbon Gift Box Packaging</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>📜</span>
                      <span>Personalized {festivalTheme.name} Greeting Card</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-cream">
                    <label htmlFor="festive-card-msg">Personalized Card Note (Optional)</label>
                    <span className="text-[0.68rem] text-cream/60">{customCardMessage.length}/30</span>
                  </div>
                  <input
                    id="festive-card-msg"
                    type="text"
                    maxLength={30}
                    value={customCardMessage}
                    onChange={(e) => setCustomCardMessage(e.target.value)}
                    placeholder="e.g. Happy Celebrations! Love & Blessings ♡"
                    className="w-full px-4 py-2.5 rounded-2xl text-xs bg-white/15 border border-white/20 text-white placeholder-cream/50 focus:outline-none focus:border-amber-300"
                  />
                </div>

                <div className="bg-amber-400/20 rounded-2xl p-3.5 flex items-center justify-between text-xs mb-6 border border-amber-300/30">
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <span>🚚</span> Guaranteed Delivery before <strong className="text-amber-300">{festivalTheme.name}</strong>
                  </span>
                  <span className="text-[0.68rem] bg-amber-400 text-brown-dark font-extrabold px-2 py-0.5 rounded-full uppercase">Express Delivery</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleAddToCart(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-brown-dark text-sm font-extrabold shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
                >
                  <span>🎁 {product.isCustomWhatsApp ? 'Customize on WhatsApp' : 'Order Festive Hamper'}</span>
                  <span>|</span>
                  <span className="text-brown-dark font-extrabold text-base">₹{product.price}</span>
                </button>

                <a
                  href={`https://wa.me/918860503685?text=${encodeURIComponent(`Hi Batter & Bliss! I want to inquire/order ${product.name} (${product.price})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>💬 Chat with Us on WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

          <section className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-amber-400/30 shadow-lg mb-16 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
              <div>
                <h2 className="font-serif text-3xl font-bold text-white mb-1">
                  Festive Gifting Reviews ⭐
                </h2>
                <p className="text-xs text-cream/80">Loved by customers during {festivalTheme.name}</p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="py-2.5 px-4 rounded-xl bg-amber-400 text-brown-dark text-xs font-extrabold hover:bg-amber-300 transition-colors shadow-md cursor-pointer"
              >
                {showReviewForm ? 'Cancel Review' : '✍️ Write Festive Review'}
              </button>
            </div>

            {submittedMessage && (
              <div className="p-4 rounded-2xl bg-emerald-900/90 border border-emerald-400 text-emerald-100 text-xs font-bold">
                🎉 Thank you! Your review for {product.name} has been published.
              </div>
            )}

            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-black/20 p-6 rounded-2xl border border-white/20 space-y-4 animate-stepIn">
                <h3 className="font-serif text-base font-bold text-white">Write Your Review</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/15 border border-white/20 text-xs text-white placeholder-cream/60"
                  />
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button type="button" key={s} onClick={() => setNewRating(s)} className="text-lg">
                        {s <= newRating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Share your festive gifting experience..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/15 border border-white/20 text-xs text-white placeholder-cream/60"
                />
                <button type="submit" className="px-5 py-2 bg-amber-400 text-brown-dark font-bold text-xs rounded-xl cursor-pointer">
                  Submit Review
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{rev.name}</span>
                    <span className="text-amber-300">{'⭐'.repeat(rev.rating)}</span>
                  </div>
                  <h4 className="font-serif text-xs font-bold text-amber-200">{rev.title}</h4>
                  <p className="text-xs text-cream/80 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
              More {festivalTheme.name} <span className="script text-amber-300">Special Gift Boxes</span> 🎁
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {festivalTheme.specialProducts.filter(p => p.id !== product.id).map(fp => (
                <div
                  key={fp.id}
                  onClick={() => navigate(`/festive/${fp.id}`)}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-amber-400/30 shadow-md hover:shadow-xl transition-all cursor-pointer group flex items-center gap-4 gold-glow-border"
                >
                  <img
                    src={fp.img || '/images/hamper.png'}
                    alt={fp.name}
                    className="w-20 h-20 rounded-2xl object-cover group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {fp.name}
                    </h3>
                    <p className="text-xs font-bold text-amber-300 mt-1">₹{fp.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}
