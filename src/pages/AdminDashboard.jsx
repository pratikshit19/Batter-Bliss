import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/* ── Status config ──────────────────────────────────────────────── */
const STATUSES = [
  { value: 'pending',          label: 'Pending',          color: 'bg-yellow-100 text-yellow-800  border-yellow-200' },
  { value: 'confirmed',        label: 'Confirmed',        color: 'bg-blue-100   text-blue-800    border-blue-200'   },
  { value: 'baking',           label: 'Baking 🔥',        color: 'bg-orange-100 text-orange-800  border-orange-200' },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800  border-purple-200' },
  { value: 'delivered',        label: 'Delivered ✓',      color: 'bg-green-100  text-green-800   border-green-200'  },
  { value: 'cancelled',        label: 'Cancelled',        color: 'bg-red-100    text-red-800     border-red-200'    },
]
const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.value, s]))
const FILTER_TABS = [{ value: 'all', label: 'All Orders' }, ...STATUSES]

/* ── Helpers ────────────────────────────────────────────────────── */
const fmt = d => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}
const fmtTime = d => {
  if (!d) return ''
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}
const fmtCurrency = n => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—'

/* ═══════════════════════════════════════════════════════════════════
   MENU TAB
═══════════════════════════════════════════════════════════════════ */
function MenuTab() {
  const [currentMenu, setCurrentMenu] = useState(null)
  const [uploading,   setUploading]   = useState(false)
  const [deleting,    setDeleting]    = useState(false)
  const [dragOver,    setDragOver]    = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState('')
  const fileRef = useRef(null)

  const fetchMenu = useCallback(async () => {
    const { data } = await supabase
      .from('settings')
      .select('value, updated_at')
      .eq('key', 'menu_url')
      .single()
    if (data?.value) {
      setCurrentMenu({
        url: data.value,
        updated_at: data.updated_at,
        isPdf: data.value.toLowerCase().includes('.pdf'),
      })
    } else {
      setCurrentMenu(null)
    }
  }, [])

  useEffect(() => { fetchMenu() }, [fetchMenu])

  const uploadFile = async file => {
    if (!file) return
    setError(''); setSuccess('')

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10 MB.'); return
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, WebP, and PDF files are allowed.'); return
    }

    setUploading(true)
    try {
      const ext      = file.name.split('.').pop()
      const filename = `menu-${Date.now()}.${ext}`

      /* Upload to Storage */
      const { data: up, error: upErr } = await supabase.storage
        .from('menu')
        .upload(filename, file, { cacheControl: '3600', upsert: false })
      if (upErr) throw upErr

      /* Get public URL */
      const { data: { publicUrl } } = supabase.storage.from('menu').getPublicUrl(up.path)

      /* Remove old file from Storage */
      if (currentMenu?.url) {
        const oldPath = currentMenu.url.split('/object/public/menu/')[1]
        if (oldPath) await supabase.storage.from('menu').remove([decodeURIComponent(oldPath)])
      }

      /* Persist URL in settings via UPDATE (row is pre-seeded, never INSERT) */
      const { error: dbErr } = await supabase.from('settings')
        .update({ value: publicUrl, updated_at: new Date().toISOString() })
        .eq('key', 'menu_url')
      if (dbErr) throw dbErr

      setSuccess('✓ Menu uploaded! The "View Menu" button is now live on the website.')
      fetchMenu()
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const deleteMenu = async () => {
    if (!window.confirm('Remove the current menu? Customers won\'t see a menu button until you upload a new one.')) return
    setDeleting(true); setError(''); setSuccess('')
    try {
      if (currentMenu?.url) {
        const path = currentMenu.url.split('/object/public/menu/')[1]
        if (path) await supabase.storage.from('menu').remove([decodeURIComponent(path)])
      }
      await supabase.from('settings')
        .update({ value: null, updated_at: new Date().toISOString() })
        .eq('key', 'menu_url')
      setCurrentMenu(null)
      setSuccess('Menu removed from the website.')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-serif text-xl font-semibold text-brown-dark mb-1">
        Menu Management
      </h2>
      <p className="text-sm text-brown-light mb-7">
        Upload your latest menu image or PDF. A <strong>"View Menu"</strong> button
        will appear automatically in the website navbar once uploaded.
      </p>

      {/* ── Current menu preview ─────────────────────────────────── */}
      {currentMenu && (
        <div className="bg-white rounded-2xl border border-rose/15 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-3.5 border-b border-rose/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brown-light uppercase tracking-widest">
                Current Menu
              </p>
              <p className="text-[0.68rem] text-brown-light/60 mt-0.5">
                Last updated: {fmt(currentMenu.updated_at)} at {fmtTime(currentMenu.updated_at)}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={currentMenu.url} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-rose/25
                           text-brown-mid hover:bg-rose/8 transition-all cursor-pointer"
              >
                View ↗
              </a>
              <button
                onClick={deleteMenu} disabled={deleting}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200
                           text-red-600 hover:bg-red-50 disabled:opacity-50
                           transition-all cursor-pointer"
              >
                {deleting ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>

          {currentMenu.isPdf ? (
            <div className="flex flex-col items-center justify-center py-10 text-brown-light gap-3">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <p className="text-sm font-medium text-brown-dark">PDF Menu uploaded</p>
              <a href={currentMenu.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-rose hover:underline">Open PDF →</a>
            </div>
          ) : (
            <img
              src={currentMenu.url}
              alt="Current menu"
              className="w-full max-h-[28rem] object-contain bg-cream-light/40 p-4"
            />
          )}
        </div>
      )}

      {/* ── Upload / drop zone ───────────────────────────────────── */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-14 text-center
                    transition-all duration-200 select-none ${
          uploading
            ? 'opacity-70 cursor-not-allowed border-rose/20'
            : dragOver
              ? 'border-rose bg-rose/6 scale-[1.01] cursor-copy'
              : 'border-rose/25 hover:border-rose/50 hover:bg-rose/3 cursor-pointer'
        }`}
      >
        <input
          ref={fileRef} type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={e => { if (e.target.files[0]) uploadFile(e.target.files[0]) }}
        />

        {uploading ? (
          <>
            <svg className="animate-spin w-11 h-11 text-rose mx-auto mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <p className="font-semibold text-brown-mid">Uploading…</p>
            <p className="text-xs text-brown-light mt-1">Please wait</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-rose/10 rounded-2xl flex items-center
                            justify-center mx-auto mb-4 transition-transform duration-200
                            group-hover:scale-110">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#C4846A" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="font-semibold text-brown-dark text-base mb-1">
              {currentMenu ? 'Replace Current Menu' : 'Upload Menu'}
            </p>
            <p className="text-sm text-brown-light mb-1">Drag &amp; drop here, or click to browse</p>
            <p className="text-xs text-brown-light/50">JPG · PNG · WebP · PDF · Max 10 MB</p>
          </>
        )}
      </div>

      {/* Status messages */}
      {success && (
        <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl step-in">
          <p className="text-sm text-green-700 font-medium">{success}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl step-in">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ORDERS TAB
═══════════════════════════════════════════════════════════════════ */
function OrdersTab({ orders, loading, fetchOrders }) {
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')
  const [updating, setUpdating] = useState(null)
  const [expanded, setExpanded] = useState(null)

  const updateStatus = async (id, status) => {
    setUpdating(id)
    await supabase.from('orders').update({ status }).eq('id', id)
    setUpdating(null)
    fetchOrders()
  }

  const today       = new Date().toDateString()
  const todayOrders  = orders.filter(o => new Date(o.created_at).toDateString() === today)
  const todayRev     = todayOrders.filter(o => o.payment_status === 'paid')
                         .reduce((s, o) => s + (o.amount_total || 0), 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const totalRev     = orders.filter(o => o.payment_status === 'paid')
                         .reduce((s, o) => s + (o.amount_total || 0), 0)

  const visible = orders.filter(o => {
    const ok = filter === 'all' || o.status === filter
    const q  = search.toLowerCase()
    return ok && (!q ||
      o.name?.toLowerCase().includes(q)    ||
      o.phone?.toLowerCase().includes(q)   ||
      o.area?.toLowerCase().includes(q)    ||
      o.product?.toLowerCase().includes(q)
    )
  })

  const StatCard = ({ icon, label, value, sub }) => (
    <div className="bg-white rounded-2xl p-5 border border-rose/10 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center text-xl mb-3">
        {icon}
      </div>
      <p className="font-serif text-2xl font-bold text-brown-dark">{value}</p>
      <p className="text-xs font-medium text-brown-light uppercase tracking-wide mt-0.5">{label}</p>
      {sub && <p className="text-[0.68rem] text-brown-light/60 mt-0.5">{sub}</p>}
    </div>
  )

  const StatusBadge = ({ status }) => {
    const cfg = STATUS_MAP[status] || { label: status || 'pending', color: 'bg-gray-100 text-gray-600 border-gray-200' }
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-[0.68rem]
                        font-semibold border ${cfg.color}`}>
        {cfg.label}
      </span>
    )
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="📦" label="Orders Today"   value={todayOrders.length}       sub={fmt(new Date())} />
        <StatCard icon="💰" label="Revenue Today"  value={fmtCurrency(todayRev)}    sub="Paid orders only" />
        <StatCard icon="⏳" label="Pending Action" value={pendingCount}              sub="Need confirmation" />
        <StatCard icon="🏆" label="Total Revenue"  value={fmtCurrency(totalRev)}    sub="All time" />
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-2xl border border-rose/12 shadow-sm mb-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-rose/10">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text" placeholder="Search by name, phone, area…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-cream-light/60 rounded-xl
                         border border-rose/20 text-brown-dark placeholder-brown-light/50
                         focus:outline-none focus:border-rose/50 focus:ring-1 focus:ring-rose/15"
            />
          </div>
        </div>
        <div className="px-4 flex gap-1 overflow-x-auto py-2">
          {FILTER_TABS.map(tab => {
            const count = tab.value === 'all'
              ? orders.length
              : orders.filter(o => o.status === tab.value).length
            return (
              <button key={tab.value} onClick={() => setFilter(tab.value)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium
                            transition-all duration-200 cursor-pointer ${
                  filter === tab.value
                    ? 'bg-brown-dark text-cream-light shadow-sm'
                    : 'text-brown-mid hover:bg-rose/8'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold ${
                    filter === tab.value ? 'bg-white/20' : 'bg-rose/12'
                  }`}>{count}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-rose/12 p-16 text-center">
          <svg className="animate-spin w-8 h-8 text-rose mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <p className="text-brown-light text-sm">Loading orders…</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-rose/12 p-16 text-center">
          <p className="text-4xl mb-3">🍫</p>
          <p className="text-brown-dark font-serif text-lg font-semibold mb-1">No orders yet</p>
          <p className="text-brown-light text-sm">
            {search || filter !== 'all'
              ? 'Try a different search or filter.'
              : 'Orders will appear here once customers start placing them.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map(order => {
            const isExpanded = expanded === order.id
            const st = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-600 border-gray-200' }
            return (
              <div key={order.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${
                  order.status === 'pending' ? 'border-yellow-200' : 'border-rose/10'
                }`}
              >
                {/* Row summary */}
                <div
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer
                              hover:bg-cream-light/40 transition-colors duration-150"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  <div className="shrink-0 hidden sm:block">
                    <p className="text-[0.62rem] text-brown-light font-mono">
                      {order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-[0.68rem] text-brown-light">{fmt(order.created_at)}</p>
                    <p className="text-[0.62rem] text-brown-light/60">{fmtTime(order.created_at)}</p>
                  </div>
                  <div className="hidden sm:block w-px h-10 bg-rose/10 shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-brown-dark text-sm">{order.name}</p>
                      <StatusBadge status={order.status} />
                      {order.payment_status === 'paid' && (
                        <span className="text-[0.62rem] bg-green-50 text-green-700 border
                                         border-green-200 px-2 py-0.5 rounded-full font-semibold">
                          ✓ Paid
                        </span>
                      )}
                      {order.gift_wrap && <span className="text-[0.62rem] text-rose">🎀</span>}
                    </div>
                    <p className="text-xs text-brown-light truncate max-w-xs mt-0.5">
                      {order.product?.split(' | ').slice(0, 2).join(' · ')}
                      {(order.product?.split(' | ').length || 0) > 2 ? ' …' : ''}
                    </p>
                  </div>

                  <div className="shrink-0 text-right hidden md:block">
                    <p className="font-serif font-bold text-brown-dark">{fmtCurrency(order.amount_total)}</p>
                    <p className="text-[0.68rem] text-brown-light">{fmt(order.delivery_date)}</p>
                    <p className="text-[0.62rem] text-brown-light/70">{order.area}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${order.phone?.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-green-50 border border-green-200 flex items-center
                                 justify-center text-green-600 hover:bg-green-100 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.852L0 24l6.344-1.512A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.487-5.193-1.343l-.372-.22-3.853.918.96-3.744-.243-.386A9.965 9.965 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                    </a>

                    {/* Status dropdown */}
                    <select
                      value={order.status || 'pending'}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className={`text-[0.68rem] font-medium rounded-lg border px-2.5 py-1.5
                                  cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose/30
                                  disabled:opacity-60 ${st.color}`}
                    >
                      {STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>

                    <svg
                      className={`w-4 h-4 text-brown-light transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-rose/10 px-4 py-4 bg-cream-light/30
                                  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 step-in">
                    <div>
                      <p className="text-[0.65rem] font-semibold text-brown-light uppercase tracking-widest mb-2">Customer</p>
                      <p className="text-sm font-semibold text-brown-dark">{order.name}</p>
                      <p className="text-sm text-brown-light">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-semibold text-brown-light uppercase tracking-widest mb-2">Delivery</p>
                      <p className="text-sm font-medium text-brown-dark">{fmt(order.delivery_date)}</p>
                      <p className="text-sm text-brown-light">{order.area}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-semibold text-brown-light uppercase tracking-widest mb-2">Payment</p>
                      <p className="text-sm font-bold text-brown-dark">{fmtCurrency(order.amount_total)}</p>
                      <p className={`text-xs font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.payment_status === 'paid' ? '✓ Paid via Razorpay' : '⏳ Payment pending'}
                      </p>
                      {order.payment_id && (
                        <p className="text-[0.62rem] text-brown-light/60 font-mono mt-0.5">{order.payment_id}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2 lg:col-span-2">
                      <p className="text-[0.65rem] font-semibold text-brown-light uppercase tracking-widest mb-2">Items</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(order.product || '').split(' | ').map((item, i) => (
                          <span key={i} className="text-xs bg-white border border-rose/20 text-brown-mid px-2.5 py-1 rounded-full">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    {order.occasion && (
                      <div>
                        <p className="text-[0.65rem] font-semibold text-brown-light uppercase tracking-widest mb-2">Notes</p>
                        <p className="text-sm text-brown-dark italic">"{order.occasion}"</p>
                      </div>
                    )}
                    <div className="sm:col-span-2 lg:col-span-3 pt-2 border-t border-rose/10 flex items-center justify-between">
                      <p className="text-[0.65rem] text-brown-light/60">
                        Placed: {fmt(order.created_at)} at {fmtTime(order.created_at)}
                      </p>
                      <p className="text-[0.65rem] font-mono text-brown-light/40">ID: {order.id}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {!loading && visible.length > 0 && (
        <p className="text-center text-xs text-brown-light/50 mt-4">
          Showing {visible.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
        </p>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD (main)
═══════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('orders')
  const [orders,    setOrders]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [user,      setUser]      = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setOrders(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  /* Real-time updates */
  useEffect(() => {
    const ch = supabase.channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [fetchOrders])

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length

  const TABS = [
    { id: 'orders', label: 'Orders', icon: '📦', badge: pendingCount || null },
    { id: 'menu',   label: 'Menu',   icon: '🍽️', badge: null },
  ]

  return (
    <div className="min-h-screen bg-[#F9F4EE]">

      {/* ── Top nav ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-rose/12 sticky top-0 z-40
                         shadow-[0_2px_12px_rgba(44,26,14,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 42 42" fill="none">
              <ellipse cx="21" cy="35.5" rx="15" ry="2.2" stroke="#5C3317" strokeWidth="1.4"/>
              <rect x="13" y="32.5" width="16" height="3" rx="1.5" stroke="#5C3317" strokeWidth="1.4"/>
              <path d="M21 7C21 7 10.5 13 10.5 22.5C10.5 28.8 15.2 32.5 21 32.5C26.8 32.5 31.5 28.8 31.5 22.5C31.5 13 21 7 21 7Z"
                stroke="#5C3317" strokeWidth="1.4" fill="none"/>
              <path d="M19 5Q21 3 23 5" stroke="#C4846A" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
              <circle cx="21" cy="4" r="1.6" fill="#C4846A"/>
            </svg>
            <div>
              <span className="font-serif font-bold text-brown-dark text-sm">Batter &amp; Bliss</span>
              <span className="ml-2 text-[0.65rem] bg-rose/10 text-rose border border-rose/20
                               px-2 py-0.5 rounded-full font-medium">Admin</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[0.68rem] text-green-600 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
              Live
            </div>
            <button onClick={fetchOrders}
              className="p-2 rounded-xl hover:bg-cream text-brown-light hover:text-brown-dark
                         transition-colors duration-200 cursor-pointer" title="Refresh">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-rose/15 flex items-center justify-center
                              font-bold text-rose text-sm">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
            <button onClick={signOut}
              className="px-3 py-1.5 rounded-lg text-[0.72rem] font-medium text-brown-mid
                         hover:bg-rose/8 border border-rose/20 hover:border-rose/40
                         transition-all duration-200 cursor-pointer">
              Sign out
            </button>
          </div>
        </div>

        {/* ── Tab bar ─────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-rose/8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                          border-b-2 transition-all duration-200 cursor-pointer relative ${
                activeTab === tab.id
                  ? 'border-brown-dark text-brown-dark'
                  : 'border-transparent text-brown-light hover:text-brown-mid hover:border-rose/30'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge ? (
                <span className="w-5 h-5 rounded-full bg-rose text-white text-[0.6rem]
                                 font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'orders' && (
          <OrdersTab orders={orders} loading={loading} fetchOrders={fetchOrders} />
        )}
        {activeTab === 'menu' && (
          <div className="step-in">
            <MenuTab />
          </div>
        )}
      </main>
    </div>
  )
}
