'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

interface NavBarProps {
  username: string
  displayName: string
  role: 'admin' | 'customer'
}

export default function NavBar({ username, displayName, role }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hasNewUploads, setHasNewUploads] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (role !== 'admin') return

    async function checkActivity() {
      try {
        const res = await fetch('/api/admin/activity', { cache: 'no-store' })
        if (!res.ok) return
        const { latestUploadAt } = await res.json()
        if (!latestUploadAt) return
        const lastVisit = localStorage.getItem('adminBoardsLastVisit')
        if (!lastVisit || new Date(latestUploadAt) > new Date(lastVisit)) {
          setHasNewUploads(true)
        }
      } catch {}
    }

    checkActivity()
    const interval = setInterval(checkActivity, 30000)

    function onVisited() { setHasNewUploads(false) }
    window.addEventListener('adminBoardsVisited', onVisited)
    return () => {
      clearInterval(interval)
      window.removeEventListener('adminBoardsVisited', onVisited)
    }
  }, [role])

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  function navLinkClass(href: string) {
    return isActive(href)
      ? 'relative text-henna-500 font-semibold text-sm transition-colors'
      : 'relative text-sage-500 hover:text-sage-700 font-medium text-sm transition-colors'
  }

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <nav
      className="sticky top-0 z-50 overflow-visible transition-shadow duration-300"
      style={{
        background: 'rgba(253, 248, 240, 0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(99, 140, 89, 0.12)',
        boxShadow: scrolled
          ? '0 4px 24px rgba(139, 69, 19, 0.07), 0 1px 0 rgba(99,140,89,0.08)'
          : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center h-[4.5rem]">

          {/* Desktop nav links — left */}
          <div className="hidden md:flex items-center gap-7 flex-1">
            <Link href="/my-folder" className={navLinkClass('/my-folder')}>
              My Board
              {isActive('/my-folder') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-henna-500/70" />
              )}
            </Link>
            <Link href="/community" className={navLinkClass('/community')}>
              Community
              {isActive('/community') && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-henna-500/70" />
              )}
            </Link>
            {role === 'admin' && (
              <Link href="/dashboard" className={`relative ${navLinkClass('/dashboard')}`}>
                Client Boards
                {isActive('/dashboard') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-henna-500/70" />
                )}
                {hasNewUploads && (
                  <span className="absolute -top-1.5 -right-3 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full ring-2 ring-white" style={{ background: '#e07070' }} />
                  </span>
                )}
              </Link>
            )}
            {role === 'admin' && (
              <Link href="/admin" className={navLinkClass('/admin')}>
                Admin
                {isActive('/admin') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-henna-500/70" />
                )}
              </Link>
            )}
          </div>

          {/* Logo — center */}
          <Link
            href="/my-folder"
            className="absolute left-1/2 -translate-x-1/2 flex-shrink-0 flex items-center gap-2.5 group"
          >
            <svg width="16" height="14" viewBox="0 0 18 16" fill="none" className="opacity-70 group-hover:opacity-100 transition-opacity">
              <path d="M9 14.5C9 14.5 1 9.5 1 4.5C1 2.5 2.5 1 4.5 1C6 1 7.5 2 9 3.5C10.5 2 12 1 13.5 1C15.5 1 17 2.5 17 4.5C17 9.5 9 14.5 9 14.5Z" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: 'var(--font-script), cursive',
              fontSize: '2.8rem',
              color: '#8B4513',
              letterSpacing: '0.04em',
              WebkitTextStroke: '0.3px #8B4513',
              lineHeight: 1,
            }}>
              mehndibyritz
            </span>
            <svg width="16" height="14" viewBox="0 0 18 16" fill="none" className="opacity-70 group-hover:opacity-100 transition-opacity">
              <path d="M9 14.5C9 14.5 1 9.5 1 4.5C1 2.5 2.5 1 4.5 1C6 1 7.5 2 9 3.5C10.5 2 12 1 13.5 1C15.5 1 17 2.5 17 4.5C17 9.5 9 14.5 9 14.5Z" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Desktop — right side */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
            <a
              href="https://www.instagram.com/mehndibyritz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-400 hover:text-blush-400 transition-colors"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <span className="text-xs text-sage-400 font-medium">
              {displayName}
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-150"
              style={{
                background: 'rgba(99,140,89,0.08)',
                color: '#638c59',
                border: '1px solid rgba(99,140,89,0.18)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,140,89,0.16)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,140,89,0.08)'
              }}
            >
              Sign out
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-sage-500 hover:bg-sage-100/60 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-5 pb-5 pt-3 space-y-1"
          style={{
            background: 'rgba(253, 248, 240, 0.97)',
            borderTop: '1px solid rgba(99,140,89,0.10)',
          }}
        >
          <p className="text-xs text-sage-400 font-medium pb-3 border-b border-sage-100 mb-2">
            Signed in as <span className="text-sage-600 font-semibold">{displayName}</span>
          </p>
          {[
            { href: '/my-folder', label: 'My Board' },
            { href: '/community', label: 'Community' },
            ...(role === 'admin' ? [
              { href: '/dashboard', label: 'Client Boards' },
              { href: '/admin', label: 'Admin' },
            ] : []),
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between py-2.5 px-1 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'text-henna-500'
                  : 'text-sage-600 hover:text-sage-800'
              }`}
            >
              {label}
              {isActive(href) && (
                <span className="w-1.5 h-1.5 rounded-full bg-henna-500" />
              )}
              {label === 'Client Boards' && hasNewUploads && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#e07070' }} />
              )}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="w-full text-left py-2.5 px-1 text-sm font-medium text-sage-400 hover:text-sage-600 transition-colors border-t border-sage-100 mt-2 pt-3"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}
