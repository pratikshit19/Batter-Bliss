import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'

const GIFT_WRAP_PRICE = 50

const loadRazorpay = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })

export default function CartDrawer() {
  const {
    cartItems,
    subtotal,
    totalItems,
    isCartOpen,
    setIsCartOpen,
    updateQty,
    removeFromCart,
    clearCart
  } = useCart()

  const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart' | 'details' | 'success'
  const [details, setDetails] = useState({
    name: '',
    phone: '',
    delivery_date: '',
    area: '',
    occasion: '',
    gift_wrap: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successData, setSuccessData] = useState(null)

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target
    setDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const giftWrapFee = details.gift_wrap ? GIFT_WRAP_PRICE : 0
  const grandTotal = subtotal + giftWrapFee

  const handleProceedToDetails = () => {
    if (cartItems.length === 0) return
    setError('')
    setCheckoutStep('details')
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    if (!details.name.trim() || !details.phone.trim() || !details.delivery_date || !details.area.trim()) {
      setError('Please fill in all required fields marked with *')
      return
    }

    setLoading(true)
    setError('')

    const loaded = await loadRazorpay()
    if (!loaded) {
      setError('Could not load payment gateway. Please check your connection.')
      setLoading(false)
      return
    }

    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!rzpKey || rzpKey.startsWith('rzp_test_XXXX')) {
      setError('Razorpay Key ID is not configured. Add VITE_RAZORPAY_KEY_ID to your .env file.')
      setLoading(false)
      return
    }

    const description = cartItems.map(item => `${item.name} (${item.size || ''}) ×${item.qty}`).join(', ')

    const options = {
      key: rzpKey,
      amount: grandTotal * 100, // paise
      currency: 'INR',
      name: 'Batter & Bliss',
      description,
      prefill: {
        name: details.name,
        contact: details.phone
      },
      notes: {
        area: details.area,
        delivery_date: details.delivery_date,
        occasion: details.occasion || ''
      },
      theme: { color: '#C4846A' },

      handler: async response => {
        try {
          await supabase.from('orders').insert([{
            name: details.name,
            phone: details.phone,
            product: description,
            quantity: cartItems.map(item => `${item.name} (${item.size || ''}): ${item.qty}`).join(' | '),
            delivery_date: details.delivery_date,
            area: details.area,
            occasion: details.occasion,
            gift_wrap: details.gift_wrap,
            payment_id: response.razorpay_payment_id,
            payment_status: 'paid',
            amount_total: grandTotal,
            status: 'confirmed'
          }])
        } catch (dbErr) {
          console.error('Supabase order insert error:', dbErr)
        }

        setSuccessData({
          paymentId: response.razorpay_payment_id,
          total: grandTotal,
          items: [...cartItems]
        })
        clearCart()
        setCheckoutStep('success')
        setLoading(false)
      },

      modal: {
        ondismiss: () => setLoading(false)
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', resp => {
      setError(`Payment failed: ${resp.error.description}`)
      setLoading(false)
    })
    rzp.open()
  }

  const closeDrawer = () => {
    setIsCartOpen(false)
    if (checkoutStep === 'success') {
      setTimeout(() => {
        setCheckoutStep('cart')
        setSuccessData(null)
      }, 300)
    }
  }

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brown-dark/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-light shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-rose/15 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-bold text-brown-dark">Your Basket</h3>
              {totalItems > 0 && (
                <span className="bg-rose text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <button
              onClick={closeDrawer}
              className="w-8 h-8 rounded-full bg-cream hover:bg-rose/15 text-brown-dark flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {checkoutStep === 'success' && successData ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h4 className="font-serif text-2xl font-bold text-brown-dark mb-2">Order Confirmed!</h4>
                <p className="text-sm text-brown-light leading-relaxed mb-4">
                  Thank you, <strong className="text-brown-dark">{details.name}</strong>! Payment of <strong className="text-brown-dark">₹{successData.total}</strong> was successful. We'll WhatsApp you shortly to confirm your delivery slot.
                </p>
                <p className="text-xs text-brown-light/60 mb-6">Payment ID: {successData.paymentId}</p>

                <div className="bg-white rounded-2xl p-4 border border-rose/15 text-left mb-6">
                  <p className="text-xs font-semibold text-brown-light uppercase tracking-widest mb-2">Order Summary</p>
                  {successData.items.map(item => (
                    <div key={item.key} className="flex justify-between py-1.5 border-b border-rose/8 text-sm">
                      <span className="text-brown-dark">{item.name} ×{item.qty}</span>
                      <span className="font-medium text-brown-dark">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 mt-1 font-bold text-brown-dark text-base">
                    <span>Total Paid</span>
                    <span>₹{successData.total}</span>
                  </div>
                </div>

                <button
                  onClick={closeDrawer}
                  className="w-full py-3 rounded-full bg-brown-dark text-cream-light font-medium text-sm hover:bg-brown-mid transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : checkoutStep === 'details' ? (
              /* Step 2: Delivery Details Form */
              <div>
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="text-xs text-rose font-medium hover:underline mb-4 inline-flex items-center gap-1 cursor-pointer"
                >
                  ← Back to cart items
                </button>

                <h4 className="font-serif text-lg font-semibold text-brown-dark mb-4">Delivery & Contact Details</h4>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-[0.7rem] font-semibold text-brown-mid tracking-widest uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={details.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm placeholder-brown-light/50 focus:outline-none focus:border-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-semibold text-brown-mid tracking-widest uppercase mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={details.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm placeholder-brown-light/50 focus:outline-none focus:border-rose"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[0.7rem] font-semibold text-brown-mid tracking-widest uppercase mb-1">
                        Delivery Date *
                      </label>
                      <input
                        type="date"
                        name="delivery_date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={details.delivery_date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-xs focus:outline-none focus:border-rose"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.7rem] font-semibold text-brown-mid tracking-widest uppercase mb-1">
                        Area / Pincode *
                      </label>
                      <input
                        type="text"
                        name="area"
                        required
                        value={details.area}
                        onChange={handleInputChange}
                        placeholder="e.g. Vasant Kunj"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm focus:outline-none focus:border-rose"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-semibold text-brown-mid tracking-widest uppercase mb-1">
                      Occasion / Note (Optional)
                    </label>
                    <input
                      type="text"
                      name="occasion"
                      value={details.occasion}
                      onChange={handleInputChange}
                      placeholder="Birthday, Anniversary, Gift note..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm focus:outline-none focus:border-rose"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-rose/20 bg-white cursor-pointer hover:bg-rose/5 transition-colors">
                    <input
                      type="checkbox"
                      name="gift_wrap"
                      checked={details.gift_wrap}
                      onChange={handleInputChange}
                      className="rounded accent-rose w-4 h-4"
                    />
                    <span className="text-xs font-medium text-brown-dark">
                      Add Festive Gift Wrapping & Card (+₹{GIFT_WRAP_PRICE}) 🎁
                    </span>
                  </label>

                  {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-full bg-brown-dark text-cream-light font-medium text-sm shadow-md hover:bg-brown-mid transition-all duration-200 cursor-pointer disabled:opacity-50 mt-4"
                  >
                    {loading ? 'Opening Payment Gateway...' : `Pay ₹${grandTotal} Now 💳`}
                  </button>
                </form>
              </div>
            ) : (
              /* Step 1: Cart Items List */
              <div>
                {cartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-3 opacity-60">🛍️</div>
                    <h4 className="font-serif text-lg font-semibold text-brown-dark mb-1">Your Basket is empty</h4>
                    <p className="text-xs text-brown-light mb-6">Explore our menu and add your favourite freshly baked treats!</p>
                    <button
                      onClick={closeDrawer}
                      className="px-6 py-2.5 rounded-full bg-brown-dark text-cream-light text-xs font-medium hover:bg-brown-mid transition-colors cursor-pointer"
                    >
                      Browse Bakes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div
                        key={item.key}
                        className="bg-white rounded-2xl p-3 border border-rose/15 shadow-sm flex items-center gap-3"
                      >
                        {item.img && (
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-sm font-semibold text-brown-dark truncate">{item.name}</h5>
                          {item.size && (
                            <span className="text-[0.7rem] text-rose font-medium bg-rose/10 px-2 py-0.5 rounded-full inline-block mb-1">
                              {item.size}
                            </span>
                          )}
                          <div className="text-xs font-bold text-brown-dark">
                            ₹{item.price} <span className="text-[0.7rem] font-normal text-brown-light">each</span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 shrink-0 bg-cream rounded-xl p-1 border border-rose/10">
                          <button
                            onClick={() => updateQty(item.key, item.qty - 1)}
                            className="w-6 h-6 rounded-lg bg-white text-brown-dark font-bold text-xs hover:bg-rose/10 flex items-center justify-center cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-5 text-center font-bold text-xs text-brown-dark">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.key, item.qty + 1)}
                            className="w-6 h-6 rounded-lg bg-brown-dark text-white font-bold text-xs hover:bg-brown-mid flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {checkoutStep === 'cart' && cartItems.length > 0 && (
            <div className="p-5 border-t border-rose/15 bg-white space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold uppercase text-brown-light tracking-wider">Subtotal</span>
                <span className="font-serif text-2xl font-bold text-brown-dark">₹{subtotal}</span>
              </div>
              <p className="text-[0.7rem] text-brown-light/70 text-center">Taxes included. Delivery calculated at checkout.</p>
              <button
                onClick={handleProceedToDetails}
                className="w-full py-3.5 rounded-full bg-brown-dark text-cream-light font-medium text-sm shadow-md hover:bg-brown-mid transition-all duration-250 cursor-pointer flex items-center justify-center gap-2"
              >
                Proceed to Checkout →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
