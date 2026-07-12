const items = [
  '♡ Freshly Baked on Order', '✨ 100% Eggless', '🍫 Fudgy Brownies',
  '🎂 Marble Tea Cake', '🎁 Gift Hampers', '🌿 No Preservatives',
  '🚀 Same-Day Delivery', '🤍 Made with Love',
]

export default function Marquee() {
  const doubled = [...items, ...items]
  return (
    <div className="bg-brown-dark overflow-hidden py-3.5">
      <div className="marquee-track flex gap-10 w-max">
        {doubled.map((item, i) => (
          <span key={i} className="font-sans text-sm text-cream/90 tracking-wide shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
