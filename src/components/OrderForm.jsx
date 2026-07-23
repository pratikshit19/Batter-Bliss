import { useState } from 'react'
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll'
import { supabase } from '../lib/supabase'

/* ─── Product Catalogue ─────────────────────────────────────────── */
// sizes: [{label, price, unit}]  — single-size items have one entry
const CATALOG = [
  // ── Brownies ────────────────────────────────────────────────────
  {
    id: 'walnut-brownie', category: '🍫 Brownies',
    name: 'Walnut Brownie', desc: 'Fudgy centre with crunchy walnut bits',
    img: '/images/brownies.png',
    sizes: [{ label: '500g', price: 550 }, { label: '1kg', price: 1025 }],
  },
  {
    id: 'choc-brownie', category: '🍫 Brownies',
    name: 'Chocolate Brownie', desc: 'Rich, dense & perfectly crinkly top',
    img: '/images/brownies.png',
    sizes: [{ label: '500g', price: 550 }, { label: '1kg', price: 1025 }],
  },
  {
    id: 'fudge-brownie', category: '🍫 Brownies',
    name: 'Fudge Brownie', desc: 'Extra fudgy, melt-in-your-mouth texture',
    img: '/images/brownies.png',
    sizes: [{ label: '500g', price: 600 }, { label: '1kg', price: 1150 }],
  },
  {
    id: 'nutella-brownie', category: '🍫 Brownies',
    name: 'Nutella Brownie', desc: 'Loaded with Nutella inside & out',
    img: '/images/brownies.png',
    sizes: [{ label: '500g', price: 650 }, { label: '1kg', price: 1175 }],
  },
  {
    id: 'chocochip-brownie', category: '🍫 Brownies',
    name: 'Choco-Chip Brownie', desc: 'Extra chocolatey with loaded chips',
    img: '/images/brownies.png',
    sizes: [{ label: '500g', price: 550 }, { label: '1kg', price: 1025 }],
  },
  {
    id: 'brownie-bites', category: '🍫 Brownies',
    name: 'Brownie Bites', desc: 'Bite-sized & dangerously addictive',
    img: '/images/brownies.png',
    sizes: [{ label: 'per piece', price: 80 }],
  },
  // ── Tea Cakes ───────────────────────────────────────────────────
  {
    id: 'vanilla-cake', category: '☕ Tea Cakes',
    name: 'Vanilla Cake', desc: 'Classic soft vanilla loaf',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 400 }, { label: '1kg', price: 750 }],
  },
  {
    id: 'marble-cake', category: '☕ Tea Cakes',
    name: 'Marble Cake', desc: 'Classic swirled loaf, soft & moist',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 450 }, { label: '1kg', price: 850 }],
  },
  {
    id: 'choc-cake', category: '☕ Tea Cakes',
    name: 'Chocolate Cake', desc: 'Deep chocolate, dense & moist',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 475 }, { label: '1kg', price: 925 }],
  },
  {
    id: 'dry-fruit-cake', category: '☕ Tea Cakes',
    name: 'Dry Fruit Cake', desc: 'Loaded with mixed dry fruits',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 475 }, { label: '1kg', price: 925 }],
  },
  {
    id: 'vanilla-chocochip-cake', category: '☕ Tea Cakes',
    name: 'Vanilla Choco-Chip Cake', desc: 'Vanilla loaf with chocolate chips',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 475 }, { label: '1kg', price: 925 }],
  },
  {
    id: 'mahwa-cake', category: '☕ Tea Cakes',
    name: 'Mahwa Cake', desc: 'Unique Mahwa flavour, soft & aromatic',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 500 }, { label: '1kg', price: 950 }],
  },
  {
    id: 'banana-walnut-cake', category: '☕ Tea Cakes',
    name: 'Banana Walnut Cake', desc: 'Moist banana loaf with walnut crunch',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 550 }, { label: '1kg', price: 1050 }],
  },
  {
    id: 'coffee-cake', category: '☕ Tea Cakes',
    name: 'Coffee Cake', desc: 'Rich coffee flavour in every bite',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 450 }, { label: '1kg', price: 850 }],
  },
  {
    id: 'coffee-walnut-cake', category: '☕ Tea Cakes',
    name: 'Coffee Walnut Cake', desc: 'Coffee loaf with crunchy walnut bits',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 500 }, { label: '1kg', price: 950 }],
  },
  {
    id: 'nutella-cake', category: '☕ Tea Cakes',
    name: 'Nutella Cake', desc: 'Nutella-swirled moist loaf',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 500 }, { label: '1kg', price: 950 }],
  },
  {
    id: 'lemon-blueberry-cake', category: '☕ Tea Cakes',
    name: 'Lemon Blueberry Cake', desc: 'Zesty lemon with juicy blueberries',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 550 }, { label: '1kg', price: 1025 }],
  },
  {
    id: 'classic-chocochip-cake', category: '☕ Tea Cakes',
    name: 'Classic Choco-Chip Cake', desc: 'Chocolate chip studded soft loaf',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 500 }, { label: '1kg', price: 950 }],
  },
  {
    id: 'double-chocochip-cake', category: '☕ Tea Cakes',
    name: 'Double Choco-Chip Cake', desc: 'Double the chips, double the joy',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 550 }, { label: '1kg', price: 1000 }],
  },
  // ── Guilt-Free ──────────────────────────────────────────────────
  {
    id: 'gf-banana-walnut', category: '🌿 Guilt-Free',
    name: 'Banana Walnut Cake', desc: 'Wholesome banana loaf with walnuts',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 575 }, { label: '1kg', price: 1100 }],
  },
  {
    id: 'oats-banana-cake', category: '🌿 Guilt-Free',
    name: 'Oats Banana Cake', desc: 'Oat-based banana cake, naturally sweet',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 500 }, { label: '1kg', price: 950 }],
  },
  {
    id: 'oats-jaggery-cake', category: '🌿 Guilt-Free',
    name: 'Oats Jaggery Atta Cake', desc: 'Wholewheat oat cake with jaggery',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 500 }, { label: '1kg', price: 950 }],
  },
  {
    id: 'wholewheat-dates-cake', category: '🌿 Guilt-Free',
    name: 'Wholewheat Dates Cake', desc: 'Naturally sweetened with dates',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 550 }, { label: '1kg', price: 1025 }],
  },
  {
    id: 'dates-walnut-cake', category: '🌿 Guilt-Free',
    name: 'Dates and Walnut Cake', desc: 'Dates & walnut loaf, rich & wholesome',
    img: '/images/cake.png',
    sizes: [{ label: '500g', price: 600 }, { label: '1kg', price: 1150 }],
  },
  // ── Cake Jars ───────────────────────────────────────────────────
  {
    id: 'choc-cake-jar', category: '🍯 Cake Jars',
    name: 'Chocolate Cake Jar', desc: 'Layered chocolate cake in a jar',
    img: '/images/hamper.png',
    sizes: [{ label: 'per jar', price: 250 }],
  },
  {
    id: 'truffle-cake-jar', category: '🍯 Cake Jars',
    name: 'Truffle Cake Jar', desc: 'Decadent truffle layered jar',
    img: '/images/hamper.png',
    sizes: [{ label: 'per jar', price: 275 }],
  },
  {
    id: 'dark-choc-cake-jar', category: '🍯 Cake Jars',
    name: 'Dark Chocolate Cake Jar', desc: 'Intensely rich dark chocolate jar',
    img: '/images/hamper.png',
    sizes: [{ label: 'per jar', price: 250 }],
  },
  {
    id: 'nutella-cake-jar', category: '🍯 Cake Jars',
    name: 'Nutella Cake Jar', desc: 'Nutella-filled dreamy jar cake',
    img: '/images/hamper.png',
    sizes: [{ label: 'per jar', price: 350 }],
  },
  {
    id: 'kitkar-cake-jar', category: '🍯 Cake Jars',
    name: 'Kitkar Cake Jar', desc: 'Kit-Kat crunch layered in a jar',
    img: '/images/hamper.png',
    sizes: [{ label: 'per jar', price: 300 }],
  },
]

// Flat lookup: cartKey ("id_size") → { name, price, productId }
const CART_LOOKUP = {}
CATALOG.forEach(p =>
  p.sizes.forEach(s => {
    CART_LOOKUP[`${p.id}_${s.label}`] = { name: `${p.name} (${s.label})`, price: s.price, productId: p.id }
  })
)

const CATEGORIES = [...new Set(CATALOG.map(p => p.category))]
const GIFT_WRAP_PRICE = 50
const STEPS = ['Select Items', 'Your Details', 'Review & Pay']

/* ─── Load Razorpay checkout.js ─────────────────────────────────── */
const loadRazorpay = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })

/* ─── Component ─────────────────────────────────────────────────── */
export default function OrderForm() {
  useAnimateOnScroll()

  const [activeTab, setActiveTab]       = useState(CATEGORIES[0])
  const [selectedSizes, setSelectedSizes] = useState({}) // { productId: sizeLabel }
  const [step, setStep]                 = useState(0)
  const [cart, setCart]                 = useState({})   // { "id_size": qty }
  const [details, setDetails]           = useState({
    name: '', phone: '', delivery_date: '', area: '', occasion: '', gift_wrap: false,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)   // null | { paymentId, total }
  const [error,   setError]   = useState('')

  /* Size selection helpers */
  const getSize   = id => selectedSizes[id] || null
  const pickSize  = (id, label) => setSelectedSizes(s => ({ ...s, [id]: label }))

  /* Cart helpers — key = "productId_sizeLabel" */
  const cartQty  = key => cart[key] || 0
  const setCartQty = (key, q) => setCart(c => {
    if (q <= 0) { const { [key]: _, ...r } = c; return r }
    return { ...c, [key]: q }
  })

  /* Derived cart data */
  const cartEntries = Object.entries(cart).filter(([, q]) => q > 0)
  const cartItems   = cartEntries.map(([key, q]) => ({ key, q, ...CART_LOOKUP[key] }))
  const subtotal    = cartItems.reduce((s, ci) => s + ci.price * ci.q, 0)
  const giftWrap    = details.gift_wrap ? GIFT_WRAP_PRICE : 0
  const total       = subtotal + giftWrap

  const handleDetail = e => {
    const { name, value, type, checked } = e.target
    setDetails(d => ({ ...d, [name]: type === 'checkbox' ? checked : value }))
  }

  /* Step navigation */
  const goNext = () => {
    if (step === 0 && cartItems.length === 0) {
      setError('Please add at least one item to continue. ♡')
      return
    }
    if (step === 1) {
      if (!details.name.trim() || !details.phone.trim() ||
        !details.delivery_date || !details.area.trim()) {
        setError('Please fill in all required (*) fields.')
        return
      }
    }
    setError('')
    setStep(s => s + 1)
  }
  const goBack = () => { setError(''); setStep(s => s - 1) }

  /* Razorpay payment */
  const handlePayment = async () => {
    setLoading(true)
    setError('')

    const loaded = await loadRazorpay()
    if (!loaded) {
      setError('Could not load payment gateway. Please check your internet connection.')
      setLoading(false)
      return
    }

    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!rzpKey || rzpKey.startsWith('rzp_test_XXXX')) {
      setError('Razorpay Key ID is not configured. Add VITE_RAZORPAY_KEY_ID to your .env file.')
      setLoading(false)
      return
    }

    const description = cartItems
      .map(ci => `${ci.name} ×${ci.q}`)
      .join(', ')

    const options = {
      key: rzpKey,
      amount: total * 100,    // paise
      currency: 'INR',
      name: 'Batter & Bliss',
      description,
      prefill: {
        name: details.name,
        contact: details.phone,
      },
      notes: {
        area: details.area,
        delivery_date: details.delivery_date,
        occasion: details.occasion || '',
      },
      theme: { color: '#C4846A' },

      handler: async response => {
        /* Save order to Supabase after successful payment */
        try {
          await supabase.from('orders').insert([{
            name: details.name,
            phone: details.phone,
            product: description,
            quantity: cartItems.map(ci => `${ci.name}: ${ci.q}`).join(' | '),
            delivery_date: details.delivery_date,
            area: details.area,
            occasion: details.occasion,
            gift_wrap: details.gift_wrap,
            payment_id: response.razorpay_payment_id,
            payment_status: 'paid',
            amount_total: total,
            status: 'confirmed',
          }])
        } catch (dbErr) {
          /* Payment succeeded — DB error is non-blocking */
          console.error('Supabase insert error:', dbErr)
        }
        setSuccess({ paymentId: response.razorpay_payment_id, total })
        setLoading(false)
      },

      modal: {
        ondismiss: () => setLoading(false),
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', resp => {
      setError(`Payment failed: ${resp.error.description}`)
      setLoading(false)
    })
    rzp.open()
  }

  /* Shared class names */
  const inputCls = [
    'w-full px-4 py-3 rounded-xl border border-rose/25 bg-white',
    'text-brown-dark text-sm placeholder-brown-light/50 font-sans',
    'focus:outline-none focus:border-rose/60 focus:ring-2 focus:ring-rose/15',
    'transition-all duration-200',
  ].join(' ')
  const labelCls = 'block text-[0.7rem] font-semibold text-brown-mid tracking-widest uppercase mb-1.5'

  /* ── Success screen ─────────────────────────────────────────────── */
  if (success) {
    return (
      <section id="order" className="py-24 bg-gradient-to-b from-cream-light to-cream">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="text-7xl mb-5 animate-bounce">🎉</div>
          <h3 className="font-serif text-3xl font-bold text-brown-dark mb-3">
            Order Confirmed!
          </h3>
          <p className="text-brown-light leading-relaxed mb-2">
            Your payment of <strong className="text-brown-dark">₹{success.total}</strong> was
            successful. We'll WhatsApp you within 2 hours to confirm your delivery slot!
          </p>
          <p className="text-xs text-brown-light/60 mb-6">
            Payment ID: {success.paymentId}
          </p>

          {/* Order recap */}
          <div className="bg-white rounded-2xl p-5 border border-rose/15 shadow-sm text-left mb-6">
            <p className="text-xs font-semibold text-brown-light uppercase tracking-widest mb-3">
              Your Order
            </p>
            {cartItems.map(ci => (
              <div key={ci.key} className="flex justify-between py-1.5 border-b border-rose/8 last:border-0">
                <span className="text-sm text-brown-dark">{ci.name} <span className="text-brown-light">×{ci.q}</span></span>
                <span className="text-sm font-medium text-brown-dark">₹{ci.price * ci.q}</span>
              </div>
            ))}
            {details.gift_wrap && (
              <div className="flex justify-between py-1.5 border-b border-rose/8">
                <span className="text-sm text-brown-dark">Gift Wrapping 🎀</span>
                <span className="text-sm font-medium text-brown-dark">₹{GIFT_WRAP_PRICE}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 mt-1">
              <span className="font-semibold text-brown-dark">Total Paid</span>
              <span className="font-bold text-brown-dark">₹{success.total}</span>
            </div>
          </div>

          <a
            href="https://instagram.com/batterandbliss.bakery"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       bg-brown-dark text-cream-light text-sm font-medium
                       hover:bg-brown-mid transition-colors duration-250"
          >
            📸 Follow @batterandbliss.bakery
          </a>
        </div>
      </section>
    )
  }

  /* ── Main checkout ──────────────────────────────────────────────── */
  return (
    <section id="order" className="py-24 bg-gradient-to-b from-cream-light to-cream">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10" data-anim="fade-up">
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-rose mb-2">
            Checkout
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-brown-dark leading-[1.2] mb-3">
            The <span className="script text-rose text-[1.15em]">sweetest</span> moments<br />
            begin here. ♡
          </h2>
        </div>

        {/* Step indicator */}
        <div className="flex items-start justify-center mb-12 max-w-xs mx-auto">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                 text-sm font-bold transition-all duration-400 ${i < step ? 'bg-rose text-white shadow-[0_4px_12px_rgba(196,132,106,0.4)]' :
                    i === step ? 'bg-brown-dark text-cream-light ring-4 ring-brown-dark/20' :
                      'bg-cream-mid text-brown-light'
                  }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[0.62rem] mt-1.5 font-medium tracking-wide text-center
                                  leading-tight w-16 ${i === step ? 'text-brown-dark' : 'text-brown-light'
                  }`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mb-6 mx-0.5 transition-all duration-400 ${i < step ? 'bg-rose' : 'bg-cream-mid'
                  }`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 0: Select Items ─────────────────────────────────── */}
        {step === 0 && (
          <div data-anim="fade-up">

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-250 cursor-pointer
                    ${activeTab === cat
                      ? 'bg-brown-dark text-cream-light shadow-md'
                      : 'bg-white border border-rose/20 text-brown-mid hover:border-rose/50 hover:bg-rose/5'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Items for active tab */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATALOG.filter(p => p.category === activeTab).map(product => {
                const chosenSize  = getSize(product.id) || product.sizes[0].label
                const cartKey     = `${product.id}_${chosenSize}`
                const sizeObj     = product.sizes.find(s => s.label === chosenSize)
                const q           = cartQty(cartKey)
                const anySelected = product.sizes.some(s => cartQty(`${product.id}_${s.label}`) > 0)

                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-2xl overflow-hidden border flex flex-col
                               transition-all duration-250 ${
                      anySelected
                        ? 'border-rose/50 shadow-[0_4px_20px_rgba(196,132,106,0.22)] -translate-y-0.5'
                        : 'border-rose/12 shadow-[0_2px_10px_rgba(44,26,14,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(44,26,14,0.1)]'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={product.img} alt={product.name}
                        className={`w-full h-28 object-cover transition-transform duration-400 ${anySelected ? 'scale-105' : ''}`}
                        loading="lazy"
                      />
                      {anySelected && (
                        <div className="absolute inset-0 bg-rose/10 flex items-center justify-center">
                          <span className="bg-rose text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            In cart ✓
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3.5 flex flex-col flex-1 gap-2">
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-brown-dark leading-tight">{product.name}</h4>
                        <p className="text-brown-light text-[0.72rem] leading-snug mt-0.5">{product.desc}</p>
                      </div>

                      {/* Size selector */}
                      {product.sizes.length > 1 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {product.sizes.map(s => (
                            <button
                              key={s.label}
                              onClick={() => pickSize(product.id, s.label)}
                              className={`flex-1 py-1 rounded-lg text-[0.7rem] font-semibold border transition-all duration-150 cursor-pointer
                                ${ chosenSize === s.label
                                  ? 'bg-brown-dark text-cream-light border-brown-dark'
                                  : 'bg-white text-brown-mid border-rose/25 hover:border-brown-dark/40'
                                }`}
                            >
                              {s.label} · ₹{s.price}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Price (single-size items) */}
                      {product.sizes.length === 1 && (
                        <p className="text-brown-dark font-bold text-sm">
                          ₹{product.sizes[0].price}
                          <span className="text-brown-light font-normal text-[0.7rem] ml-1">{product.sizes[0].label}</span>
                        </p>
                      )}

                      {/* Qty control for chosen size */}
                      <div className="mt-auto">
                        {q === 0 ? (
                          <button
                            onClick={() => setCartQty(cartKey, 1)}
                            className="w-full py-1.5 rounded-lg text-xs font-semibold
                                       bg-rose/8 text-brown-mid border border-rose/20
                                       hover:bg-rose hover:text-white hover:border-rose
                                       transition-all duration-200 cursor-pointer"
                          >
                            + Add to Order
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCartQty(cartKey, q - 1)}
                              className="w-8 h-8 rounded-lg bg-cream text-brown-dark font-bold text-base
                                         hover:bg-rose/15 transition-colors duration-150 cursor-pointer
                                         flex items-center justify-center shrink-0"
                            >−</button>
                            <span className="flex-1 text-center font-bold text-brown-dark text-sm">{q}</span>
                            <button
                              onClick={() => setCartQty(cartKey, q + 1)}
                              className="w-8 h-8 rounded-lg bg-brown-dark text-cream-light font-bold text-base
                                         hover:bg-brown-mid transition-colors duration-150 cursor-pointer
                                         flex items-center justify-center shrink-0"
                            >+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Error */}
            {error && <p className="text-center text-red-500 text-sm mt-6 mb-2">{error}</p>}

            {/* Sticky cart bar */}
            <div className={`sticky bottom-4 mt-6 transition-all duration-400 ${
              cartItems.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}>
              <div className="bg-white border border-rose/25 rounded-2xl px-5 py-4
                              shadow-[0_12px_40px_rgba(44,26,14,0.18)]
                              flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] text-brown-light font-medium">
                    {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-2xl font-bold text-brown-dark">₹{subtotal}</span>
                    <span className="text-xs text-brown-light">subtotal</span>
                  </div>
                </div>
                <div className="hidden md:flex gap-2 flex-1 justify-center flex-wrap max-w-xs">
                  {cartItems.slice(0, 3).map(ci => (
                    <span key={ci.key} className="text-xs bg-rose/8 text-brown-mid border border-rose/20 px-2.5 py-1 rounded-full">
                      {ci.name.split(' ')[0]} ×{ci.q}
                    </span>
                  ))}
                  {cartItems.length > 3 && <span className="text-xs text-brown-light">+{cartItems.length - 3} more</span>}
                </div>
                <button
                  onClick={goNext}
                  className="px-6 py-2.5 rounded-full bg-brown-dark text-cream-light
                             text-sm font-medium shadow-md hover:bg-brown-mid
                             hover:-translate-y-0.5 transition-all duration-250 cursor-pointer shrink-0"
                >
                  Continue →
                </button>
              </div>
            </div>

            {cartItems.length === 0 && (
              <div className="text-center pt-4">
                <p className="text-brown-light text-sm">Select your favourites above to continue ♡</p>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1: Details ──────────────────────────────────────── */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto step-in">

            {/* Mini order recap */}
            <div className="bg-white/70 border border-rose/15 rounded-2xl px-5 py-4 mb-6
                            flex flex-wrap gap-x-4 gap-y-1.5 items-center">
              <p className="text-xs text-brown-light font-medium uppercase tracking-wide w-full mb-0.5">
                Your order so far
              </p>
              {cartItems.map(ci => (
                <span key={ci.key} className="text-xs bg-rose/10 text-brown-mid
                                             border border-rose/20 px-2.5 py-1 rounded-full">
                  {ci.name} ×{ci.q} — ₹{ci.price * ci.q}
                </span>
              ))}
              <span className="ml-auto text-sm font-bold text-brown-dark">
                Subtotal: ₹{subtotal}
              </span>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(44,26,14,0.1)]
                            border border-rose/12 p-8">
              <h3 className="font-serif text-xl font-semibold text-brown-dark mb-6">
                Delivery Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className={labelCls}>Your Name *</label>
                  <input id="name" name="name" type="text" required
                    value={details.name} onChange={handleDetail}
                    placeholder="e.g. Priya Sharma" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelCls}>WhatsApp Number *</label>
                  <input id="phone" name="phone" type="tel" required
                    value={details.phone} onChange={handleDetail}
                    placeholder="+91 98765 43210" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="delivery_date" className={labelCls}>Delivery Date *</label>
                  <input id="delivery_date" name="delivery_date" type="date" required
                    value={details.delivery_date} onChange={handleDetail}
                    min={new Date().toISOString().split('T')[0]}
                    className={inputCls} />
                </div>
                <div>
                  <label htmlFor="area" className={labelCls}>Delivery Area *</label>
                  <input id="area" name="area" type="text" required
                    value={details.area} onChange={handleDetail}
                    placeholder="e.g. Dwarka, Noida, Gurgaon" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="occasion" className={labelCls}>
                    Occasion / Special Notes
                  </label>
                  <textarea id="occasion" name="occasion" rows={3}
                    value={details.occasion} onChange={handleDetail}
                    placeholder="e.g. Birthday — please add a heartfelt message card!"
                    className={`${inputCls} resize-none`} />
                </div>

                {/* Gift wrap toggle */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer group/gw
                                    bg-rose/5 border border-rose/15 rounded-xl px-4 py-3
                                    hover:bg-rose/10 transition-colors duration-200">
                    <input
                      type="checkbox" name="gift_wrap"
                      checked={details.gift_wrap} onChange={handleDetail}
                      className="w-4 h-4 accent-rose rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-brown-dark">
                        Add gift wrapping &amp; personalised message card 🎀
                      </span>
                      <span className="block text-xs text-brown-light mt-0.5">
                        Premium kraft box with ribbon &amp; handwritten note
                      </span>
                    </div>
                    <span className="text-sm font-bold text-rose shrink-0">+₹{GIFT_WRAP_PRICE}</span>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl
                            border border-red-200 mt-4">
                {error}
              </p>
            )}

            <div className="flex justify-between mt-5">
              <button onClick={goBack}
                className="px-5 py-2.5 rounded-full border border-rose/30 text-brown-mid
                           text-sm hover:bg-rose/8 transition-all duration-200 cursor-pointer">
                ← Back
              </button>
              <button onClick={goNext}
                className="px-8 py-2.5 rounded-full bg-brown-dark text-cream-light
                           text-sm font-medium hover:bg-brown-mid hover:-translate-y-0.5
                           transition-all duration-250 cursor-pointer shadow-md">
                Review Order →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Review & Pay ─────────────────────────────────── */}
        {step === 2 && (
          <div className="max-w-md mx-auto step-in">
            <div className="bg-white rounded-3xl shadow-[0_12px_48px_rgba(44,26,14,0.13)]
                            border border-rose/12 overflow-hidden">

              {/* Delivery details recap */}
              <div className="px-7 pt-7 pb-5 border-b border-rose/12">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[0.68rem] font-semibold text-brown-light uppercase tracking-widest">
                    Delivery Details
                  </p>
                  <button onClick={() => setStep(1)}
                    className="text-[0.72rem] text-rose hover:underline cursor-pointer">
                    Edit
                  </button>
                </div>
                <p className="text-sm font-semibold text-brown-dark">
                  {details.name}
                  <span className="font-normal text-brown-light mx-1">·</span>
                  {details.phone}
                </p>
                <p className="text-sm text-brown-light">
                  {details.area}
                  <span className="mx-1">·</span>
                  {details.delivery_date}
                </p>
                {details.occasion && (
                  <p className="text-xs text-brown-light/70 mt-1 italic">"{details.occasion}"</p>
                )}
              </div>

              {/* Items */}
              <div className="px-7 py-5 border-b border-rose/12">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[0.68rem] font-semibold text-brown-light uppercase tracking-widest">
                    Your Order
                  </p>
                  <button onClick={() => setStep(0)}
                    className="text-[0.72rem] text-rose hover:underline cursor-pointer">
                    Edit
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {cartItems.map(p => (
                    <div key={p.id} className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brown-dark truncate">{p.name}</p>
                        <p className="text-xs text-brown-light">
                          {qty(p.id)} × ₹{p.price} per {p.unit}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-brown-dark shrink-0">
                        ₹{p.price * qty(p.id)}
                      </span>
                    </div>
                  ))}
                  {details.gift_wrap && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-brown-dark">Gift Wrapping 🎀</p>
                        <p className="text-xs text-brown-light">Kraft box with ribbon & message card</p>
                      </div>
                      <span className="text-sm font-semibold text-brown-dark">₹{GIFT_WRAP_PRICE}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subtotal / Total */}
              <div className="px-7 py-5 border-b border-rose/12 space-y-2">
                <div className="flex justify-between text-sm text-brown-light">
                  <span>Subtotal</span><span>₹{subtotal}</span>
                </div>
                {details.gift_wrap && (
                  <div className="flex justify-between text-sm text-brown-light">
                    <span>Gift Wrapping</span><span>₹{GIFT_WRAP_PRICE}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-rose/12">
                  <span className="font-serif text-lg font-bold text-brown-dark">Total</span>
                  <span className="font-serif text-2xl font-bold text-brown-dark">₹{total}</span>
                </div>
              </div>

              {/* Payment section */}
              <div className="px-7 py-6">
                {error && (
                  <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl
                                border border-red-200 mb-4">
                    {error}
                  </p>
                )}

                {/* Razorpay pay button */}
                <button
                  id="razorpay-pay-btn"
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-semibold text-base
                             bg-gradient-to-r from-rose to-[#d4956e]
                             text-white shadow-[0_8px_28px_rgba(196,132,106,0.45)]
                             hover:shadow-[0_12px_36px_rgba(196,132,106,0.55)]
                             hover:-translate-y-0.5 active:translate-y-0
                             disabled:opacity-60 disabled:cursor-not-allowed
                             disabled:hover:translate-y-0
                             transition-all duration-300 cursor-pointer
                             flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <span className="flex items-center gap-2.5">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Opening Payment...
                    </span>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                      </svg>
                      Pay ₹{total} · Secured by Razorpay
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
                  {['🔒 SSL Secure', '💳 Cards', '📱 UPI', '🏦 Net Banking'].map(b => (
                    <span key={b} className="text-[0.65rem] text-brown-light/60 font-medium">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex mt-5">
              <button onClick={goBack}
                className="px-5 py-2.5 rounded-full border border-rose/30 text-brown-mid
                           text-sm hover:bg-rose/8 transition-all duration-200 cursor-pointer">
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
