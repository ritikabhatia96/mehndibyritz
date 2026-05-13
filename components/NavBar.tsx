'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

interface NavBarProps {
  username: string
  displayName: string
  role: 'admin' | 'customer'
}

export default function NavBar({ username, displayName, role }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  function navClass(href: string) {
    const isActive = pathname === href || pathname.startsWith(href + '/')
    return isActive
      ? 'text-henna-500 font-bold text-sm border-b-2 border-henna-500 pb-0.5 transition-colors'
      : 'text-sage-600 hover:text-sage-500 font-medium text-sm transition-colors'
  }

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <nav className="bg-cream-50 border-b border-sage-200 sticky top-0 z-40 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center h-20">
          {/* Desktop nav links - left */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            <Link href="/dashboard" className={navClass('/dashboard')}>
              Browse Boards
            </Link>
            <Link href="/my-folder" className={navClass('/my-folder')}>
              My Board
            </Link>
            {role === 'admin' && (
              <Link href="/admin" className={navClass('/admin')}>
                Admin
              </Link>
            )}
          </div>

          {/* Logo - center */}
          <Link href="/dashboard" className="absolute left-1/2 -translate-x-1/2 flex-shrink-0 flex items-center gap-3">
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 14.5C9 14.5 1 9.5 1 4.5C1 2.5 2.5 1 4.5 1C6 1 7.5 2 9 3.5C10.5 2 12 1 13.5 1C15.5 1 17 2.5 17 4.5C17 9.5 9 14.5 9 14.5Z" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-script), cursive', fontSize: '3.2rem', color: '#8B4513', letterSpacing: '0.05em', WebkitTextStroke: '0.3px #8B4513' }}>
              mehndibyritz
            </span>
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 14.5C9 14.5 1 9.5 1 4.5C1 2.5 2.5 1 4.5 1C6 1 7.5 2 9 3.5C10.5 2 12 1 13.5 1C15.5 1 17 2.5 17 4.5C17 9.5 9 14.5 9 14.5Z" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Desktop user info + sign out - right */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
            <a
              href="https://www.instagram.com/mehndibyritz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-500 hover:text-blush-400 transition-colors"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <span className="text-sm text-sage-500">
              Hello, <span className="font-semibold text-sage-600">{displayName}</span>
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm bg-sage-100 hover:bg-sage-200 text-sage-700 px-4 py-1.5 rounded-full transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-sage-600 hover:bg-sage-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cream-50 border-t border-sage-100 px-4 pb-4 pt-2 space-y-2">
          <div className="text-sm text-sage-500 py-2 border-b border-sage-100 mb-2">
            Hello, <span className="font-semibold text-sage-600">{displayName}</span>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={`block py-2 ${pathname === '/dashboard' ? 'text-henna-500 font-bold' : 'text-sage-600 font-medium'}`}
          >
            Browse Boards
          </Link>
          <Link
            href="/my-folder"
            onClick={() => setMobileOpen(false)}
            className={`block py-2 ${pathname === '/my-folder' ? 'text-henna-500 font-bold' : 'text-sage-600 font-medium'}`}
          >
            My Board
          </Link>
          {role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={`block py-2 ${pathname === '/admin' ? 'font-bold' : 'font-medium'} text-henna-500`}
            >
              Admin
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="block w-full text-left py-2 text-sage-600 font-medium border-t border-sage-100 mt-2 pt-3"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  )
}
