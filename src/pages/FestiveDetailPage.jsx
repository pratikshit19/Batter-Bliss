import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { FESTIVALS, getActiveFestival } from '../utils/festivalConfig'

export default function FestiveDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, setIsCartOpen } = useCart()

  // Find festive product from all festivals configuration
  let festivalTheme = getActiveFestival() || FESTIVALS.rakhi
  let product = null

  // Search across all festival configs for product with id
  for (const fKey in FESTIVALS) {
    const f = FESTIVALS[fKey]
    const p = f.specialProducts?.find(sp => sp.id === id || sp.id === id?.toLowerCase())
    if (p) {
      product = p
      festivalTheme = f
      break
    }
  }

  // Fallback to first festive product if not matched
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
      title: 'Amazing Rakhi Gift Box!',
      comment: 'My brother in Delhi was so happy! The brownies were fudgy and fresh, and the Rakhi design was elegant.',
      helpful: 12
    },
    {
      id: 2,
      name: 'Aman Deep',
      date: '1 week ago',
      rating: 5,
      verified: true,
      title: 'Luxury festive packaging',
      comment: 'The velvet box and presentation were top tier. Pure luxury taste for festive gifting.',
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

  // Festival theme colors
  const isRakhi = festivalTheme.id === 'rakhi'
  const isDiwali = festivalTheme.id === 'diwali'
  const isChristmas = festivalTheme.id === 'christmas'
  const isHoli = festivalTheme.id === 'holi'

  const themeGradient = isDiwali
    ? 'from-amber-950 via-yellow-900 to-red-950'
    : isChristmas
    ? 'from-red-950 via-emerald-950 to-slate-900'
    : isHoli
    ? 'from-pink-950 via-purple-950 to-cyan-950'
    : 'from-purple-950 via-purple-900 to-emerald-950'

  return (
    <>
      <Navbar />

      <main className={`pt-40 sm:pt-44 pb-20 bg-gradient-to-b ${themeGradient} text-white min-h-screen transition-all duration-500`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Breadcrumbs */}
          <nav className="text-xs text-cream/70 mb-6 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-1">
            <Link to="/" className="hover:text-rose-300 transition-colors">Home</Link>
            <span>›</span>
            <span className="text-rose-200 font-semibold">{festivalTheme.name} Special</span>
            <span>›</span>
            <span className="text-white font-bold truncate">{product.name}</span>
          </nav>

          {/* Festive Banner Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-md border border-white/20">
            <span>{festivalTheme.emoji} {festivalTheme.name} Festive Gift Box</span>
          </div>

          {/* Main Product Layout */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            
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
                {/* Title & Rating */}
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amber-400/90 text-brown-dark text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span>4.9</span> <span>⭐</span>
                  </span>
                  <span className="text-xs text-cream/80 font-medium">({reviews.length} Festive Reviews)</span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-white/15">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-cream/70 font-medium">
                    ({product.size} · Inclusive of Taxes &amp; Festive Packaging)
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-cream/90 leading-relaxed mb-6">
                  {product.desc}
                </p>

                {/* Festive Included Items List */}
                <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2 mb-6 text-xs">
                  <span className="font-bold text-amber-200 uppercase tracking-wider block text-[0.68rem]">
                    ✨ What's Inside This {festivalTheme.name} Box:
                  </span>
                  <ul className="space-y-1.5 text-cream/90 font-medium">
                    <li className="flex items-center gap-2">
                      <span>{festivalTheme.emoji}</span>
                      <span>
                        {isRakhi
                          ? '1 Handcrafted Designer Rakhi included'
                          : isDiwali
                          ? '2 Decorative Brass Diya Candles'
                          : isChristmas
                          ? '1 Christmas Tree Ornament'
                          : '2 Packs Organic Herbal Gulal Colors'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>🌾</span>
                      <span>Pure Roli &amp; Chawal in mini glass bottles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>🎁</span>
                      <span>Luxury Velvet Ribbon Gift Box Packaging</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>📜</span>
                      <span>Personalized {festivalTheme.name} Greeting Card</span>
                    </li>
                  </ul>
                </div>

                {/* Custom Festive Card Message Input */}
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
                    placeholder={isRakhi ? "e.g. Best Brother Ever! Love, Riya ♡" : "e.g. Wishing you a Happy Diwali! ✨"}
                    className="w-full px-4 py-2.5 rounded-2xl text-xs bg-white/15 border border-white/20 text-white placeholder-cream/50 focus:outline-none focus:border-amber-300"
                  />
                </div>

                {/* Guaranteed Delivery Estimate */}
                <div className="bg-amber-400/20 rounded-2xl p-3.5 flex items-center justify-between text-xs mb-6 border border-amber-300/30">
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <span>🚚</span> Guaranteed Delivery before <strong className="text-amber-300">{festivalTheme.name}</strong>
                  </span>
                  <span className="text-[0.68rem] bg-amber-400 text-brown-dark font-extrabold px-2 py-0.5 rounded-full uppercase">Express Delivery</span>
                </div>
              </div>

              {/* Action Buttons */}
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
                  href={`https://wa.me/918860503685?text=${encodeURIComponent(`Hi Batter & Bliss! ${festivalTheme.emoji} I want to inquire/order ${product.name} (${product.price})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>💬 Chat with Us on WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

          {/* Festive Reviews Section */}
          <section className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/20 shadow-lg mb-16 space-y-6">
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

          {/* More Festive Products */}
          <section className="mt-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
              More {festivalTheme.name} <span className="script text-amber-300">Special Gift Boxes</span> 🎁
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {festivalTheme.specialProducts.filter(p => p.id !== product.id).map(fp => (
                <div
                  key={fp.id}
                  onClick={() => navigate(`/festive/${fp.id}`)}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 shadow-md hover:shadow-xl transition-all cursor-pointer group flex items-center gap-4"
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
