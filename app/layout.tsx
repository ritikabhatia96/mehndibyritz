import type { Metadata } from 'next'
import { Playfair_Display, Inter, Corinthia } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const corinthia = Corinthia({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mehndibyritz — Inspiration Portal',
  description: 'Share and browse mehndi inspiration photos with Ritika',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${corinthia.variable}`}>
      <body className="bg-cream-100 text-gray-800 antialiased min-h-screen font-inter">
        {children}
      </body>
    </html>
  )
}
