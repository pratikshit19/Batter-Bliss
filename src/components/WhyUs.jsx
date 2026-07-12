import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll'

const features = [
  { icon: '🌿', title: 'Gluten Free Options',      desc: 'We offer gluten-free alternatives so everyone can enjoy our bakes without worry.' },
  { icon: '🍳', title: 'Freshly Baked on Order',   desc: 'We bake only after you order — never pre-made, never stored. Maximum freshness.' },
  { icon: '🌾', title: 'Premium Ingredients',      desc: 'We source only the finest cocoa, butter, and flour. Quality you can taste in every bite.' },
  { icon: '🎁', title: 'Beautiful Packaging',      desc: 'Every order is lovingly packaged — perfect for gifting or treating yourself.' },
  { icon: '🚀', title: 'Same-Day Delivery',        desc: 'Need it today? We deliver across Delhi NCR for last-minute gifting emergencies!' },
  { icon: '💖', title: 'Made with Heart',          desc: 'Every bake carries our love and passion. Not just food — a feeling in every bite.' },
]

export default function WhyUs() {
  useAnimateOnScroll()

  return (
    <section id="why-us" className="py-24 bg-cream-light">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14" data-anim="fade-up">
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-rose mb-2">
            Made for Everyone
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-brown-dark leading-[1.2]">
            Why <span className="script text-rose text-[1.15em]">Batter &amp; Bliss?</span> ♡
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-anim="fade-up"
              data-delay={String(i * 80)}
              className="group bg-white rounded-2xl p-7 border border-rose/12
                         shadow-[0_4px_20px_rgba(44,26,14,0.06)]
                         hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(44,26,14,0.12)]
                         hover:border-rose/25 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose/10 flex items-center justify-center
                              text-2xl mb-4 group-hover:bg-rose/18 transition-colors duration-300">
                {f.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-brown-dark mb-2">
                {f.title}
              </h3>
              <p className="text-brown-light text-sm leading-[1.75]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
