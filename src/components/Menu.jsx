import { Link, useNavigate } from 'react-router-dom'
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll'
import { useCart } from '../context/CartContext'

const highlights = [
  {
    id: 'walnut-brownie_500g',
    img: '/images/brownies.png',
    alt: 'Fudgy Brownies by Batter and Bliss',
    tag: '⭐ Bestseller',
    title: 'Fudgy Brownies',
    tagline: 'Dense, rich & irresistibly chocolatey',
    startingFrom: '₹550',
    itemData: { name: 'Walnut Brownie (500g)', price: 550, size: '500g', img: '/images/brownies.png' }
  },
  {
    id: 'marble-cake_500g',
    img: '/images/cake.png',
    alt: 'Tea Cakes by Batter and Bliss',
    tag: '☕ Fan Favourite',
    title: 'Tea Cakes',
    tagline: 'Soft loaf cakes, perfect with chai',
    startingFrom: '₹400',
    itemData: { name: 'Vanilla Tea Cake (500g)', price: 400, size: '500g', img: '/images/cake.png' }
  },
  {
    id: 'nutella-cake-jar_per jar',
    img: '/images/hamper.png',
    alt: 'Cake Jars by Batter and Bliss',
    tag: '🎁 Perfect Gift',
    title: 'Cake Jars',
    tagline: 'Layered jars — adorable & delicious',
    startingFrom: '₹250',
    itemData: { name: 'Chocolate Cake Jar (per jar)', price: 250, size: 'per jar', img: '/images/hamper.png' }
  },
]

export default function Menu() {
  useAnimateOnScroll()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  return (
    <section id="menu" className="pt-16 pb-8 bg-gradient-to-b from-cream to-cream-light">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14" data-anim="fade-up">
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-rose mb-2">
            What We Bake
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-brown-dark leading-[1.2] mb-3">
            A little taste of <span className="script text-rose text-[1.15em]">everything</span> ♡
          </h2>
          <p className="text-brown-light text-base max-w-sm mx-auto leading-relaxed">
            Freshly baked after every order — never pre-made, never stored.
          </p>
        </div>

        {/* Three hero tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" data-anim="fade-up" data-delay="100">
          {highlights.map((item, i) => (
            <div
              key={item.id}
              data-anim="fade-up"
              data-delay={String(i * 120)}
              className="relative rounded-3xl overflow-hidden group
                         shadow-[0_6px_30px_rgba(44,26,14,0.12)]
                         hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(44,26,14,0.2)]
                         transition-all duration-400 flex flex-col justify-between"
            >
              {/* Image */}
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/85 via-brown-dark/30 to-transparent" />

                {/* Tag badge */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brown-dark
                                 text-[0.65rem] font-semibold px-3 py-1 rounded-full tracking-wide shadow-sm">
                  {item.tag}
                </span>

                {/* Bottom text & quick add */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/75 text-xs leading-snug">
                      {item.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/15 mt-1">
                    <span className="text-white/90 text-xs font-medium">
                      Starting <span className="font-bold text-sm text-white">{item.startingFrom}</span>
                    </span>
                    <button
                      onClick={() => addToCart(item.id, item.itemData)}
                      className="px-3.5 py-1.5 rounded-full bg-white text-brown-dark font-semibold text-xs
                                 hover:bg-rose hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      + Add to Basket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View full menu CTA */}
        <div className="text-center mt-12" data-anim="fade-up" data-delay="400">
          <p className="text-brown-light text-sm mb-4">
            Explore 25+ freshly baked items — Tea Cakes, Guilt-Free bakes, Brownies & Cake Jars.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full
                       bg-brown-dark text-cream-light font-medium text-sm shadow-md
                       hover:bg-brown-mid hover:-translate-y-0.5
                       transition-all duration-250"
          >
            Explore Full Menu 📋
          </Link>
        </div>

      </div>
    </section>
  )
}
