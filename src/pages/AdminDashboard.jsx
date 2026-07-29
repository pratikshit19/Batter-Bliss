import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getSavedThemeSetting, setTestFestivalTheme } from '../utils/festivalConfig'
import { getStoredMenuItems, saveMenuItems } from '../utils/menuManager'
import { getScheduledLaunches, saveScheduledLaunches, deleteScheduledLaunch, getLaunchState } from '../utils/launchManager'
import { Package, Utensils, Rocket, Palette, Plus, Pencil, Trash2, Clock, Calendar, CheckCircle2, Upload } from 'lucide-react'

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
  if (!d) return '—'
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function StatusDropdown({ currentStatus, onStatusChange }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)

  const toggle = (e) => {
    e.stopPropagation()
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      })
    }
    setOpen(prev => !prev)
  }

  useEffect(() => {
    const handleClose = () => setOpen(false)
    if (open) window.addEventListener('click', handleClose)
    return () => window.removeEventListener('click', handleClose)
  }, [open])

  const cur = STATUS_MAP[currentStatus] || { label: currentStatus, color: 'bg-gray-100 text-gray-800 border-gray-200' }

  return (
    <div className="relative inline-block" onClick={e => e.stopPropagation()}>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-all duration-150 ${cur.color}`}
      >
        <span>{cur.label}</span>
        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && createPortal(
        <div
          style={{ top: coords.top, left: coords.left }}
          className="fixed z-50 bg-white rounded-xl shadow-xl border border-brown/10 py-1.5 min-w-[160px] animate-fadeIn"
          onClick={e => e.stopPropagation()}
        >
          {STATUSES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                onStatusChange(s.value)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-cream/60 flex items-center justify-between cursor-pointer transition-colors ${
                currentStatus === s.value ? 'text-brown-dark font-bold bg-cream/40' : 'text-brown-mid'
              }`}
            >
              <span>{s.label}</span>
              {currentStatus === s.value && <span className="text-brown-dark font-bold">✓</span>}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ORDERS TAB
═══════════════════════════════════════════════════════════════════ */
function OrdersTab({ orders, loading, fetchOrders }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    setErrorMsg('')
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      setErrorMsg(`Failed to update order #${orderId.slice(0, 8)}: ${error.message}`)
    } else {
      await fetchOrders()
    }
    setUpdatingId(null)
  }

  const filteredOrders = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter
    const q = search.toLowerCase().trim()
    if (!q) return matchFilter
    const name  = (o.customer_name || '').toLowerCase()
    const phone = (o.phone || '').toLowerCase()
    const city  = (o.city || '').toLowerCase()
    const id    = (o.id || '').toLowerCase()
    const itemsStr = Array.isArray(o.items)
      ? o.items.map(i => i.name).join(' ').toLowerCase()
      : ''
    const matchSearch = name.includes(q) || phone.includes(q) || city.includes(q) || id.includes(q) || itemsStr.includes(q)
    return matchFilter && matchSearch
  })

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose/12 shadow-[0_2px_12px_rgba(44,26,14,0.05)]">
          <p className="text-[0.68rem] font-bold uppercase tracking-wider text-brown-light mb-1">Total Orders</p>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-brown-dark">{loading ? '—' : orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/60 shadow-[0_2px_12px_rgba(44,26,14,0.05)] bg-amber-50/20">
          <p className="text-[0.68rem] font-bold uppercase tracking-wider text-amber-700 mb-1">Pending Orders</p>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-800">
            {loading ? '—' : orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-green-200/60 shadow-[0_2px_12px_rgba(44,26,14,0.05)] bg-green-50/20">
          <p className="text-[0.68rem] font-bold uppercase tracking-wider text-green-700 mb-1">Delivered</p>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-green-800">{loading ? '—' : deliveredCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose/12 shadow-[0_2px_12px_rgba(44,26,14,0.05)]">
          <p className="text-[0.68rem] font-bold uppercase tracking-wider text-brown-light mb-1">Total Revenue</p>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-brown-dark">
            {loading ? '—' : `₹${totalRevenue.toLocaleString('en-IN')}`}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-rose/12 shadow-[0_2px_12px_rgba(44,26,14,0.05)] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                filter === tab.value
                  ? 'bg-brown-dark text-cream-light shadow-xs'
                  : 'bg-rose/8 text-brown-mid hover:bg-rose/15'
              }`}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <span className="ml-1 opacity-70">
                  ({orders.filter(o => o.status === tab.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-cream/40 border border-rose/20 rounded-full text-xs text-brown-dark placeholder-brown-light/60 focus:outline-none focus:border-rose"
          />
          <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-brown-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-rose/12 shadow-[0_2px_12px_rgba(44,26,14,0.05)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-brown-light text-sm font-medium">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-brown-light text-sm font-medium">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream/40 border-b border-rose/10 text-brown-mid font-serif font-bold text-[0.72rem] uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID &amp; Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose/8">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-brown-dark text-[0.75rem]">#{order.id.slice(0, 8)}</div>
                      <div className="text-[0.68rem] text-brown-light font-medium">{fmt(order.created_at)} at {fmtTime(order.created_at)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-brown-dark">{order.customer_name || 'Anonymous'}</div>
                      <div className="text-[0.68rem] text-brown-mid font-medium">{order.phone}</div>
                      <div className="text-[0.65rem] text-brown-light truncate max-w-[180px]">{order.address}, {order.city}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {Array.isArray(order.items) && order.items.map((item, idx) => (
                          <div key={idx} className="text-brown-dark text-[0.72rem] flex items-center justify-between gap-2">
                            <span><strong className="font-semibold">{item.qty || 1}x</strong> {item.name} ({item.size})</span>
                            <span className="font-mono text-brown-mid">₹{(item.price || 0) * (item.qty || 1)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-brown-dark text-sm whitespace-nowrap">
                      ₹{order.total_amount}
                    </td>
                    <td className="py-3.5 px-4">
                      {updatingId === order.id ? (
                        <span className="text-[0.68rem] text-brown-light font-medium animate-pulse">Updating...</span>
                      ) : (
                        <StatusDropdown
                          currentStatus={order.status || 'pending'}
                          onStatusChange={newStatus => handleStatusChange(order.id, newStatus)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MENU MANAGEMENT TAB
═══════════════════════════════════════════════════════════════════ */
function MenuTab() {
  const [menuData, setMenuData] = useState(() => getStoredMenuItems())
  const [selectedCatFilter, setSelectedCatFilter] = useState('all')
  const [editingItem, setEditingItem] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatNote, setNewCatNote] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    category: 'brownies',
    name: '',
    p500: '',
    p1kg: '',
    unit: '',
    description: '',
    img: '/images/cake.png',
    images: ['/images/cake.png']
  })

  const openNewItemModal = () => {
    setEditingItem(null)
    const firstCatId = menuData[0]?.id || 'brownies'
    setFormData({
      category: firstCatId,
      name: '',
      p500: '',
      p1kg: '',
      unit: '',
      description: '',
      img: '/images/cake.png',
      images: ['/images/cake.png']
    })
    setShowModal(true)
  }

  const openEditItemModal = (catId, item) => {
    setEditingItem({ catId, itemId: item.id })
    const initialImgs = item.images && item.images.length > 0 ? item.images : [item.img || '/images/cake.png']
    setFormData({
      category: catId,
      name: item.name,
      p500: item.p500 || '',
      p1kg: item.p1kg || '',
      unit: item.unit || '',
      description: item.description || '',
      img: initialImgs[0],
      images: initialImgs
    })
    setShowModal(true)
  }

  const handleSaveCategory = (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    const catId = newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const existing = menuData.find(c => c.id === catId || (c.category && c.category.toLowerCase() === newCatName.trim().toLowerCase()))

    if (existing) {
      alert(`Category "${newCatName.trim()}" already exists!`)
      return
    }

    const newCatObj = {
      id: catId,
      category: newCatName.trim(),
      note: newCatNote.trim() || 'Custom bakery creations',
      items: []
    }

    const updated = [...menuData, newCatObj]
    setMenuData(updated)
    saveMenuItems(updated)
    setShowCategoryModal(false)
    setNewCatName('')
    setNewCatNote('')
    setFormData(prev => ({ ...prev, category: catId }))
    setSuccess(`Added new category "${newCatObj.category}"!`)
    setTimeout(() => setSuccess(''), 3000)
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

    const galleryImgs = formData.images && formData.images.length > 0 ? formData.images : [formData.img || '/images/cake.png']

    const newItemObj = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name.trim(),
      p500: Number(formData.p500),
      p1kg: formData.p1kg ? Number(formData.p1kg) : null,
      unit: formData.unit ? formData.unit.trim() : null,
      description: formData.description ? formData.description.trim() : null,
      img: galleryImgs[0],
      images: galleryImgs
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

  const totalItemCount = menuData.reduce((acc, cat) => acc + cat.items.length, 0)
  const visibleCategories = selectedCatFilter === 'all'
    ? menuData
    : menuData.filter(cat => cat.id === selectedCatFilter)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-rose/12 shadow-[0_4px_24px_rgba(44,26,14,0.06)]">
        <div>
          <span className="text-[0.68rem] font-bold text-rose uppercase tracking-widest">Bakery Inventory</span>
          <h2 className="font-serif text-2xl font-bold text-brown-dark">Menu Item Management</h2>
          <p className="text-xs text-brown-light mt-1">Add, edit, update prices, or remove bakery products live on the website menu.</p>
        </div>

        <button
          onClick={openNewItemModal}
          className="px-5 py-2.5 rounded-2xl bg-brown-dark text-cream font-bold text-xs shadow-md hover:bg-brown-mid transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-cream" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Category Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-rose/12 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setSelectedCatFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedCatFilter === 'all'
              ? 'bg-brown-dark text-cream shadow-md'
              : 'bg-rose/8 text-brown-mid hover:bg-rose/15'
          }`}
        >
          All Categories ({totalItemCount})
        </button>
        {menuData.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatFilter(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCatFilter === cat.id
                ? 'bg-brown-dark text-cream shadow-md'
                : 'bg-rose/8 text-brown-mid hover:bg-rose/15'
            }`}
          >
            {cat.category || cat.title || cat.id} ({cat.items.length})
          </button>
        ))}

        <button
          onClick={() => setShowCategoryModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 transition-all shrink-0 cursor-pointer flex items-center gap-1 ml-auto"
        >
          <Plus className="w-3.5 h-3.5 text-amber-900" />
          <span>Add New Category</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-xl text-xs font-semibold animate-stepIn">
          ✓ {success}
        </div>
      )}

      <div className="space-y-8">
        {visibleCategories.map(category => (
          <div key={category.id} className="bg-white rounded-3xl p-6 border border-rose/12 shadow-[0_2px_16px_rgba(44,26,14,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-rose/10 pb-3">
              <h3 className="font-serif text-xl font-bold text-brown-dark flex items-center gap-2">
                <span>{category.category || category.title || category.id}</span>
                <span className="text-xs font-normal text-brown-light">({category.items.length} items)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map(item => (
                <div key={item.id} className="p-4 rounded-2xl border border-rose/15 bg-cream/20 flex flex-col justify-between space-y-3 group hover:border-rose/40 transition-all">
                  <div className="flex gap-3">
                    <img
                      src={item.img || '/images/cake.png'}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-rose/20 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-brown-dark text-xs truncate" title={item.name}>{item.name}</h4>
                      <p className="text-[0.65rem] text-brown-light line-clamp-2 mt-0.5">{item.description || 'Pure butter artisan bake'}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-rose">
                          ₹{item.p500} {item.unit ? `(${item.unit})` : '(500g)'}
                        </span>
                        {item.p1kg && (
                          <span className="text-[0.68rem] font-semibold text-brown-mid">
                            · ₹{item.p1kg} (1kg)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose/10">
                    <button
                      onClick={() => openEditItemModal(category.id, item)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-rose/20 text-brown-dark font-bold text-[0.68rem] hover:bg-rose/10 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3 text-brown-dark" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteItem(category.id, item.name)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold text-[0.68rem] hover:bg-red-100 transition-all cursor-pointer flex items-center gap-1 border border-red-200"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && createPortal(
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose/20 flex flex-col max-h-[88vh] my-auto">
            
            <div className="flex items-center justify-between border-b border-rose/10 pb-3 shrink-0">
              <h3 className="font-serif text-xl font-bold text-brown-dark">
                {editingItem ? 'Edit Product Item' : 'Add New Product Item'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-brown-light hover:text-brown-dark font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form id="menu-item-form" onSubmit={handleSaveItem} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
              <div>
                <label className="block font-semibold text-brown-mid uppercase tracking-widest mb-1 flex justify-between">
                  <span>Category *</span>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="text-rose font-bold text-[0.65rem] hover:underline cursor-pointer uppercase"
                  >
                    + Add New Category
                  </button>
                </label>
                <select
                  value={formData.category}
                  disabled={!!editingItem}
                  onChange={e => {
                    if (e.target.value === 'ADD_NEW_CATEGORY') {
                      setShowCategoryModal(true)
                    } else {
                      setFormData({ ...formData, category: e.target.value })
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm focus:outline-none focus:border-rose"
                >
                  {menuData.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category || cat.title || cat.id}
                    </option>
                  ))}
                  <option value="ADD_NEW_CATEGORY" className="font-bold text-rose">+ Create New Category...</option>
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
                  Product Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the flavors, texture, pure butter ingredients, or serving suggestions..."
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 bg-white text-brown-dark text-sm focus:outline-none focus:border-rose"
                />
              </div>

              <div>
                <label className="block font-semibold text-brown-mid uppercase tracking-widest mb-1 flex justify-between">
                  <span>Product Gallery Images ({formData.images?.length || 0})</span>
                  <span className="text-[0.65rem] text-rose font-normal uppercase">First image is main thumbnail</span>
                </label>

                {/* Uploaded Gallery Thumbnails */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(formData.images || [formData.img]).map((imgUrl, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-rose/20 shadow-xs group shrink-0">
                      <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const currentImgs = formData.images || [formData.img]
                          const updatedImgs = currentImgs.filter((_, index) => index !== i)
                          const newMain = updatedImgs[0] || '/images/cake.png'
                          setFormData({ ...formData, images: updatedImgs, img: newMain })
                        }}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[0.65rem] flex items-center justify-center shadow-md opacity-80 group-hover:opacity-100 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="new-img-url"
                      placeholder="Add Image URL (e.g. /images/brownies.png)"
                      className="flex-1 px-3 py-2 rounded-xl border border-rose/25 text-xs text-brown-dark"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('new-img-url')
                        if (input && input.value.trim()) {
                          const newImgs = [...(formData.images || [formData.img]), input.value.trim()]
                          setFormData({ ...formData, images: newImgs, img: newImgs[0] })
                          input.value = ''
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-brown-dark text-cream font-bold text-xs hover:bg-brown-mid"
                    >
                      + Add URL
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3.5 py-2 rounded-xl border border-rose/25 bg-cream/30 text-brown-mid text-xs font-semibold cursor-pointer hover:bg-cream/60 transition-colors text-center">
                      <span>Upload Local File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              const newImgs = [...(formData.images || [formData.img]), reader.result]
                              setFormData({ ...formData, images: newImgs, img: newImgs[0] })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose/10 shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                form="menu-item-form"
                type="submit"
                className="px-5 py-2 rounded-xl bg-brown-dark text-cream font-bold hover:bg-brown-mid shadow-md cursor-pointer"
              >
                {editingItem ? 'Save Changes' : 'Add Item'}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {showCategoryModal && createPortal(
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose/20 flex flex-col my-auto space-y-4">
            <div className="flex items-center justify-between border-b border-rose/10 pb-3">
              <h3 className="font-serif text-xl font-bold text-brown-dark flex items-center gap-2">
                <span>Add New Category</span>
                <Plus className="w-4 h-4 text-rose" />
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-brown-light hover:text-brown-dark font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brown-dark mb-1 uppercase text-[0.68rem]">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pies & Tarts, Macarons, Cookies"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 text-brown-dark focus:outline-none focus:border-rose text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-brown-dark mb-1 uppercase text-[0.68rem]">Note / Subtitle (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Priced per box, or Available in 500g & 1kg"
                  value={newCatNote}
                  onChange={e => setNewCatNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 text-brown-dark focus:outline-none focus:border-rose text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose/10">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brown-dark text-cream font-bold hover:bg-brown-mid shadow-md cursor-pointer"
                >
                  Create Category
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
   SCHEDULED LAUNCHES MANAGEMENT TAB
═══════════════════════════════════════════════════════════════════ */
function LaunchesTab() {
  const [launches, setLaunches] = useState(() => getScheduledLaunches())
  const [menuCategories, setMenuCategories] = useState(() => getStoredMenuItems())
  const [selectedCatFilter, setSelectedCatFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingLaunch, setEditingLaunch] = useState(null)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const handleMenuChange = () => setMenuCategories(getStoredMenuItems())
    window.addEventListener('menu-data-change', handleMenuChange)
    return () => window.removeEventListener('menu-data-change', handleMenuChange)
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    category: 'brownies',
    p500: '',
    p1kg: '',
    unit: '',
    description: '',
    img: '/images/hamper.png',
    comingSoonDate: '',
    launchDate: '',
    showCountdownTimer: true,
    whatsappMessage: ''
  })

  const openNewModal = () => {
    setEditingLaunch(null)
    const now = new Date()
    const in2Days = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    setFormData({
      name: '',
      category: 'brownies',
      p500: '',
      p1kg: '',
      unit: '',
      description: '',
      img: '/images/hamper.png',
      comingSoonDate: now.toISOString().slice(0, 16),
      launchDate: in2Days.toISOString().slice(0, 16),
      showCountdownTimer: true,
      whatsappMessage: ''
    })
    setShowModal(true)
  }

  const openEditModal = (launchItem) => {
    setEditingLaunch(launchItem)
    setFormData({
      name: launchItem.name || '',
      category: launchItem.category || 'brownies',
      p500: launchItem.p500 || '',
      p1kg: launchItem.p1kg || '',
      unit: launchItem.unit || '',
      description: launchItem.description || '',
      img: launchItem.img || '/images/hamper.png',
      comingSoonDate: launchItem.comingSoonDate ? new Date(launchItem.comingSoonDate).toISOString().slice(0, 16) : '',
      launchDate: launchItem.launchDate ? new Date(launchItem.launchDate).toISOString().slice(0, 16) : '',
      showCountdownTimer: launchItem.showCountdownTimer !== false,
      whatsappMessage: launchItem.whatsappMessage || ''
    })
    setShowModal(true)
  }

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete scheduled launch for "${name}"?`)) return
    const updated = deleteScheduledLaunch(id)
    setLaunches(updated)
    setSuccess(`Deleted "${name}"`)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.p500 || !formData.launchDate) return

    const launchObj = {
      id: editingLaunch ? editingLaunch.id : `launch-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      p500: Number(formData.p500),
      p1kg: formData.p1kg ? Number(formData.p1kg) : null,
      unit: formData.unit ? formData.unit.trim() : null,
      description: formData.description ? formData.description.trim() : '',
      img: formData.img || '/images/hamper.png',
      comingSoonDate: formData.comingSoonDate ? new Date(formData.comingSoonDate).toISOString() : new Date().toISOString(),
      launchDate: new Date(formData.launchDate).toISOString(),
      showCountdownTimer: formData.showCountdownTimer,
      whatsappMessage: formData.whatsappMessage ? formData.whatsappMessage.trim() : `Hi Batter & Bliss! Notify me when ${formData.name} launches!`
    }

    let updated = []
    if (editingLaunch) {
      updated = launches.map(l => l.id === editingLaunch.id ? launchObj : l)
    } else {
      updated = [launchObj, ...launches]
    }

    setLaunches(updated)
    saveScheduledLaunches(updated)
    setShowModal(false)
    setSuccess(editingLaunch ? `Updated launch for "${formData.name}"` : `Scheduled launch for "${formData.name}"!`)
    setTimeout(() => setSuccess(''), 3000)
  }

  const CATEGORY_LABELS = {
    'all': 'All Categories',
    'brownies': 'Brownies',
    'tea-cakes': 'Tea Cakes',
    'guilt-free': 'Guilt-Free Bakes',
    'cake-jars': 'Cake Jars'
  }

  const visibleLaunches = selectedCatFilter === 'all'
    ? launches
    : launches.filter(l => l.category === selectedCatFilter)

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose/12 shadow-[0_4px_32px_rgba(44,26,14,0.08)] max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose/10 pb-5">
        <div>
          <span className="text-[0.68rem] font-bold text-rose uppercase tracking-widest">Product Roadmap</span>
          <h2 className="font-serif text-2xl font-bold text-brown-dark flex items-center gap-2">
            <span>Scheduled Product Launches</span>
            <Rocket className="w-5 h-5 text-rose" />
          </h2>
          <p className="text-xs text-brown-light mt-1">
            Schedule new bakes to display as "Coming Soon" with live countdown timers, then automatically switch to "Live".
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-5 py-2.5 rounded-2xl bg-brown-dark text-cream font-bold text-xs shadow-md hover:bg-brown-mid transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-cream" />
          <span>Schedule New Launch</span>
        </button>
      </div>

      {/* Category Filter Bar for Launches */}
      <div className="bg-cream/30 p-3 rounded-2xl border border-rose/12 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setSelectedCatFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedCatFilter === 'all'
              ? 'bg-brown-dark text-cream shadow-md'
              : 'bg-white text-brown-mid hover:bg-rose/10 border border-rose/10'
          }`}
        >
          All Categories ({launches.length})
        </button>
        {menuCategories.map(cat => {
          const count = launches.filter(l => l.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCatFilter === cat.id
                  ? 'bg-brown-dark text-cream shadow-md'
                  : 'bg-white text-brown-mid hover:bg-rose/10 border border-rose/10'
              }`}
            >
              {cat.category || cat.title || cat.id} ({count})
            </button>
          )
        })}
      </div>

      {success && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-xl text-xs font-semibold animate-stepIn">
          ✓ {success}
        </div>
      )}

      {/* Table of Launches */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-rose/15 text-brown-mid uppercase tracking-wider text-[0.68rem] font-bold">
              <th className="py-3 px-2">Item</th>
              <th className="py-3 px-2">Category</th>
              <th className="py-3 px-2">Price</th>
              <th className="py-3 px-2">Coming Soon Start</th>
              <th className="py-3 px-2">Official Launch Date</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose/10">
            {visibleLaunches.map(l => {
              const state = getLaunchState(l)
              const isComingSoon = state === 'coming_soon'
              const isLive = state === 'live'

              return (
                <tr key={l.id} className="hover:bg-cream/30 transition-colors">
                  <td className="py-3 px-2 flex items-center gap-3">
                    <img src={l.img || '/images/cake.png'} alt={l.name} className="w-10 h-10 rounded-xl object-cover border border-rose/20" />
                    <div>
                      <span className="font-bold text-brown-dark text-sm block">{l.name}</span>
                      <span className="text-[0.65rem] text-brown-light line-clamp-1">{l.description}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-medium capitalize text-brown-dark">{l.category}</td>
                  <td className="py-3 px-2 font-bold text-brown-dark">₹{l.p500}</td>
                  <td className="py-3 px-2 text-brown-light">{new Date(l.comingSoonDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="py-3 px-2 font-semibold text-brown-dark">{new Date(l.launchDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="py-3 px-2">
                    {isComingSoon ? (
                      <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full font-bold text-[0.65rem] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>Coming Soon</span>
                      </span>
                    ) : isLive ? (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-bold text-[0.65rem] inline-flex items-center gap-1">
                        <Rocket className="w-3 h-3 text-emerald-600" />
                        <span>Live / Launched</span>
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded-full font-bold text-[0.65rem] inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Draft</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(l)}
                        className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors font-bold text-xs cursor-pointer flex items-center gap-1 border border-amber-200"
                        title="Edit Launch"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(l.id, l.name)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-bold text-xs cursor-pointer flex items-center gap-1 border border-red-200"
                        title="Delete Launch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Schedule Launch Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose/20 flex flex-col max-h-[88vh] my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-rose/10 pb-3 shrink-0">
              <h3 className="font-serif text-xl font-bold text-brown-dark flex items-center gap-2">
                <span>{editingLaunch ? 'Edit Scheduled Launch' : 'Schedule New Product Launch'}</span>
                <Rocket className="w-5 h-5 text-rose" />
              </h3>
              <button onClick={() => setShowModal(false)} className="text-brown-light hover:text-brown-dark font-bold text-lg cursor-pointer">✕</button>
            </div>

            {/* Scrollable Form Body */}
            <form id="launch-form" onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-3.5 text-xs pr-1">
              <div>
                <label className="block font-bold text-brown-dark mb-1 uppercase text-[0.68rem]">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Matcha Pistachio Cheesecake Jar"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 text-brown-dark focus:outline-none focus:border-rose text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brown-dark mb-1 uppercase text-[0.68rem]">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 text-brown-dark focus:outline-none focus:border-rose text-xs"
                  >
                    {menuCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.category || cat.title || cat.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brown-dark mb-1 uppercase text-[0.68rem]">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 580"
                    value={formData.p500}
                    onChange={e => setFormData({ ...formData, p500: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 text-brown-dark focus:outline-none focus:border-rose text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brown-dark mb-1 uppercase text-[0.68rem]">Coming Soon Start *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.comingSoonDate}
                    onChange={e => setFormData({ ...formData, comingSoonDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 text-brown-dark focus:outline-none focus:border-rose text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brown-dark mb-1 uppercase text-[0.68rem]">Official Launch Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.launchDate}
                    onChange={e => setFormData({ ...formData, launchDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 text-brown-dark focus:outline-none focus:border-rose text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                <input
                  type="checkbox"
                  id="showCountdownTimer"
                  checked={formData.showCountdownTimer}
                  onChange={e => setFormData({ ...formData, showCountdownTimer: e.target.checked })}
                  className="w-4 h-4 rounded border-amber-300 text-brown-dark focus:ring-amber-400 cursor-pointer"
                />
                <label htmlFor="showCountdownTimer" className="text-xs font-bold cursor-pointer select-none">
                  Display Live Countdown Timer on Homepage (Optional)
                </label>
              </div>

              <div>
                <label className="block font-bold text-brown-dark mb-1 uppercase text-[0.68rem] flex justify-between">
                  <span>Product Image</span>
                  <span className="text-[0.65rem] text-rose font-normal uppercase">Upload File or URL</span>
                </label>

                {/* Thumbnail Preview */}
                {formData.img && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-rose/20 shadow-xs mb-2 group shrink-0">
                    <img src={formData.img} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, img: '' })}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[0.65rem] flex items-center justify-center shadow-md cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3.5 py-2.5 rounded-xl border border-rose/25 bg-cream/40 text-brown-dark text-xs font-bold cursor-pointer hover:bg-cream/70 transition-colors text-center flex items-center justify-center gap-2 border-dashed">
                      <Upload className="w-4 h-4 text-brown-dark" />
                      <span>Upload Local Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setFormData({ ...formData, img: reader.result })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Or paste Image URL (e.g. /images/brownies.png)"
                      value={formData.img}
                      onChange={e => setFormData({ ...formData, img: e.target.value })}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-rose/25 text-xs text-brown-dark focus:outline-none focus:border-rose"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brown-dark mb-1 uppercase text-[0.68rem]">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe flavors, texture, pure butter ingredients..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 text-brown-dark focus:outline-none focus:border-rose text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-brown-dark mb-1 uppercase text-[0.68rem]">WhatsApp Alert Message (Optional)</label>
                <input
                  type="text"
                  placeholder="Hi Batter & Bliss! Notify me when [Product] launches!"
                  value={formData.whatsappMessage}
                  onChange={e => setFormData({ ...formData, whatsappMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose/25 text-brown-dark focus:outline-none focus:border-rose text-xs"
                />
              </div>
            </form>

            {/* Modal Action Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose/10 shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                form="launch-form"
                type="submit"
                className="px-5 py-2 rounded-xl bg-brown-dark text-cream font-bold hover:bg-brown-mid shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Rocket className="w-4 h-4 text-cream" />
                <span>{editingLaunch ? 'Save Changes' : 'Save Launch'}</span>
              </button>
            </div>

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
    { id: 'rakhi',     name: 'Raksha Bandhan', icon: '🪢', color: 'Purple, Pink & Emerald Theme', bg: 'bg-purple-900 text-purple-100' },
    { id: 'independenceday', name: 'Independence Day', icon: '🇮🇳', color: 'Saffron, White & Green (15th Aug)', bg: 'bg-orange-800 text-orange-100' },
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
          <h2 className="font-serif text-2xl font-bold text-brown-dark flex items-center gap-2">
            <span>Festive Theme System</span>
            <Palette className="w-5 h-5 text-rose" />
          </h2>
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
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" />, badge: pendingCount || null },
    { id: 'menu',   label: 'Menu Management', icon: <Utensils className="w-4 h-4" />, badge: null },
    { id: 'launches', label: 'Scheduled Launches', icon: <Rocket className="w-4 h-4" />, badge: null },
    { id: 'themes', label: 'Festive Themes', icon: <Palette className="w-4 h-4" />, badge: null },
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-rose/8 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 cursor-pointer relative shrink-0 ${
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
        {activeTab === 'launches' && (
          <div className="step-in">
            <LaunchesTab />
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
