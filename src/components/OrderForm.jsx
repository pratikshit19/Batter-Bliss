import { useState } from 'react'
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll'
import { supabase } from '../lib/supabase'

const INITIAL = {
  name: '', phone: '', product: '', quantity: '',
  delivery_date: '', area: '', occasion: '', gift_wrap: false,
}

export default function OrderForm() {
  useAnimateOnScroll()
  const [form,    setForm]    = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: sbErr } = await supabase.from('orders').insert([{
        name:          form.name,
        phone:         form.phone,
        product:       form.product,
        quantity:      form.quantity,
        delivery_date: form.delivery_date,
        area:          form.area,
        occasion:      form.occasion,
        gift_wrap:     form.gift_wrap,
      }])
      if (sbErr) throw sbErr
      setSuccess(true)
      setForm(INITIAL)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please DM us on Instagram or WhatsApp directly!')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = `w-full px-4 py-3 rounded-xl border border-rose/25 bg-white text-brown-dark
                   text-sm placeholder-brown-light/60 font-sans
                   focus:outline-none focus:border-rose/60 focus:ring-2 focus:ring-rose/15
                   transition-all duration-200`

  const labelCls = `block text-xs font-medium text-brown-mid tracking-wide uppercase mb-1.5`

  return (
    <section id="order" className="py-24 bg-gradient-to-b from-cream-light to-cream">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12" data-anim="fade-up">
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-rose mb-2">
            Place Your Order
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-brown-dark leading-[1.2] mb-3">
            The <span className="script text-rose text-[1.15em]">sweetest</span> moments<br />
            begin here. ♡
          </h2>
          <p className="text-brown-light text-base max-w-md mx-auto leading-relaxed">
            Fill in your details and we'll reach out on WhatsApp within 2 hours to confirm
            your order and delivery slot.
          </p>
        </div>

        {/* Form card */}
        <div
          data-anim="fade-up"
          className="max-w-2xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(44,26,14,0.12)]
                     border border-rose/12 overflow-hidden"
        >
          {success ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center text-center px-10 py-16 gap-4">
              <div className="text-6xl mb-2 animate-bounce">🎉</div>
              <h3 className="font-serif text-2xl font-semibold text-brown-dark">Order Received!</h3>
              <p className="text-brown-light text-base leading-relaxed max-w-sm">
                Thank you so much! We'll reach out on your WhatsApp within{' '}
                <strong className="text-brown-dark">2 hours</strong> to confirm your order,
                pricing, and delivery slot.
              </p>
              <p className="text-sm text-brown-light/80 bg-rose/8 px-5 py-3 rounded-xl">
                Follow us on Instagram for menu drops &amp; sweet surprises! 🍫
              </p>
              <a
                href="https://instagram.com/batterandbliss.bakery"
                target="_blank" rel="noopener noreferrer"
                className="mt-2 px-6 py-3 rounded-full bg-brown-dark text-cream-light text-sm font-medium
                           hover:bg-brown-mid transition-colors duration-250"
              >
                @batterandbliss.bakery
              </a>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={submit} noValidate className="p-8 flex flex-col gap-5">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className={labelCls}>Your Name *</label>
                  <input id="name" name="name" type="text" required
                    value={form.name} onChange={handle}
                    placeholder="e.g. Priya Sharma" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelCls}>WhatsApp Number *</label>
                  <input id="phone" name="phone" type="tel" required
                    value={form.phone} onChange={handle}
                    placeholder="+91 98765 43210" className={inputCls} />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="product" className={labelCls}>What would you like? *</label>
                  <select id="product" name="product" required
                    value={form.product} onChange={handle} className={inputCls}>
                    <option value="" disabled>Select a product</option>
                    <optgroup label="🍫 Brownies">
                      <option value="Classic Fudgy Brownies">Classic Fudgy Brownies</option>
                      <option value="Choco Chip Loaded Brownies">Choco Chip Loaded Brownies</option>
                      <option value="Walnut Crunch Brownies">Walnut Crunch Brownies</option>
                      <option value="Brownie Bites Jar">Brownie Bites (Jar)</option>
                    </optgroup>
                    <optgroup label="🎂 Dry Cakes">
                      <option value="Marble Tea Cake">Marble Tea Cake</option>
                      <option value="Chocolate Loaf">Chocolate Loaf</option>
                      <option value="Banana Walnut Cake">Banana Walnut Cake</option>
                      <option value="Dates & Nut Cake">Dates &amp; Nut Cake</option>
                    </optgroup>
                    <optgroup label="🎁 Hampers">
                      <option value="Brownie Box 6 pcs">Brownie Box (6 pcs)</option>
                      <option value="Brownie + Bites Combo">Brownie + Bites Combo</option>
                      <option value="Bakes & Treats Hamper">Bakes &amp; Treats Hamper</option>
                      <option value="Custom Hamper">Custom Hamper</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label htmlFor="quantity" className={labelCls}>Quantity / Box Size</label>
                  <input id="quantity" name="quantity" type="text"
                    value={form.quantity} onChange={handle}
                    placeholder="e.g. 1 box of 6 pieces" className={inputCls} />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="delivery_date" className={labelCls}>Delivery Date *</label>
                  <input id="delivery_date" name="delivery_date" type="date" required
                    value={form.delivery_date} onChange={handle} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="area" className={labelCls}>Delivery Area *</label>
                  <input id="area" name="area" type="text" required
                    value={form.area} onChange={handle}
                    placeholder="e.g. Dwarka, Noida, Gurgaon" className={inputCls} />
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label htmlFor="occasion" className={labelCls}>Occasion / Special Notes</label>
                <textarea id="occasion" name="occasion" rows={3}
                  value={form.occasion} onChange={handle}
                  placeholder="e.g. Birthday gift – please add a heartfelt message card!"
                  className={`${inputCls} resize-none`} />
              </div>

              {/* Gift wrap checkbox */}
              <label className="flex items-center gap-3 cursor-pointer group/cb">
                <input type="checkbox" name="gift_wrap"
                  checked={form.gift_wrap} onChange={handle}
                  className="w-4 h-4 accent-rose rounded" />
                <span className="text-sm text-brown-mid group-hover/cb:text-brown-dark transition-colors">
                  Add gift wrapping &amp; personalized message card 🎀
                </span>
              </label>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                id="submit-order-btn"
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-brown-dark text-cream-light font-medium text-base
                           shadow-[0_6px_24px_rgba(44,26,14,0.28)]
                           hover:bg-brown-mid hover:-translate-y-0.5 active:translate-y-0
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                           transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Sending your order…
                  </span>
                ) : (
                  <span>Send My Order ♡ 🍫</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Direct contact */}
        <div className="text-center mt-10" data-anim="fade-up">
          <p className="text-brown-light text-sm mb-4">Prefer to order directly?</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              id="instagram-link"
              href="https://instagram.com/batterandbliss.bakery"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-rose/30
                         text-brown-mid text-sm font-medium hover:bg-rose/10 hover:border-rose/50
                         transition-all duration-250"
            >
              📸 DM on Instagram
            </a>
            <a
              id="whatsapp-link"
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-rose/30
                         text-brown-mid text-sm font-medium hover:bg-rose/10 hover:border-rose/50
                         transition-all duration-250"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
