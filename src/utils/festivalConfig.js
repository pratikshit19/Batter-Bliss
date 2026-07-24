/* ── Festival Theme System Configuration ─────────────────────────── */

export const FESTIVALS = {
  rakhi: {
    id: 'rakhi',
    name: 'Raksha Bandhan',
    emoji: '🪢',
    active: true, // Currently active theme
    colors: {
      primary: '#581C87',      // Deep Royal Purple
      primaryLight: '#7E22CE',
      accentGreen: '#15803D',  // Festive Emerald Green
      accentGreenLight: '#22C55E',
      accentRed: '#DC2626',    // Vibrant Ruby Red
      accentRedLight: '#EF4444',
      gradient: 'from-purple-900 via-rose-900 to-emerald-900',
      bannerBg: 'bg-gradient-to-r from-purple-900 via-red-600 to-emerald-800',
      cardBg: 'from-purple-950/90 to-emerald-950/90',
      pillPurple: 'bg-purple-900 text-purple-100 border-purple-500/40',
      pillGreen: 'bg-emerald-900 text-emerald-100 border-emerald-500/40',
      pillRed: 'bg-red-900 text-red-100 border-red-500/40',
    },
    topBanner: {
      text: '🪢 Raksha Bandhan Special — Order Handcrafted Rakhi Hampers & Custom Sweet Boxes!',
      cta: 'Explore Rakhi Bakes 🎁'
    },
    hero: {
      badge: '🪢 Raksha Bandhan Special 🎁',
      title: 'Sweeten Your Rakhi Bond ♡',
      subtitle: 'Celebrate brother-sister love with handcrafted Rakhi hampers, artisan fudgy brownies & festive gift boxes in Purple, Green & Red themed packaging.',
      primaryBtnText: 'Shop Rakhi Hampers 🎁',
      bgGradient: 'from-purple-950/20 via-cream to-emerald-950/15'
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
  }
}

export function getActiveFestival() {
  // Returns the active festival config (defaulting to Rakhi)
  return FESTIVALS.rakhi
}
