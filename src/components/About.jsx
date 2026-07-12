import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll'

export default function About() {
  useAnimateOnScroll()

  return (
    <section id="about" className="bg-cream-light py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">

          {/* Image */}
          <div className="relative group" data-anim="fade-right">
            <img
              src="/images/about.png"
              alt="Packing a Batter and Bliss gift hamper with love"
              className="w-full rounded-3xl object-cover aspect-[4/5]
                         shadow-[0_28px_60px_rgba(44,26,14,0.15)]
                         group-hover:scale-[1.015] transition-transform duration-500"
              loading="lazy"
            />
            {/* Badge overlay */}
            <div className="absolute -bottom-5 -right-4 bg-brown-dark rounded-2xl
                            px-5 py-4 text-center shadow-[0_8px_24px_rgba(44,26,14,0.22)]">
              <p className="script text-cream text-2xl leading-none">Made with</p>
              <p className="script text-rose text-3xl">Love ♡</p>
            </div>
          </div>

          {/* Content */}
          <div data-anim="fade-left">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-rose mb-2">
              Our Story
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-brown-dark leading-[1.2] mb-5">
              Good Bakes.<br />
              <em className="script not-italic text-rose text-[1.15em]">Happy Hearts.</em><br />
              Every Single Time.
            </h2>
            <p className="text-brown-light text-base leading-[1.85] mb-4">
              Batter &amp; Bliss started with a simple idea — that everyone deserves a treat
              that feels homemade, honest, and full of heart. We bake every order fresh,
              using only premium ingredients, with zero compromises on taste or quality.
            </p>
            <p className="text-brown-light text-base leading-[1.85] mb-8">
              Whether it's a birthday, a celebration, or just a Tuesday that needs sweetening —
              we've got you covered with bakes that hit different. ♡
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 bg-rose/8 border border-rose/20
                            rounded-2xl px-6 py-5">
              {[
                { num: '100%', label: 'Eggless' },
                null,
                { num: '0',   label: 'Preservatives' },
                null,
                { num: '∞',   label: 'Love Added' },
              ].map((item, i) =>
                item === null ? (
                  <div key={i} className="w-px h-10 bg-rose/30 shrink-0" />
                ) : (
                  <div key={i} className="flex flex-col items-center flex-1 gap-0.5">
                    <span className="font-serif text-3xl font-bold text-brown-dark leading-none">
                      {item.num}
                    </span>
                    <span className="text-[0.72rem] text-brown-light uppercase tracking-wide text-center">
                      {item.label}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
