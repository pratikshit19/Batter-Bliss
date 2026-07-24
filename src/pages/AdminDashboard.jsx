import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getSavedThemeSetting, setTestFestivalTheme } from '../utils/festivalConfig'
import { getStoredMenuItems, saveMenuItems } from '../utils/menuManager'

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
   ORDERS TAB
═══════════════════════════════════════════════════════════════════ */
function OrdersTab({ orders, loading, fetchOrders }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    await fetchOrders()
    setUpdatingId(null)
  }

  const visible = activeFilter === 'all'
    ? orders
    : orders.filter(o => o.status === activeFilter)

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === tab.value
                ? 'bg-brown-dark text-cream-light shadow-md'
                : 'bg-white border border-rose/20 text-brown-mid hover:bg-rose/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-brown-light text-sm">Loading orders…</div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-rose/12 text-brown-light text-sm">
          No orders found for this status.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(order => {
            const st = STATUS_MAP[order.status] || STATUSES[0]
            const isExpanded = expandedId === order.id

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-rose/12 shadow-xs hover:shadow-sm transition-all overflow-hidden"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cream-light border border-rose/20 flex items-center justify-center font-bold text-brown-dark text-xs shrink-0">
                      #{order.id.slice(0, 4)}
                    </div>
                    <div>
                      <h4 className="font-bold text-brown-dark text-sm">{order.customer_name || 'Customer'}</h4>
                      <p className="text-xs text-brown-light">{order.phone} · {order.address || 'Delhi NCR'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <div className="text-right">
                      <p className="font-bold text-brown-dark text-sm">{fmtCurrency(order.total_amount)}</p>
                      <p className="text-[0.68rem] text-brown-light/60">{fmt(order.created_at)}</p>
                    </div>

                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onClick={e => e.stopPropagation()}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${st.color} cursor-pointer focus:outline-none`}
                    >
                      {STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-rose/10 bg-cream-light/30 text-xs space-y-3">
                    <div>
                      <p className="font-semibold text-brown-light uppercase tracking-widest text-[0.65rem] mb-1">Items Ordered</p>
                      <p className="text-brown-dark font-medium">{order.product}</p>
                    </div>
                    {order.notes && (
                      <div>
                        <p className="font-semibold text-brown-light uppercase tracking-widest text-[0.65rem] mb-1">Special Notes</p>
                        <p className="text-brown-dark italic">"{order.notes}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   INTERACTIVE MENU MANAGEMENT TAB
═══════════════════════════════════════════════════════════════════ */
function MenuTab() {
  const [menuData, setMenuData] = useState(() => getStoredMenuItems())
  const [activeCategory, setActiveCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const [formData, setFormData] = useState({
    category: 'brownies',
    name: '',
    p500: '',
    p1kg: '',
    unit: '',
    img: '/images/brownies.png'
  })

  const [success, setSuccess] = useState('')

  const handleOpenAdd = () => {
    setEditingItem(null)
    setFormData({
      category: 'brownies',
      name: '',
      p500: '',
      p1kg: '',
      unit: '',
      img: '/images/brownies.png'
    })
    setShowModal(true)
  }

  const handleOpenEdit = (catId, item) => {
    setEditingItem({ catId, itemId: item.id || item.name })
    setFormData({
      category: catId,
      name: item.name,
      p500: item.p500 || '',
      p1kg: item.p1kg || '',
      unit: item.unit || '',
      img: item.img || '/images/cake.png'
    })
    setShowModal(true)
  }

  const handleDeleteItem = (catId, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) return

    const updated = menuData.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: cat.items.filter(i => i.name !== itemName)
        }
      }
      return cat
    })

    setMenuData(updated)
    saveMenuItems(updated)
    setSuccess(`Deleted "${itemName}"`)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSaveItem = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.p500) return

    const newItemObj = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name.trim(),
      p500: Number(formData.p500),
      p1kg: formData.p1kg ? Number(formData.p1kg) : null,
      unit: formData.unit.trim() || null,
      img: formData.img.trim() || '/images/cake.png'
    }

    let updated = [...menuData]

    if (editingItem) {
      updated = updated.map(cat => {
        if (cat.id === editingItem.catId) {
          return {
            ...cat,
            items: cat.items.map(i => i.name === formData.name || i.id === editingItem.itemId ? newItemObj : i)
          }
        }
        return cat
      })
    } else {
      updated = updated.map(cat => {
        if (cat.id === formData.category) {
          return {
            ...cat,
            items: [newItemObj, ...cat.items]
          }
        }
        return cat
      })
    }

    setMenuData(updated)
    saveMenuItems(updated)
    setShowModal(false)
    setSuccess(editingItem ? `Updated "${formData.name}"` : `Added "${formData.name}" to menu!`)
    setTimeout(() => setSuccess(''), 3000)
  }

  const categories = [
    { id: 'all', label: 'All Items 🍽️' },
    { id: 'brownies', label: 'Brownies 🍫' },
    { id: 'tea-cakes', label: 'Tea Cakes ☕' },
    { id: 'guilt-free', label: 'Guilt-Free 🌿' },
    { id: 'cake-jars', label: 'Cake Jars 🍯' },
  ]

  const displayCategories = activeCategory === 'all'
    ? menuData
    : menuData.filter(c => c.id === activeCategory)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-rose/12 shadow-[0_4px_32px_rgba(44,26,14,0.08)]">
        <div>
          <span className="text-[0.68rem] font-bold text-rose uppercase tracking-widest">Interactive Menu Editor</span>
          <h2 className="font-serif text-2xl font-bold text-brown-dark">Menu Item Management 🍽️</h2>
          <p className="text-xs text-brown-light mt-1">
            Add, edit or delete menu items. Any change updates the live website menu and dropdowns instantly.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-full bg-brown-dark text-cream-light font-medium text-xs shadow-md hover:bg-brown-mid transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>+ Add New Bake Item</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 bg-green-100 border border-green-300 text-green-800 rounded-2xl text-xs font-semibold animate-stepIn flex items-center justify-between">
          <span>✓ {success}</span>
          <span className="text-[0.65rem] opacity-75">Live Site Updated</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-brown-dark text-cream-light shadow-md'
                : 'bg-white border border-rose/20 text-brown-mid hover:bg-rose/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Categories & Items List */}
      <div className="space-y-8">
        {displayCategories.map(cat => (
          <div key={cat.id} className="bg-white rounded-3xl p-6 border border-rose/12 shadow-[0_4px_32px_rgba(44,26,14,0.08)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">{cat.emoji}</span>
                <h3 className="font-serif text-lg font-bold text-brown-dark">{cat.category}</h3>
                <span className="text-xs text-brown-light/60">({cat.items.length} items)</span>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null)
                  setFormData({ category: cat.id, name: '', p500: '', p1kg: '', unit: '', img: '/images/cake.png' })
                  setShowModal(true)
                }}
                className="text-xs font-semibold text-rose hover:underline cursor-pointer"
              >
                + Add to {cat.category}
              </button>
            </div>

            {/* Items Table */}
            <div className="divide-y divide-rose/8">
              {cat.items.map(item => (
                <div key={item.name} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-rose/5 px-3 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.img || '/images/cake.png'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-rose/15 shrink-0"
                    />
                    <div>
                      <h4 className="font-semibold text-brown-dark text-sm">{item.name}</h4>
                      {item.unit && <span className="text-[0.68rem] text-rose font-medium">{item.unit}</span>}
                    </div>
                  </div>

                  {/* Price info & Controls */}
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="text-right text-xs">
                      <div className="font-bold text-brown-dark">
                        ₹{item.p500} <span className="text-[0.65rem] font-normal text-brown-light">(500g/unit)</span>
                      </div>
                      {item.p1kg && (
                        <div className="text-brown-mid font-medium text-[0.72rem]">
                          ₹{item.p1kg} <span className="text-[0.62rem] font-normal text-brown-light">(1kg)</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(cat.id, item)}
                        className="px-3 py-1.5 rounded-lg bg-rose/10 text-brown-dark text-xs font-medium hover:bg-rose hover:text-white transition-colors cursor-pointer"
                      >
                        Edit ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteItem(cat.id, item.name)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal (Portalled to document.body to escape CSS transform stacking context) */}
      {showModal && createPortal(
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-brown-dark/60 backdrop-blur-md cursor-pointer"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 animate-stepIn cursor-default border border-rose/15"
          >
            <div className="flex items-center justify-between border-b border-rose/15 pb-4">
              <h3 className="font-serif text-xl font-bold text-brown-dark">
                {editingItem ? 'Edit Menu Item' : 'Add New Bake Item'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-cream text-brown-dark font-bold text-sm hover:bg-rose/20 transition-colors cursor-pointer flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brown-mid uppercase tracking-widest mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  disabled={!!editingItem}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm focus:outline-none focus:border-rose"
                >
                  <option value="brownies">Brownies 🍫</option>
                  <option value="tea-cakes">Tea Cakes ☕</option>
                  <option value="guilt-free">Guilt-Free Bakes 🌿</option>
                  <option value="cake-jars">Cake Jars 🍯</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-brown-mid uppercase tracking-widest mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nutella Fudge Brownie"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm focus:outline-none focus:border-rose"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brown-mid uppercase tracking-widest mb-1">
                    500g / Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 550"
                    value={formData.p500}
                    onChange={e => setFormData({ ...formData, p500: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm focus:outline-none focus:border-rose"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brown-mid uppercase tracking-widest mb-1">
                    1kg Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1025"
                    value={formData.p1kg}
                    onChange={e => setFormData({ ...formData, p1kg: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm focus:outline-none focus:border-rose"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brown-mid uppercase tracking-widest mb-1">
                  Unit Label / Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. per jar, per piece, or leave blank for 500g & 1kg"
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm focus:outline-none focus:border-rose"
                />
              </div>

              <div>
                <label className="block font-semibold text-brown-mid uppercase tracking-widest mb-1">
                  Product Image *
                </label>
                <div className="flex items-center gap-3">
                  {formData.img && (
                    <img
                      src={formData.img}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-rose/20 shadow-xs shrink-0"
                    />
                  )}
                  <label className="flex-1 border-2 border-dashed border-rose/30 hover:border-rose rounded-xl p-3 text-center cursor-pointer bg-cream-light/40 hover:bg-rose/5 transition-all">
                    <span className="text-xs font-semibold text-brown-dark block">
                      📷 {formData.img ? 'Change Image File' : 'Upload Image File'}
                    </span>
                    <span className="text-[0.65rem] text-brown-light block mt-0.5">JPG, PNG, WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        try {
                          const ext = file.name.split('.').pop()
                          const filename = `item-${Date.now()}.${ext}`
                          const { data, error } = await supabase.storage
                            .from('menu')
                            .upload(filename, file, { cacheControl: '3600', upsert: true })

                          if (!error && data?.path) {
                            const { data: { publicUrl } } = supabase.storage.from('menu').getPublicUrl(data.path)
                            setFormData(prev => ({ ...prev, img: publicUrl }))
                          } else {
                            const reader = new FileReader()
                            reader.onload = (ev) => {
                              setFormData(prev => ({ ...prev, img: ev.target.result }))
                            }
                            reader.readAsDataURL(file)
                          }
                        } catch {
                          const reader = new FileReader()
                          reader.onload = (ev) => {
                            setFormData(prev => ({ ...prev, img: ev.target.result }))
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-full border border-brown-dark/20 text-brown-dark font-medium text-xs hover:bg-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-brown-dark text-cream-light font-bold text-xs shadow-md hover:bg-brown-mid transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   FESTIVE THEMES TAB
═══════════════════════════════════════════════════════════════════ */
function ThemesTab() {
  const [selectedTheme, setSelectedTheme] = useState(() => getSavedThemeSetting())
  const [savedStatus, setSavedStatus] = useState('')

  const handleSelectTheme = (themeId) => {
    setSelectedTheme(themeId)
    setTestFestivalTheme(themeId)
    setSavedStatus('Theme updated successfully!')
    setTimeout(() => setSavedStatus(''), 3000)
  }

  const THEMES = [
    { id: 'rakhi',     name: 'Raksha Bandhan', icon: '🪢', color: 'Purple, Green & Red Theme', bg: 'bg-purple-900 text-purple-100' },
    { id: 'diwali',    name: 'Diwali',         icon: '🪔', color: 'Royal Gold, Amber & Maroon', bg: 'bg-amber-800 text-amber-100' },
    { id: 'christmas', name: 'Christmas',      icon: '🎄', color: 'Festive Red, Green & Gold',  bg: 'bg-red-900 text-red-100' },
    { id: 'holi',      name: 'Holi',           icon: '🎨', color: 'Gulal Pink, Cyan & Violet',   bg: 'bg-pink-800 text-pink-100' },
    { id: 'auto',      name: 'Automatic Date-Based', icon: '🗓️', color: 'Auto-detects active date window', bg: 'bg-blue-900 text-blue-100' },
    { id: 'none',      name: 'Standard Bakery Theme', icon: '🧁', color: 'Classic Batter & Bliss Warm Cream', bg: 'bg-brown-dark text-cream-light' }
  ]

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose/12 shadow-[0_4px_32px_rgba(44,26,14,0.08)] max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose/10 pb-5">
        <div>
          <span className="text-[0.68rem] font-bold text-rose uppercase tracking-widest">Admin Control</span>
          <h2 className="font-serif text-2xl font-bold text-brown-dark">Festive Theme System 🎨</h2>
          <p className="text-xs text-brown-light mt-1">
            Select a festival theme to activate across the entire website. Perfect for testing, previews, and seasonal campaigns.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-full bg-brown-dark text-cream-light font-medium text-xs shadow-md hover:bg-brown-mid transition-all shrink-0 text-center flex items-center justify-center gap-1.5"
        >
          <span>Live Site Preview</span>
          <span>↗</span>
        </a>
      </div>

      {savedStatus && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-xl text-xs font-semibold animate-stepIn">
          ✓ {savedStatus}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {THEMES.map(t => {
          const isSelected = selectedTheme === t.id
          return (
            <div
              key={t.id}
              onClick={() => handleSelectTheme(t.id)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-brown-dark ring-2 ring-brown-dark/20 shadow-md bg-cream-light/60'
                  : 'border-rose/15 bg-white hover:border-rose/40 hover:bg-rose/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${t.bg}`}>
                    {t.icon}
                  </span>
                  {isSelected && (
                    <span className="bg-brown-dark text-cream text-[0.62rem] font-bold px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-base font-bold text-brown-dark mb-1">{t.name}</h3>
                <p className="text-[0.72rem] text-brown-light">{t.color}</p>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleSelectTheme(t.id) }}
                className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-brown-dark text-white'
                    : 'bg-rose/10 text-brown-dark hover:bg-rose/20'
                }`}
              >
                {isSelected ? 'Currently Selected' : 'Activate Theme'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
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
    { id: 'menu',   label: 'Menu Management', icon: '🍽️', badge: null },
    { id: 'themes', label: 'Festive Themes', icon: '🎨', badge: null },
  ]

  return (
    <div className="min-h-screen bg-[#F9F4EE]">
      <header className="bg-white border-b border-rose/12 sticky top-0 z-40 shadow-[0_2px_12px_rgba(44,26,14,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
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
              <span className="ml-2 text-[0.65rem] bg-rose/10 text-rose border border-rose/20 px-2 py-0.5 rounded-full font-medium">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[0.68rem] text-green-600 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
              Live
            </div>
            <button onClick={fetchOrders} className="p-2 rounded-xl hover:bg-cream text-brown-light hover:text-brown-dark transition-colors duration-200 cursor-pointer" title="Refresh">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-rose/15 flex items-center justify-center font-bold text-rose text-sm">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
            <button onClick={signOut} className="px-3 py-1.5 rounded-lg text-[0.72rem] font-medium text-brown-mid hover:bg-rose/8 border border-rose/20 hover:border-rose/40 transition-all duration-200 cursor-pointer">
              Sign out
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-rose/8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 cursor-pointer relative ${
                activeTab === tab.id
                  ? 'border-brown-dark text-brown-dark'
                  : 'border-transparent text-brown-light hover:text-brown-mid hover:border-rose/30'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge ? (
                <span className="w-5 h-5 rounded-full bg-rose text-white text-[0.6rem] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'orders' && (
          <OrdersTab orders={orders} loading={loading} fetchOrders={fetchOrders} />
        )}
        {activeTab === 'menu' && (
          <div className="step-in">
            <MenuTab />
          </div>
        )}
        {activeTab === 'themes' && (
          <div className="step-in">
            <ThemesTab />
          </div>
        )}
      </main>
    </div>
  )
}
