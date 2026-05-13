'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Sign in failed. Please try again.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background SVG — mandala-inspired floral */}
      <div className="absolute -bottom-16 -right-16 opacity-10 pointer-events-none select-none">
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer ring petals */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 200 200)`}>
              <ellipse cx="200" cy="110" rx="18" ry="55" fill="#638c59" />
            </g>
          ))}
          {/* Middle ring */}
          {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 200 200)`}>
              <ellipse cx="200" cy="135" rx="12" ry="35" fill="#f4b4bf" />
            </g>
          ))}
          {/* Inner ring */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 200 200)`}>
              <ellipse cx="200" cy="158" rx="8" ry="22" fill="#8B4513" />
            </g>
          ))}
          {/* Center circle */}
          <circle cx="200" cy="200" r="22" fill="#638c59" />
          <circle cx="200" cy="200" r="14" fill="#fdf8f0" />
          <circle cx="200" cy="200" r="7" fill="#8B4513" />
        </svg>
      </div>

      {/* Top-left decorative element */}
      <div className="absolute -top-12 -left-12 opacity-10 pointer-events-none select-none">
        <svg width="250" height="250" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 125 125)`}>
              <ellipse cx="125" cy="65" rx="12" ry="40" fill="#f4b4bf" />
            </g>
          ))}
          <circle cx="125" cy="125" r="18" fill="#638c59" />
          <circle cx="125" cy="125" r="8" fill="#fdf8f0" />
        </svg>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl shadow-sage-200/40 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: 'var(--font-script), cursive', fontSize: '5rem', color: '#8B4513', letterSpacing: '0.05em', WebkitTextStroke: '0.3px #8B4513' }} className="mb-2">
            mehndibyritz
          </h1>
          <p className="text-sage-500 text-sm font-medium tracking-widest uppercase">
            Inspiration Portal
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blush-300 to-transparent" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-sage-600 mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent bg-cream-50 text-gray-800 placeholder-sage-300 transition-shadow"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-sage-600 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent bg-cream-50 text-gray-800 placeholder-sage-300 transition-shadow"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-blush-50 border border-blush-200 text-blush-500 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-sage-500 hover:bg-sage-600 disabled:bg-sage-300 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-sage-300/50 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-sage-300 mt-6">
          Need an account? Contact your henna artist.
        </p>
      </div>
    </div>
  )
}
