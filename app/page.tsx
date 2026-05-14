import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-between py-6 px-4">

      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <p className="text-sage-400 tracking-widest uppercase text-xs font-medium mb-2">Welcome to</p>
        <h1 style={{ fontFamily: 'var(--font-script), cursive', fontSize: '5rem', color: '#8B4513', lineHeight: 1.1, WebkitTextStroke: '0.3px #8B4513' }}>
          mehndibyritz
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-16 h-px bg-blush-300" />
          <svg width="16" height="14" viewBox="0 0 18 16" fill="none">
            <path d="M9 14.5C9 14.5 1 9.5 1 4.5C1 2.5 2.5 1 4.5 1C6 1 7.5 2 9 3.5C10.5 2 12 1 13.5 1C15.5 1 17 2.5 17 4.5C17 9.5 9 14.5 9 14.5Z" stroke="#f4b4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="w-16 h-px bg-blush-300" />
        </div>
      </section>

      {/* About */}
      <section className="w-full max-w-3xl">
        <div className="bg-white rounded-3xl shadow-sm border border-sage-100 px-5 py-5 flex flex-col sm:flex-row items-center gap-5">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-28 h-28 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-blush-200 shadow-md">
              <Image
                src="/ritika.jpeg"
                alt="Ritika"
                width={192}
                height={192}
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 25%' }}
              />
            </div>
          </div>
          {/* Text */}
          <div className="text-center sm:text-left">
            <p className="text-gray-600 leading-relaxed mb-3 text-sm">
              Welcome! I&apos;m Ritika, a mehndi artist passionate about creating beautiful, intricate designs for every occasion. Whether you&apos;re celebrating a wedding, a festival, or simply treating yourself, I bring your vision to life with care and creativity.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Browse my work on Instagram or log in to your client portal to share inspiration photos and notes for your next appointment.
            </p>
          </div>
        </div>
      </section>

      {/* Instagram + Login */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="https://www.instagram.com/mehndibyritz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-blush-300 text-blush-500 hover:bg-blush-50 transition-colors font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
          </svg>
          @mehndibyritz
        </a>
        <Link
          href="/login"
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-sage-500 hover:bg-sage-600 text-white transition-colors font-medium"
        >
          Client Portal
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-sage-300 text-xs">
        © {new Date().getFullYear()} mehndibyritz · All rights reserved
      </footer>

    </div>
  )
}
