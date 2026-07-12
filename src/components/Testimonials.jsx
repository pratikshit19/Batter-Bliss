import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll'

const reviews = [
  {
    name: 'Ritu M.',
    location: 'Dwarka, Delhi',
    avatar: 'R',
    text: '"The brownies are absolutely to die for! Fudgy, rich, and you can taste they\'re made with so much love. Ordered for my daughter\'s birthday and everyone was asking for seconds."',
    featured: false,
  },
  {
    name: 'Shivani K.',
    location: 'Noida',
    avatar: 'S',
    text: '"Got the Marble Tea Cake for my parents\' anniversary. They were blown away! Packaging was gorgeous, delivery on time, and the cake was so moist. Definitely ordering again!"',
    featured: true,
  },
  {
    name: 'Ananya P.',
    location: 'Gurgaon',
    avatar: 'A',
    text: '"Best eggless brownies I\'ve ever had. I\'ve been searching for months — finally found my go-to! The brownie bites jar is dangerously addictive. 10/10 recommend."',
    featured: false,
  },
]

export default function Testimonials() {
  useAnimateOnScroll()

  return (
    <section id="testimonials" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14" data-anim="fade-up">
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-rose mb-2">
            Sweet Words
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-brown-dark leading-[1.2]">
            What our <span className="script text-rose text-[1.15em]">customers</span> say ♡
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={r.name}
              data-anim="fade-up"
              data-delay={String(i * 100)}
              className={`rounded-2xl p-7 flex flex-col gap-4 border transition-all duration-300
                          hover:-translate-y-1.5 ${
                r.featured
                  ? 'bg-brown-dark border-brown-dark shadow-[0_16px_48px_rgba(44,26,14,0.2)]'
                  : 'bg-white border-rose/12 shadow-[0_4px_20px_rgba(44,26,14,0.07)]'
              }`}
            >
              <p className="text-yellow-500 text-sm tracking-wide">★★★★★</p>
              <p className={`text-sm leading-[1.8] flex-1 ${r.featured ? 'text-cream' : 'text-brown-light'}`}>
                {r.text}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                font-serif font-bold text-lg ${
                  r.featured ? 'bg-rose text-white' : 'bg-rose/15 text-rose'
                }`}>
                  {r.avatar}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${r.featured ? 'text-cream-light' : 'text-brown-dark'}`}>
                    {r.name}
                  </p>
                  <p className={`text-xs ${r.featured ? 'text-cream/60' : 'text-brown-light'}`}>
                    {r.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
