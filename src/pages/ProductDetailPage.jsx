import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { findProductById, getStoredMenuItems } from '../utils/menuManager'

// Sample initial reviews tailored per product category
const SAMPLE_REVIEWS = [
  {
    id: 1,
    name: 'Ananya Sharma',
    date: '2 days ago',
    rating: 5,
    verified: true,
    title: 'Absolute perfection!',
    comment: 'Ordered this for a family gathering and everyone was blown away. Extremely rich, soft, and you cannot tell it is eggless! Will definitely order again.',
    helpful: 14
  },
  {
    id: 2,
    name: 'Rohan Verma',
    date: '1 week ago',
    rating: 5,
    verified: true,
    title: 'Best quality bake in Delhi NCR',
    comment: 'The packaging was aesthetic and fresh. Delivered right on time for our celebration. Pure luxury taste!',
    helpful: 8
  },
  {
    id: 3,
    name: 'Priya Patel',
    date: '2 weeks ago',
    rating: 4,
    verified: true,
    title: 'Irresistibly fresh',
    comment: 'Super fresh ingredients and great texture. Perfect balance of sweetness.',
    helpful: 5
  }
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, setIsCartOpen } = useCart()

  const [product, setProduct] = useState(() => findProductById(id))
  const [selectedSize, setSelectedSize] = useState('500g')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [customMessage, setCustomMessage] = useState('')
  const [readMore, setReadMore] = useState(false)

  // Reviews state (persisted per product)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newName, setNewName] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submittedMessage, setSubmittedMessage] = useState(false)

  // Re-fetch product & product reviews if URL parameter ID changes
  useEffect(() => {
    const found = findProductById(id)
    setProduct(found)
    setSelectedSize(found.p1kg ? '500g' : (found.unit || '1 Unit'))
    setSelectedImageIndex(0)
    setCustomMessage('')
    setShowReviewForm(false)
    setSubmittedMessage(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Load custom user reviews for this product from localStorage
    try {
      const saved = localStorage.getItem(`batterbliss_reviews_${id}`)
      if (saved) {
        setReviews(JSON.parse(saved))
      } else {
        setReviews(SAMPLE_REVIEWS)
      }
    } catch {
      setReviews(SAMPLE_REVIEWS)
    }
  }, [id])

  if (!product) return null

  const isDualWeight = Boolean(product.p1kg)
  const currentPrice = isDualWeight
    ? (selectedSize === '1kg' ? product.p1kg : product.p500)
    : product.p500

  const sizeLabel = isDualWeight
    ? (selectedSize === '1kg' ? '1kg' : '500g')
    : (product.unit || '1 Unit')

  // Generate gallery thumbnails
  const defaultImg = product.img || (product.categoryId === 'brownies' ? '/images/brownies.png' : product.categoryId === 'cake-jars' ? '/images/hamper.png' : '/images/cake.png')
  const galleryImages = (product.images && product.images.length > 0)
    ? product.images
    : [defaultImg, defaultImg, defaultImg]

  const handleAddToCart = (openCart = false) => {
    const key = `${product.name.toLowerCase().replace(/\s+/g, '-')}_${sizeLabel}`
    addToCart(key, {
      name: `${product.name} (${sizeLabel})${customMessage.trim() ? ` - "${customMessage}"` : ''}`,
      price: currentPrice,
      size: sizeLabel,
      img: defaultImg,
      customMessage: customMessage.trim()
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
      title: newTitle.trim() || 'Delicious Bake!',
      comment: newComment.trim(),
      helpful: 0
    }

    const updated = [newRev, ...reviews]
    setReviews(updated)
    try {
      localStorage.setItem(`batterbliss_reviews_${id}`, JSON.stringify(updated))
    } catch (err) {
      console.error(err)
    }

    setNewName('')
    setNewTitle('')
    setNewComment('')
    setNewRating(5)
    setShowReviewForm(false)
    setSubmittedMessage(true)
    setTimeout(() => setSubmittedMessage(false), 4000)
  }

  const handleHelpfulClick = (reviewId) => {
    const updated = reviews.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r)
    setReviews(updated)
    try {
      localStorage.setItem(`batterbliss_reviews_${id}`, JSON.stringify(updated))
    } catch (err) {
      console.error(err)
    }
  }

  // Related products
  const menuData = getStoredMenuItems()
  const currentCategory = menuData.find(c => c.id === product.categoryId) || menuData[0]
  const relatedProducts = currentCategory.items
    .filter(item => item.name !== product.name)
    .slice(0, 3)

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 4.9).toFixed(1)

  return (
    <>
      <Navbar />

      <main className="pt-40 sm:pt-44 pb-20 bg-cream-light min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Breadcrumbs */}
          <nav className="text-xs text-brown-light/70 mb-6 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-1">
            <Link to="/" className="hover:text-rose transition-colors">Home</Link>
            <span>›</span>
            <Link to="/menu" state={{ category: product.categoryId }} className="hover:text-rose transition-colors">
              {product.categoryName}
            </Link>
            <span>›</span>
            <span className="text-brown-dark font-semibold truncate">{product.name}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose/15 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            
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
                        ? 'border-rose scale-105 shadow-md'
                        : 'border-rose/15 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 h-[320px] sm:h-[420px] rounded-3xl overflow-hidden bg-cream-light relative group border border-rose/15">
                <img
                  src={galleryImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Wishlist Heart Icon */}
                <button
                  aria-label="Add to wishlist"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose shadow-md hover:scale-110 transition-transform cursor-pointer"
                >
                  ♡
                </button>
              </div>

            </div>

            {/* Right Column: Details & Ordering */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Title & Rating */}
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark mb-2 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span>{avgRating}</span> <span>⭐</span>
                  </span>
                  <span className="text-xs text-brown-light/70 font-medium">({reviews.length} Reviews)</span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-rose/15">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-rose">
                    ₹{currentPrice}
                  </span>
                  <span className="text-xs text-brown-light/70 font-medium">
                    (Inclusive of all taxes)
                  </span>
                </div>

                {/* Description */}
                <div className="text-xs sm:text-sm text-brown-light leading-relaxed mb-6">
                  <p>
                    {product.description
                      ? (readMore || product.description.length <= 140
                          ? product.description
                          : `${product.description.slice(0, 140)}...`)
                      : (readMore
                          ? `Handcrafted with pure butter, premium cocoa, and Belgian chocolate. Every batch of our ${product.name} is freshly baked right after your order. Packed with care in our signature eco-friendly aesthetic box.`
                          : `Handcrafted with pure butter, premium cocoa, and Belgian chocolate...`)}
                  </p>
                  {(product.description ? product.description.length > 140 : true) && (
                    <button
                      onClick={() => setReadMore(!readMore)}
                      className="text-rose font-bold text-xs mt-1 hover:underline cursor-pointer"
                    >
                      {readMore ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>

                {/* Select Weight / Size */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-brown-dark">
                    <span>Select Size / Weight</span>
                    {isDualWeight && (
                      <span className="text-rose font-semibold text-[0.72rem]">
                        {selectedSize === '1kg' ? '👥 Serves 8 - 10 People' : '👥 Serves 4 - 5 People'}
                      </span>
                    )}
                  </div>

                  {isDualWeight ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedSize('500g')}
                        className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer border text-center justify-center ${
                          selectedSize === '500g'
                            ? 'bg-rose text-white border-rose shadow-md scale-[1.02]'
                            : 'bg-cream text-brown-dark border-rose/20 hover:bg-rose/10'
                        }`}
                      >
                        <span>0.5 Kg (500g)</span>
                      </button>

                      <button
                        onClick={() => setSelectedSize('1kg')}
                        className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer border text-center justify-center ${
                          selectedSize === '1kg'
                            ? 'bg-brown-dark text-amber-300 border-brown-dark shadow-md scale-[1.02]'
                            : 'bg-cream text-brown-dark border-rose/20 hover:bg-rose/10'
                        }`}
                      >
                        <span>1 Kg</span>
                      </button>
                    </div>
                  ) : (
                    <div className="inline-block py-2.5 px-4 rounded-2xl bg-cream border border-rose/20 text-xs font-bold text-brown-dark">
                      {product.unit || '1 Unit'}
                    </div>
                  )}
                </div>

                {/* Custom Message Input */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-brown-dark">
                    <label htmlFor="cake-message">Cake / Box Message (Optional)</label>
                    <span className="text-[0.68rem] text-brown-light/60">{customMessage.length}/25</span>
                  </div>
                  <input
                    id="cake-message"
                    type="text"
                    maxLength={25}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="e.g. Happy Birthday Sam! ♡"
                    className="w-full px-4 py-2.5 rounded-2xl text-xs bg-cream-light/60 border border-rose/20 focus:outline-none focus:border-rose text-brown-dark"
                  />
                </div>

                {/* Earliest Delivery Estimate */}
                <div className="bg-rose/10 rounded-2xl p-3.5 flex items-center justify-between text-xs mb-6 border border-rose/15">
                  <span className="text-brown-dark font-semibold flex items-center gap-1.5">
                    <span>⏱</span> Earliest Delivery: <strong className="text-rose">Today in Delhi NCR</strong>
                  </span>
                  <span className="text-[0.68rem] text-rose font-bold uppercase">Freshly Baked</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Buy Now Primary CTA - Luxury Brown to Rose Gradient */}
                <button
                  onClick={() => handleAddToCart(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brown-dark via-brown-mid to-rose text-cream text-sm font-bold shadow-[0_8px_25px_rgba(44,26,14,0.25)] hover:shadow-[0_12px_30px_rgba(44,26,14,0.35)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose/30"
                >
                  <span>Buy Now</span>
                  <span>|</span>
                  <span className="text-amber-300 font-extrabold text-base">₹{currentPrice}</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="py-3 px-4 rounded-2xl bg-cream hover:bg-rose/15 text-brown-dark hover:text-rose text-xs font-bold border border-rose/25 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>🛒 Add to Cart</span>
                  </button>

                  <a
                    href={`https://wa.me/918860503685?text=${encodeURIComponent(`Hi Batter & Bliss! I would like to inquire/order ${product.name} (${sizeLabel})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-2xl bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>💬 WhatsApp Order</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* ── CUSTOMER REVIEWS & RATINGS SECTION ───────────────────────────────────── */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-rose/15 shadow-sm mb-16 space-y-8">
            
            {/* Header & Rating Breakdown Summary */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-rose/15">
              <div>
                <h2 className="font-serif text-3xl font-bold text-brown-dark mb-1">
                  Customer Reviews <span className="text-rose text-2xl font-normal font-sans">({reviews.length})</span>
                </h2>
                <p className="text-xs text-brown-light font-medium">
                  Real feedback from customers who ordered {product.name}
                </p>
              </div>

              {/* Rating Summary Card */}
              <div className="flex items-center gap-6 bg-cream-light/80 p-4 rounded-2xl border border-rose/15">
                <div className="text-center px-2">
                  <span className="font-serif text-4xl font-bold text-brown-dark block leading-none">{avgRating}</span>
                  <div className="text-amber-400 text-sm mt-1">⭐⭐⭐⭐⭐</div>
                  <span className="text-[0.68rem] text-brown-light/70 font-semibold mt-0.5 block">Overall Score</span>
                </div>

                <div className="h-12 w-px bg-rose/15" />

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-brown-dark font-semibold">5 Stars</span>
                    <div className="w-28 sm:w-36 h-2 rounded-full bg-cream overflow-hidden border border-rose/10">
                      <div className="h-full bg-amber-400 rounded-full w-[85%]" />
                    </div>
                    <span className="text-brown-light text-[0.68rem]">85%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-brown-dark font-semibold">4 Stars</span>
                    <div className="w-28 sm:w-36 h-2 rounded-full bg-cream overflow-hidden border border-rose/10">
                      <div className="h-full bg-amber-400 rounded-full w-[15%]" />
                    </div>
                    <span className="text-brown-light text-[0.68rem]">15%</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="py-2.5 px-4 rounded-xl bg-brown-dark text-cream hover:bg-brown-mid text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap ml-2"
                >
                  {showReviewForm ? 'Cancel Review' : '✍️ Write a Review'}
                </button>
              </div>
            </div>

            {/* Notification when review submitted */}
            {submittedMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <span>🎉 Thank you! Your review for {product.name} has been published successfully.</span>
              </div>
            )}

            {/* Interactive Write a Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-cream-light/60 p-6 rounded-2xl border border-rose/20 space-y-4 animate-stepIn">
                <h3 className="font-serif text-lg font-bold text-brown-dark">
                  Write Your Review for {product.name}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brown-dark mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Shruti Goyal"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose/20 text-xs text-brown-dark focus:outline-none focus:border-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brown-dark mb-1">Select Star Rating</label>
                    <div className="flex items-center gap-1 py-1.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={`text-xl cursor-pointer transition-transform ${star <= newRating ? 'scale-110' : 'opacity-30'}`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brown-dark mb-1">Review Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Heavenly texture and fresh taste!"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose/20 text-xs text-brown-dark focus:outline-none focus:border-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brown-dark mb-1">Detailed Review *</label>
                  <textarea
                    rows={3}
                    required
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Tell us about the flavor, sweetness, packaging, or delivery experience..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-rose/20 text-xs text-brown-dark focus:outline-none focus:border-rose"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-brown-light hover:text-brown-dark"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-rose text-white text-xs font-bold hover:bg-rose/90 shadow-xs cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* List of Reviews */}
            <div className="space-y-4">
              {reviews.map(rev => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-cream-light/40 border border-rose/10 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brown-dark text-amber-200 font-serif font-bold text-sm flex items-center justify-center">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-brown-dark">{rev.name}</h4>
                          {rev.verified && (
                            <span className="text-[0.62rem] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              ✓ Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[0.68rem] text-brown-light/70">{rev.date}</span>
                      </div>
                    </div>

                    <div className="text-amber-400 text-xs">
                      {'⭐'.repeat(rev.rating)}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-serif font-bold text-sm text-brown-dark mb-1">{rev.title}</h5>
                    <p className="text-xs text-brown-light leading-relaxed">{rev.comment}</p>
                  </div>

                  <div className="pt-2 border-t border-rose/10 flex items-center justify-between text-[0.7rem] text-brown-light/70">
                    <span>Was this review helpful?</span>
                    <button
                      onClick={() => handleHelpfulClick(rev.id)}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-rose/10 border border-rose/15 text-brown-dark font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>👍</span>
                      <span>Helpful ({rev.helpful})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brown-dark mb-6">
                You May Also <span className="script text-rose">Love</span> 💖
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProducts.map(rel => {
                  const relSlug = rel.id || rel.name.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <div
                      key={rel.name}
                      onClick={() => navigate(`/product/${relSlug}`)}
                      className="bg-white rounded-3xl overflow-hidden border border-rose/15 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center gap-4"
                    >
                      <img
                        src={rel.img || defaultImg}
                        alt={rel.name}
                        className="w-20 h-20 rounded-2xl object-cover group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="font-serif text-sm font-bold text-brown-dark group-hover:text-rose transition-colors">
                          {rel.name}
                        </h3>
                        <p className="text-xs font-bold text-rose mt-1">₹{rel.p500}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
