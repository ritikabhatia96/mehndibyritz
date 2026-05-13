'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageCard from '@/components/ImageCard'
import ImageLightbox from '@/components/ImageLightbox'
import type { Upload } from '@/types'

interface FolderData {
  user: { username: string; display_name: string }
  uploads: Upload[]
}

export default function FolderPage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [data, setData] = useState<FolderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Check if this is the current user's own folder
        const meRes = await fetch('/api/auth/me')
        if (meRes.ok) {
          const meData = await meRes.json()
          setCurrentUser(meData.username)
          setCurrentUserRole(meData.role)
          // Redirect to /my-folder if viewing own folder
          if (meData.username === username) {
            router.replace('/my-folder')
            return
          }
        }

        const res = await fetch(`/api/folders/${username}`)
        if (res.status === 404) {
          setError('This board does not exist.')
          return
        }
        if (!res.ok) {
          setError('Failed to load this board.')
          return
        }

        const json = await res.json()
        setData(json)
      } catch {
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [username, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-sage-300 border-t-sage-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sage-400">Loading board...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-blush-500 font-medium mb-4">{error}</p>
          <Link
            href="/dashboard"
            className="text-sage-500 hover:text-sage-600 underline text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Simple top bar without NavBar (client component doesn't have session easily) */}
      <nav className="bg-cream-50 border-b border-sage-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="font-script text-3xl text-henna-500 tracking-wide">
              Mehndibyritz
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sage-600 hover:text-sage-500 text-sm font-medium">
                Browse Boards
              </Link>
              <Link href="/my-folder" className="text-sage-600 hover:text-sage-500 text-sm font-medium">
                My Board
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sage-500 hover:text-sage-600 text-sm font-medium mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Boards
          </Link>
          <h1 className="font-playfair text-4xl font-bold text-henna-500 mb-1">
            {data.user.display_name}&apos;s Board
          </h1>
          <p className="text-sage-400 text-sm">@{data.user.username}</p>
        </div>

        {/* Uploads grid */}
        {data.uploads.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-sage-200 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sage-400 font-medium">No uploads yet on this board</p>
          </div>
        ) : (
          <>
            <p className="text-sage-400 text-sm mb-6">
              {data.uploads.length} {data.uploads.length === 1 ? 'photo' : 'photos'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.uploads.map((upload) => (
                <ImageCard
                  key={upload.id}
                  upload={upload}
                  onImageClick={setSelectedUpload}
                  showComments={currentUserRole === 'admin'}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <ImageLightbox upload={selectedUpload} onClose={() => setSelectedUpload(null)} showComments={currentUserRole === 'admin'} />
    </div>
  )
}
