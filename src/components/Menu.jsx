import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll'

const highlights = [
  {
    id: 'brownies',
    img: '/images/brownies.png',
    alt: 'Fudgy Brownies by Batter and Bliss',
    tag: '⭐ Bestseller',
    title: 'Fudgy Brownies',
    tagline: 'Dense, rich & irresistibly chocolatey',
    startingFrom: '₹550',
  },
  {
    id: 'tea-cakes',
    img: '/images/cake.png',
    alt: 'Tea Cakes by Batter and Bliss',
    tag: '☕ Fan Favourite',
    title: 'Tea Cakes',
    tagline: 'Soft loaf cakes, perfect with chai',
    startingFrom: '₹400',
  },
  {
    id: 'cake-jars',
    img: '/images/hamper.png',
    alt: 'Cake Jars by Batter and Bliss',
    tag: '🎁 Perfect Gift',
    title: 'Cake Jars',
    tagline: 'Layered jars — adorable & delicious',
    startingFrom: '₹250',
  },
]

export default function Menu() {
  useAnimateOnScroll()

  const scrollToOrder = () =>
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="menu" className="py-24 bg-gradient-to-b from-cream to-cream-light">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" data-anim="fade-up" data-delay="100">
          {highlights.map((item, i) => (
            <div
              key={item.id}
              data-anim="fade-up"
              data-delay={String(i * 120)}
              onClick={scrollToOrder}
              className="relative rounded-3xl overflow-hidden cursor-pointer group
                         shadow-[0_6px_30px_rgba(44,26,14,0.12)]
                         hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(44,26,14,0.2)]
                         transition-all duration-400"
            >
              {/* Image */}
              <img
                src={item.img}
                alt={item.alt}
                className="w-full aspect-[3/4] object-cover group-hover:scale-[1.06] transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/80 via-brown-dark/20 to-transparent" />

              {/* Tag badge */}
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brown-dark
                               text-[0.65rem] font-semibold px-3 py-1 rounded-full tracking-wide shadow-sm">
                {item.tag}
              </span>

              {/* Bottom text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-serif text-xl font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-white/75 text-xs leading-snug mb-3">
                  {item.tagline}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-xs font-medium">
                    Starting <span className="font-bold text-sm text-white">{item.startingFrom}</span>
                  </span>
                  <span className="text-[0.7rem] font-semibold text-white/80
                                   group-hover:text-white transition-colors duration-200">
                    Order →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View full menu CTA */}
        <div className="text-center mt-10" data-anim="fade-up" data-delay="400">
          <p className="text-brown-light text-sm mb-4">
            And much more — Tea Cakes, Guilt-Free bakes, Brownies & Cake Jars.
          </p>
          <a
            href="/menu"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full
                       border border-brown-dark/25 text-brown-dark text-sm font-medium
                       hover:bg-brown-dark hover:text-cream-light hover:border-brown-dark
                       transition-all duration-250"
          >
            View Full Menu 📋
          </a>
        </div>

      </div>
    </section>
  )
}
