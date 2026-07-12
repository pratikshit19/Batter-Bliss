import { useEffect, useRef } from 'react'

export default function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => ref.current?.classList.remove('opacity-0', 'translate-y-6'), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden
                 bg-gradient-to-br from-cream-light via-cream to-cream-mid"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full
                      bg-[radial-gradient(circle,rgba(196,132,106,0.18)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full
                      bg-[radial-gradient(circle,rgba(184,134,11,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Main grid */}
      <div
        ref={ref}
        className="max-w-6xl mx-auto px-6 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2
                   items-center gap-12 opacity-0 translate-y-6 transition-all duration-900 ease-out"
      >
        {/* Content */}
        <div className="flex flex-col items-start lg:items-start text-center lg:text-left">
          <span className="mb-5 inline-block text-xs font-medium tracking-widest text-brown-light
                           bg-rose/10 border border-rose/25 px-4 py-2 rounded-full uppercase">
            ✨ 100% Eggless &nbsp;•&nbsp; No Preservatives &nbsp;•&nbsp; Delhi NCR
          </span>

          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-brown-dark leading-[1.12] mb-5">
            We Bake{' '}
            <span className="script text-rose text-[1.2em]">Happiness</span>
            <br />in Every Bite. ♡
          </h1>

          <p className="text-brown-light text-lg leading-relaxed max-w-md mb-8">
            Homemade bakes, thoughtfully crafted for every celebration and everyday craving.
            Freshly made just for you.
          </p>

          <div className="flex gap-3 flex-wrap mb-7 justify-center lg:justify-start">
            <a
              href="#order"
              id="hero-order-btn"
              className="px-7 py-3.5 rounded-full bg-brown-dark text-cream-light font-medium text-sm
                         shadow-[0_6px_24px_rgba(44,26,14,0.28)] hover:bg-brown-mid hover:-translate-y-1
                         transition-all duration-300"
            >
              Order Now
            </a>
            <a
              href="#menu"
              className="px-7 py-3.5 rounded-full border-1.5 border-brown-mid text-brown-dark font-medium text-sm
                         hover:bg-cream-mid hover:-translate-y-1 transition-all duration-300"
            >
              Explore Menu
            </a>
          </div>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {['🍫 Fudgy Brownies', '🎂 Dry Cakes', '🎁 Gift Hampers'].map(b => (
              <span key={b} className="text-xs font-medium px-3.5 py-1.5 rounded-full text-brown-mid
                                       bg-white/70 border border-rose/25 backdrop-blur-sm">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center order-first lg:order-last">
          <div className="relative">
            <div className="morph-blob w-[340px] h-[340px] md:w-[420px] md:h-[420px]
                            overflow-hidden shadow-[0_28px_80px_rgba(44,26,14,0.2)]">
              <img
                src="/images/hero.png"
                alt="Artisan brownies and bakes by Batter and Bliss"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-600"
                loading="eager"
              />
            </div>

            {/* Float card 1 */}
            <div className="float-anim absolute -bottom-4 -left-6 flex items-center gap-2.5
                            bg-cream-light/90 backdrop-blur-md border border-rose/20 rounded-2xl
                            px-3.5 py-2.5 shadow-[0_8px_24px_rgba(44,26,14,0.13)]">
              <span className="text-2xl">🚀</span>
              <div className="flex flex-col leading-snug">
                <strong className="text-xs text-brown-dark font-semibold">Same-Day Delivery</strong>
                <span className="text-[0.68rem] text-brown-light">Delhi NCR</span>
              </div>
            </div>

            {/* Float card 2 */}
            <div className="float-anim float-delay absolute -top-3 -right-6 flex items-center gap-2.5
                            bg-cream-light/90 backdrop-blur-md border border-rose/20 rounded-2xl
                            px-3.5 py-2.5 shadow-[0_8px_24px_rgba(44,26,14,0.13)]">
              <span className="text-2xl">💯</span>
              <div className="flex flex-col leading-snug">
                <strong className="text-xs text-brown-dark font-semibold">100% Eggless</strong>
                <span className="text-[0.68rem] text-brown-light">Always fresh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hidden lg:flex">
        <span className="text-[0.68rem] uppercase tracking-widest text-brown-mid">Scroll to explore</span>
        <div className="w-px h-10 bg-gradient-to-b from-brown-mid to-transparent scroll-pulse" />
      </div>
    </section>
  )
}
