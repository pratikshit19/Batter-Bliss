/* ── Scheduled Launches Manager & Data Storage ─────────────────── */

const STORAGE_KEY = 'batterbliss_scheduled_launches'

// Helper to format ISO date string for datetime-local input
const getFutureDateISO = (daysOffset, hoursOffset = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  d.setHours(d.getHours() + hoursOffset)
  return d.toISOString()
}

// Initial demo launches
const DEFAULT_LAUNCHES = [
  {
    id: 'launch-matcha-cheesecake-jar',
    name: 'Matcha Pistachio Cheesecake Jar',
    category: 'cake-jars',
    p500: 320,
    unit: 'per jar',
    description: 'Creamy Japanese Matcha infused with roasted pistachios & graham cracker crust in a luxury glass jar.',
    img: '/images/hamper.png',
    comingSoonDate: getFutureDateISO(-2), // Started 2 days ago
    launchDate: getFutureDateISO(2, 6),    // Launches in 2 days & 6 hours
    showCountdownTimer: true,
    whatsappMessage: 'Hi Batter & Bliss! I want to be notified when the Matcha Pistachio Cheesecake Jar launches!'
  },
  {
    id: 'launch-hazelnut-fudge-cake',
    name: 'Saffron Hazelnut Fudgy Tea Cake',
    category: 'tea-cakes',
    p500: 650,
    p1kg: 1200,
    description: 'Rich dark chocolate tea cake baked with Kashmiri Saffron and whole roasted Turkish hazelnuts.',
    img: '/images/cake.png',
    comingSoonDate: getFutureDateISO(-1),
    launchDate: getFutureDateISO(4, 12),
    showCountdownTimer: false, // Optional: countdown hidden for Instagram tease
    whatsappMessage: 'Hi Batter & Bliss! Notify me when Saffron Hazelnut Fudgy Tea Cake goes live!'
  },
  {
    id: 'launch-nutella-cookie-cake',
    name: 'Nutella Sea Salt Cookie Slab',
    category: 'brownies',
    p500: 580,
    p1kg: 1050,
    description: 'Gooey brown butter chocolate chip cookie slab stuffed with molten Nutella and Maldon sea salt flakes.',
    img: '/images/brownies.png',
    comingSoonDate: getFutureDateISO(-5),
    launchDate: getFutureDateISO(-1), // Already launched yesterday -> Live!
    showCountdownTimer: true,
    whatsappMessage: 'Hi Batter & Bliss! I want to order Nutella Sea Salt Cookie Slab!'
  }
]

export function getScheduledLaunches() {
  if (typeof window === 'undefined') return DEFAULT_LAUNCHES
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LAUNCHES))
      return DEFAULT_LAUNCHES
    }
    return JSON.parse(data)
  } catch (e) {
    return DEFAULT_LAUNCHES
  }
}

export function saveScheduledLaunches(items) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('launch-data-change'))
  }
}

export function addScheduledLaunch(newItem) {
  const launches = getScheduledLaunches()
  const updated = [newItem, ...launches]
  saveScheduledLaunches(updated)
  return updated
}

export function deleteScheduledLaunch(id) {
  const launches = getScheduledLaunches()
  const updated = launches.filter(l => l.id !== id)
  saveScheduledLaunches(updated)
  return updated
}

export function updateScheduledLaunch(id, updatedFields) {
  const launches = getScheduledLaunches()
  const updated = launches.map(l => l.id === id ? { ...l, ...updatedFields } : l)
  saveScheduledLaunches(updated)
  return updated
}

// Calculate real-time status: 'coming_soon' | 'live' | 'upcoming'
export function getLaunchState(item) {
  const now = new Date()
  const comingSoon = new Date(item.comingSoonDate)
  const launch = new Date(item.launchDate)

  if (now < comingSoon) {
    return 'upcoming'
  } else if (now >= comingSoon && now < launch) {
    return 'coming_soon'
  } else {
    return 'live'
  }
}

// Calculate time remaining countdown
export function calculateTimeRemaining(targetDateStr) {
  const total = Date.parse(targetDateStr) - Date.parse(new Date())
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))

  return { total, days, hours, minutes, seconds }
}
