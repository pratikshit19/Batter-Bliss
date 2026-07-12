export default function Footer() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer id="contact" className="bg-brown-dark text-cream pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="34" height="34" viewBox="0 0 42 42" fill="none">
                <ellipse cx="21" cy="35.5" rx="15" ry="2.2" stroke="#F5EBD8" strokeWidth="1.4"/>
                <rect x="13" y="32.5" width="16" height="3" rx="1.5" stroke="#F5EBD8" strokeWidth="1.4"/>
                <path d="M21 7C21 7 10.5 13 10.5 22.5C10.5 28.8 15.2 32.5 21 32.5C26.8 32.5 31.5 28.8 31.5 22.5C31.5 13 21 7 21 7Z"
                  stroke="#F5EBD8" strokeWidth="1.4" fill="none"/>
                <path d="M19 5Q21 3 23 5" stroke="#C4846A" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                <circle cx="21" cy="4" r="1.6" fill="#C4846A"/>
              </svg>
              <span className="flex flex-col leading-none gap-0.5">
                <span className="font-serif text-[0.95rem] font-bold text-cream tracking-wide">Batter</span>
                <span className="script text-[0.85rem] text-rose leading-none">&amp;</span>
                <span className="font-serif text-[0.95rem] font-bold text-cream tracking-wide">Bliss</span>
              </span>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed mb-5">
              Homemade bakes, thoughtfully made for every celebration and everyday craving.
            </p>
            {/* Instagram */}
            <a
              id="footer-instagram"
              href="https://instagram.com/batterandbliss.bakery"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8
                         border border-white/15 text-cream/80 text-sm hover:bg-white/15
                         hover:text-cream transition-all duration-250"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @batterandbliss.bakery
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif font-semibold text-cream mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Home',          id: 'home' },
                { label: 'Our Story',     id: 'about' },
                { label: 'Menu',          id: 'menu' },
                { label: 'Why Us',        id: 'why-us' },
                { label: 'Place an Order',id: 'order' },
              ].map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-cream/55 text-sm hover:text-rose transition-colors duration-200 cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Bakes */}
          <div>
            <h4 className="font-serif font-semibold text-cream mb-4">Our Bakes</h4>
            <ul className="flex flex-col gap-2.5">
              {['Fudgy Brownies', 'Dry Cakes', 'Gift Hampers', 'Brownie Bites', 'Custom Orders'].map(item => (
                <li key={item}>
                  <button
                    onClick={() => scrollTo('order')}
                    className="text-cream/55 text-sm hover:text-rose transition-colors duration-200 cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-cream mb-4">Contact</h4>
            <ul className="flex flex-col gap-2.5 text-cream/55 text-sm">
              <li>📍 Delhi NCR</li>
              <li>🚀 Same-Day Delivery</li>
              <li>
                <a
                  href="https://instagram.com/batterandbliss.bakery"
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-rose transition-colors duration-200"
                >
                  📸 Instagram DM
                </a>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('order')}
                  className="hover:text-rose transition-colors duration-200 cursor-pointer"
                >
                  📝 Order Form
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row
                        justify-between items-center gap-3 text-center">
          <p className="text-cream/40 text-xs">© 2025 Batter &amp; Bliss. Made with ♡ in Delhi NCR.</p>
          <p className="text-cream/30 text-xs">All bakes are 100% eggless &amp; made fresh on every order.</p>
        </div>
      </div>
    </footer>
  )
}
