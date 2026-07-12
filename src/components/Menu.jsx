import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll'

const products = [
  {
    id: 'brownies',
    img: '/images/brownies.png',
    alt: 'Fudgy brownies by Batter and Bliss',
    tag: '⭐ Bestseller',
    title: 'Fudgy Brownies ♡',
    desc: "Rich, dense, and irresistibly chocolatey with a perfect crinkly top and fudgy centre you'll crave again and again.",
    variants: ['Classic Fudgy', 'Choco Chip Loaded', 'Walnut Crunch', 'Brownie Bites Jar'],
  },
  {
    id: 'cakes',
    img: '/images/cake.png',
    alt: 'Marble Tea Cake by Batter and Bliss',
    tag: '✨ New Arrival',
    title: 'Dry Cakes ♡',
    desc: 'Soft, moist loaf cakes perfect for gifting or savoring with your evening chai. Classic • Simple • Soft.',
    variants: ['Marble Tea Cake', 'Chocolate Loaf', 'Banana Walnut', 'Dates & Nut'],
  },
  {
    id: 'hampers',
    img: '/images/hamper.png',
    alt: 'Batter and Bliss gift hamper',
    tag: '🎁 Perfect Gift',
    title: 'Gift Hampers ♡',
    desc: 'Thoughtfully curated for birthdays, anniversaries, or corporate gifting. Beautiful packaging, beautiful taste.',
    variants: ['Brownie Box (6 pcs)', 'Brownie + Bites Combo', 'Bakes & Treats Hamper', 'Custom Hampers'],
  },
]

export default function Menu() {
  useAnimateOnScroll()

  const scrollToOrder = () =>
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="menu" className="py-24 bg-gradient-to-b from-cream to-cream-light">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14" data-anim="fade-up">
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-rose mb-2">
            What We Offer
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-brown-dark leading-[1.2] mb-3">
            Our <span className="script text-rose text-[1.15em]">Sweet</span> Menu ♡
          </h2>
          <p className="text-brown-light text-base max-w-md mx-auto leading-relaxed">
            Every item is freshly baked after you order — never pre-made, never stored.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {products.map((p, i) => (
            <div
              key={p.id}
              data-anim="fade-up"
              data-delay={String(i * 100)}
              className="bg-white rounded-2xl overflow-hidden border border-rose/12
                         shadow-[0_4px_24px_rgba(44,26,14,0.08)]
                         hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(44,26,14,0.15)]
                         transition-all duration-350 flex flex-col group"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={p.img}
                  alt={p.alt}
                  className="w-full aspect-[4/3] object-cover
                             group-hover:scale-[1.07] transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-brown-dark/88 text-cream text-[0.7rem]
                                 font-medium px-3 py-1 rounded-full backdrop-blur-sm tracking-wide">
                  {p.tag}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-2.5 flex-1">
                <h3 className="font-serif text-xl font-semibold text-brown-dark">
                  {p.title}
                </h3>
                <p className="text-brown-light text-sm leading-[1.7]">{p.desc}</p>

                {/* Variants */}
                <div className="flex flex-wrap gap-1.5 my-1">
                  {p.variants.map(v => (
                    <span key={v}
                      className="text-[0.72rem] font-medium px-2.5 py-1 rounded-full
                                 bg-rose/10 border border-rose/25 text-brown-mid">
                      {v}
                    </span>
                  ))}
                </div>

                <button
                  onClick={scrollToOrder}
                  className="mt-auto self-start px-5 py-2 rounded-full text-sm font-medium
                             bg-rose-pale text-brown-dark border border-rose/20
                             hover:bg-rose hover:text-white hover:-translate-y-0.5
                             transition-all duration-250 cursor-pointer"
                >
                  Order Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
