import { supabase } from '../lib/supabase'

export const INITIAL_MENU_DATA = [
  {
    id: 'tea-cakes',
    category: 'Tea Cakes',
    emoji: '☕',
    note: 'Available in 500g & 1kg',
    items: [
      { id: 'vanilla-cake', name: 'Vanilla Cake', p500: 400, p1kg: 750, img: '/images/cake.png' },
      { id: 'marble-cake', name: 'Marble Cake', p500: 450, p1kg: 850, img: '/images/cake.png' },
      { id: 'chocolate-cake', name: 'Chocolate Cake', p500: 475, p1kg: 925, img: '/images/cake.png' },
      { id: 'dry-fruit-cake', name: 'Dry Fruit Cake', p500: 475, p1kg: 925, img: '/images/cake.png' },
      { id: 'banana-walnut-cake', name: 'Banana Walnut Cake', p500: 550, p1kg: 1050, img: '/images/cake.png' },
      { id: 'coffee-cake', name: 'Coffee Cake', p500: 450, p1kg: 850, img: '/images/cake.png' },
      { id: 'nutella-cake', name: 'Nutella Cake', p500: 500, p1kg: 950, img: '/images/cake.png' },
    ],
  },
  {
    id: 'brownies',
    category: 'Brownies',
    emoji: '🍫',
    note: 'Available in 500g & 1kg · Bites sold per piece',
    items: [
      { id: 'walnut-brownie', name: 'Walnut Brownie', p500: 550, p1kg: 1025, img: '/images/brownies.png' },
      { id: 'chocolate-brownie', name: 'Chocolate Brownie', p500: 550, p1kg: 1025, img: '/images/brownies.png' },
      { id: 'fudge-brownie', name: 'Fudge Brownie', p500: 600, p1kg: 1150, img: '/images/brownies.png' },
      { id: 'nutella-brownie', name: 'Nutella Brownie', p500: 650, p1kg: 1175, img: '/images/brownies.png' },
      { id: 'choco-chip-brownie', name: 'Choco-Chip Brownie', p500: 550, p1kg: 1025, img: '/images/brownies.png' },
      { id: 'brownie-bites', name: 'Brownie Bites', p500: 80, p1kg: null, unit: 'per piece', img: '/images/brownies.png' },
    ],
  },
  {
    id: 'guilt-free',
    category: 'Guilt-Free',
    emoji: '🌿',
    note: 'Wholesome ingredients · Available in 500g & 1kg',
    items: [
      { id: 'oats-banana-cake', name: 'Oats Banana Cake', p500: 500, p1kg: 950, img: '/images/cake.png' },
      { id: 'oats-jaggery-atta-cake', name: 'Oats Jaggery Atta Cake', p500: 500, p1kg: 950, img: '/images/cake.png' },
      { id: 'wholewheat-dates-cake', name: 'Wholewheat Dates Cake', p500: 550, p1kg: 1025, img: '/images/cake.png' },
      { id: 'dates-and-walnut-cake', name: 'Dates and Walnut Cake', p500: 600, p1kg: 1150, img: '/images/cake.png' },
    ],
  },
  {
    id: 'cake-jars',
    category: 'Cake Jars',
    emoji: '🍯',
    note: 'Priced per jar',
    items: [
      { id: 'chocolate-cake-jar', name: 'Chocolate Cake Jar', p500: 250, p1kg: null, unit: 'per jar', img: '/images/hamper.png' },
      { id: 'truffle-cake-jar', name: 'Truffle Cake Jar', p500: 275, p1kg: null, unit: 'per jar', img: '/images/hamper.png' },
      { id: 'dark-chocolate-cake-jar', name: 'Dark Chocolate Cake Jar', p500: 250, p1kg: null, unit: 'per jar', img: '/images/hamper.png' },
      { id: 'nutella-cake-jar', name: 'Nutella Cake Jar', p500: 350, p1kg: null, unit: 'per jar', img: '/images/hamper.png' },
      { id: 'kitkat-cake-jar', name: 'Kitkat Cake Jar', p500: 300, p1kg: null, unit: 'per jar', img: '/images/hamper.png' },
    ],
  },
]

export function getStoredMenuItems() {
  try {
    const saved = localStorage.getItem('batterbliss_custom_menu')
    return saved ? JSON.parse(saved) : INITIAL_MENU_DATA
  } catch {
    return INITIAL_MENU_DATA
  }
}

export async function fetchMenuItemsFromSupabase() {
  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'custom_menu_items')
      .maybeSingle()

    if (data?.value) {
      const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem('batterbliss_custom_menu', JSON.stringify(parsed))
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('menu-data-change'))
        }
        return parsed
      }
    }
  } catch (e) {
    console.log('Supabase sync note:', e.message)
  }
  return getStoredMenuItems()
}

export async function saveMenuItems(menuData) {
  try {
    localStorage.setItem('batterbliss_custom_menu', JSON.stringify(menuData))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('menu-data-change'))
    }

    // Persist JSON structure to Supabase settings key 'custom_menu_items'
    await supabase
      .from('settings')
      .upsert({ key: 'custom_menu_items', value: JSON.stringify(menuData), updated_at: new Date().toISOString() })
  } catch (e) {
    console.error('Failed to save menu data:', e)
  }
}
