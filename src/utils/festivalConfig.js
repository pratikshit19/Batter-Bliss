/* ── Complete Indian Festival Theme System Configuration ─────────── */

export const FESTIVALS = {
  rakhi: {
    id: 'rakhi',
    name: 'Raksha Bandhan',
    emoji: '🪢',
    startDate: '2025-07-20',
    endDate: '2025-08-15',
    colors: {
      primary: '#581C87',
      bannerBg: 'bg-gradient-to-r from-purple-900 via-red-600 to-emerald-800',
      sectionBg: 'from-purple-950 via-purple-900 to-emerald-950',
    },
    topBanner: {
      text: '🪢 Raksha Bandhan Special — Order Handcrafted Rakhi Hampers & Custom Sweet Boxes!',
      cta: 'Explore Rakhi Bakes 🎁'
    },
    hero: {
      badge: '🪢 Raksha Bandhan Special 🎁',
      title: 'Sweeten Your Rakhi Bond ♡',
      subtitle: 'Celebrate sibling love with handcrafted Rakhi hampers, artisan fudgy brownies & festive gift boxes.',
      primaryBtnText: 'Shop Rakhi Hampers 🎁',
      bgGradient: 'from-purple-950/25 via-red-950/15 to-emerald-950/20'
    },
    specialProducts: [
      {
        id: 'rakhi-gourmet-hamper',
        name: 'Royal Rakhi Gourmet Box',
        desc: '6 Assorted Fudgy Brownies + Designer Rakhi + Roli Chawal in a Luxury Velvet Box',
        price: 899,
        size: '1 Gift Box',
        tag: '🪢 Rakhi Bestseller',
        img: '/images/hamper.png',
        themeColor: 'purple'
      },
      {
        id: 'brother-sister-bliss',
        name: 'Brother & Sister Bliss Hamper',
        desc: 'Walnut Brownie Box (500g) + Marble Tea Cake (500g) + 2 Cake Jars + 2 Designer Rakhis',
        price: 1399,
        size: 'Deluxe Hamper',
        tag: '⭐ Premium Gift',
        img: '/images/brownies.png',
        themeColor: 'green'
      },
      {
        id: 'custom-rakhi-box',
        name: 'Customized Rakhi Gift Box',
        desc: 'Customize your own hamper! Choose your favourite brownies, cakes & custom note.',
        price: 699,
        size: 'Custom Pack',
        tag: '🎨 Fully Customizable',
        img: '/images/cake.png',
        isCustomWhatsApp: true,
        themeColor: 'red'
      }
    ]
  },

  diwali: {
    id: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    startDate: '2025-10-10',
    endDate: '2025-11-05',
    colors: {
      primary: '#B8860B',
      bannerBg: 'bg-gradient-to-r from-amber-700 via-yellow-600 to-red-800',
      sectionBg: 'from-amber-950 via-yellow-900 to-red-950',
    },
    topBanner: {
      text: '🪔 Happy Diwali! Gifting Deluxe Mithai Brownie Boxes & Festive Dry Fruit Hampers ✨',
      cta: 'Shop Diwali Gifts 🎁'
    },
    hero: {
      badge: '🪔 Festival of Lights Special ✨',
      title: 'Light Up Every Celebration ♡',
      subtitle: 'Illuminate your festive gifting with artisan Kaju Brownie Jars, Royal Almond Cakes & Golden Diwali Hampers.',
      primaryBtnText: 'Explore Diwali Hampers 🪔',
      bgGradient: 'from-amber-950/30 via-yellow-900/10 to-red-950/20'
    },
    specialProducts: [
      {
        id: 'diwali-gold-hamper',
        name: 'Royal Shahi Diwali Box',
        desc: 'Saffron Pistachio Brownies + Almond Tea Cake + 2 Diya Candles & Golden Greeting Card',
        price: 1099,
        size: 'Luxury Box',
        tag: '🪔 Shahi Bestseller',
        img: '/images/hamper.png',
        themeColor: 'purple'
      },
      {
        id: 'diwali-dryfruit-bliss',
        name: 'Dry Fruit & Brownie Celebration',
        desc: 'Loaded Roasted Almond & Walnut Brownies + Roasted Cashews + Pistachio Jar',
        price: 1599,
        size: 'Grand Hamper',
        tag: '✨ Festive Favorite',
        img: '/images/brownies.png',
        themeColor: 'green'
      },
      {
        id: 'custom-diwali-box',
        name: 'Corporate & Custom Diwali Hampers',
        desc: 'Order custom bulk boxes with your company logo & personalized festive notes.',
        price: 799,
        size: 'Bulk & Custom',
        tag: '💼 Corporate Gifting',
        img: '/images/cake.png',
        isCustomWhatsApp: true,
        themeColor: 'red'
      }
    ]
  },

  christmas: {
    id: 'christmas',
    name: 'Christmas & Winter',
    emoji: '🎄',
    startDate: '2025-12-10',
    endDate: '2025-12-28',
    colors: {
      primary: '#991B1B',
      bannerBg: 'bg-gradient-to-r from-red-900 via-emerald-800 to-green-900',
      sectionBg: 'from-red-950 via-green-950 to-slate-900',
    },
    topBanner: {
      text: '🎄 Merry Christmas! Freshly Baked Authentic Plum Cakes & Gingerbread Brownies ❄️',
      cta: 'Order Xmas Bakes 🎅'
    },
    hero: {
      badge: '🎄 Christmas & Winter Special 🎅',
      title: 'Taste the Joy of Christmas ♡',
      subtitle: 'Indulge in rich rum-soaked eggless Plum Cakes, Cinnamon Spiced Loaves & Santa Hamper Jars.',
      primaryBtnText: 'Shop Christmas Bakes 🎄',
      bgGradient: 'from-red-950/25 via-emerald-950/20 to-slate-900/30'
    },
    specialProducts: [
      {
        id: 'xmas-plum-cake-box',
        name: 'Traditional Rich Christmas Plum Cake',
        desc: 'Loaded with rum-soaked dates, raisins, almonds & winter spices. 100% Eggless.',
        price: 850,
        size: '500g Loaf',
        tag: '🎄 Xmas Essential',
        img: '/images/cake.png',
        themeColor: 'purple'
      },
      {
        id: 'santa-brownie-hamper',
        name: 'Santa Delight Brownie Box',
        desc: 'Dark Chocolate Fudge Brownies + Red Velvet Jar + Christmas Ornament',
        price: 999,
        size: 'Festive Box',
        tag: '🎅 Kids & Family Favorite',
        img: '/images/brownies.png',
        themeColor: 'green'
      },
      {
        id: 'custom-xmas-hamper',
        name: 'Custom Christmas Gift Basket',
        desc: 'Build your winter basket with Plum Cakes, Brownie Bites & Hot Chocolate Jars.',
        price: 1199,
        size: 'Custom Gift',
        tag: '❄️ Winter Special',
        img: '/images/hamper.png',
        isCustomWhatsApp: true,
        themeColor: 'red'
      }
    ]
  },

  holi: {
    id: 'holi',
    name: 'Holi',
    emoji: '🎨',
    startDate: '2026-03-01',
    endDate: '2026-03-20',
    colors: {
      primary: '#BE185D',
      bannerBg: 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600',
      sectionBg: 'from-pink-950 via-purple-950 to-indigo-950',
    },
    topBanner: {
      text: '🎨 Happy Holi! Vibrant Thandai Brownies, Gujiya Cakes & Organic Gulal Hampers 🎉',
      cta: 'Explore Holi Treats 🌈'
    },
    hero: {
      badge: '🎨 Holi Festival of Colors Special 🌈',
      title: 'Add Colors to Your Sweet Craving ♡',
      subtitle: 'Celebrate Holi with Thandai Pistachio Brownies, Kesari Loaves & Festive Mithai Jars.',
      primaryBtnText: 'Shop Holi Sweets 🎨',
      bgGradient: 'from-pink-950/25 via-purple-950/20 to-cyan-950/20'
    },
    specialProducts: [
      {
        id: 'holi-thandai-brownie',
        name: 'Thandai Pistachio Brownie Box',
        desc: 'Infused with aromatic thandai spices, pistachios & rose petals. Uniquely delicious!',
        price: 650,
        size: '500g Box',
        tag: '🎨 Holi Bestseller',
        img: '/images/brownies.png',
        themeColor: 'purple'
      },
      {
        id: 'holi-gulal-hamper',
        name: 'Rang Barse Celebration Box',
        desc: 'Thandai Brownies + Kesari Loaf + 2 Packs Organic Herbal Gulal Colors',
        price: 1199,
        size: 'Full Festive Pack',
        tag: '🌈 Organic Gulal Included',
        img: '/images/hamper.png',
        themeColor: 'green'
      },
      {
        id: 'custom-holi-box',
        name: 'Custom Holi Celebration Pack',
        desc: 'Customize your party bakes with Thandai Jars, Brownies & Gujiya Cakes.',
        price: 799,
        size: 'Custom Order',
        tag: '🎉 Party Pack',
        img: '/images/cake.png',
        isCustomWhatsApp: true,
        themeColor: 'red'
      }
    ]
  }
}

// Theme override setting persisted in localStorage
export function getSavedThemeSetting() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('batterbliss_active_theme') || 'rakhi'
  }
  return 'rakhi'
}

export function setTestFestivalTheme(themeId) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('batterbliss_active_theme', themeId)
    window.dispatchEvent(new Event('festival-theme-change'))
  }
}

export function getActiveFestival() {
  const saved = getSavedThemeSetting()

  if (saved === 'none') {
    return null
  }

  if (saved && saved !== 'auto' && FESTIVALS[saved]) {
    return { ...FESTIVALS[saved], active: true }
  }

  // Automatic date window check if saved is 'auto'
  const today = new Date()
  for (const key in FESTIVALS) {
    const fest = FESTIVALS[key]
    if (fest.startDate && fest.endDate) {
      const start = new Date(fest.startDate)
      const end = new Date(fest.endDate)
      end.setHours(23, 59, 59, 999)

      if (today >= start && today <= end) {
        return { ...fest, active: true }
      }
    }
  }

  // Fallback to Rakhi
  return { ...FESTIVALS.rakhi, active: true }
}
