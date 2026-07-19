import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate  = useNavigate()
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  /* Redirect if already logged in */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin', { replace: true })
    })
  }, [navigate])

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-light via-cream to-cream-mid
                    flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full
                      bg-[radial-gradient(circle,rgba(196,132,106,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-80 h-80 rounded-full
                      bg-[radial-gradient(circle,rgba(92,51,23,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <svg width="48" height="48" viewBox="0 0 42 42" fill="none" className="mx-auto mb-3">
            <ellipse cx="21" cy="35.5" rx="15" ry="2.2" stroke="#5C3317" strokeWidth="1.4"/>
            <rect x="13" y="32.5" width="16" height="3" rx="1.5" stroke="#5C3317" strokeWidth="1.4"/>
            <path d="M21 7C21 7 10.5 13 10.5 22.5C10.5 28.8 15.2 32.5 21 32.5C26.8 32.5 31.5 28.8 31.5 22.5C31.5 13 21 7 21 7Z"
              stroke="#5C3317" strokeWidth="1.4" fill="none"/>
            <path d="M19 5Q21 3 23 5" stroke="#C4846A" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <circle cx="21" cy="4" r="1.6" fill="#C4846A"/>
          </svg>
          <h1 className="font-serif text-2xl font-bold text-brown-dark">Batter &amp; Bliss</h1>
          <p className="text-brown-light text-sm mt-1">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(44,26,14,0.13)]
                        border border-rose/12 p-8">
          <h2 className="font-serif text-xl font-semibold text-brown-dark mb-6">
            Sign in
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email"
                className="block text-[0.7rem] font-semibold text-brown-mid tracking-widest uppercase mb-1.5">
                Email
              </label>
              <input
                id="email" type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-rose/25 bg-cream-light/50
                           text-brown-dark text-sm placeholder-brown-light/50
                           focus:outline-none focus:border-rose/60 focus:ring-2 focus:ring-rose/15
                           transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="password"
                className="block text-[0.7rem] font-semibold text-brown-mid tracking-widest uppercase mb-1.5">
                Password
              </label>
              <input
                id="password" type="password" required
                value={pass} onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-rose/25 bg-cream-light/50
                           text-brown-dark text-sm placeholder-brown-light/50
                           focus:outline-none focus:border-rose/60 focus:ring-2 focus:ring-rose/15
                           transition-all duration-200"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 px-3 py-2.5 rounded-xl border border-red-200">
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-brown-dark text-cream-light font-medium text-sm
                         shadow-[0_6px_24px_rgba(44,26,14,0.25)]
                         hover:bg-brown-mid hover:-translate-y-0.5 disabled:opacity-60
                         disabled:cursor-not-allowed transition-all duration-300 cursor-pointer
                         flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Signing in…
                </>
              ) : 'Sign in →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-brown-light/50 mt-5">
          🔒 Admin access only · Batter &amp; Bliss
        </p>
      </div>
    </div>
  )
}
