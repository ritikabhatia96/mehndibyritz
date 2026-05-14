'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import NavBar from '@/components/NavBar'
import ImageLightbox from '@/components/ImageLightbox'
import type { Upload } from '@/types'

interface SessionUser {
  id: string
  username: string
  displayName: string
  role: 'admin' | 'customer'
}

interface CommunityUpload {
  id: string
  user_id: string
  image_path: string
  image_url: string
  created_at: string
  uploader_name: string
  uploader_username: string
}

export default function CommunityPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [uploads, setUploads] = useState<CommunityUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [meRes, communityRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/community'),
        ])
        if (meRes.ok) setUser(await meRes.json())
        if (communityRes.ok) {
          const data = await communityRes.json()
          setUploads(data.uploads || [])
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSave(uploadId: string) {
    setSaving((prev) => ({ ...prev, [uploadId]: true }))
    setErrors((prev) => ({ ...prev, [uploadId]: '' }))
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId }),
      })
      if (res.ok) {
        setSaved((prev) => ({ ...prev, [uploadId]: true }))
      } else {
        const data = await res.json()
        setErrors((prev) => ({ ...prev, [uploadId]: data.error || 'Failed to save' }))
      }
    } catch {
      setErrors((prev) => ({ ...prev, [uploadId]: 'Network error' }))
    } finally {
      setSaving((prev) => ({ ...prev, [uploadId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-sage-300 border-t-sage-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sage-400">Loading community board...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {user && (
        <NavBar
          username={user.username}
          displayName={user.displayName}
          role={user.role}
        />
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-henna-500 mb-1">
            Community Board
          </h1>
          <p className="text-sage-400 text-sm">
            Browse everyone&apos;s inspo — tap <span className="font-semibold">+</span> to save any photo to your own board
          </p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-sage-200" />
          <svg width="72" height="32" viewBox="0 0 72 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* left dots */}
            <circle cx="10" cy="16" r="2" fill="#638c59" opacity="0.4"/>
            <circle cx="18" cy="16" r="2.5" fill="#638c59" opacity="0.55"/>
            <circle cx="27" cy="16" r="2" fill="#638c59" opacity="0.4"/>
            {/* right dots */}
            <circle cx="62" cy="16" r="2" fill="#638c59" opacity="0.4"/>
            <circle cx="54" cy="16" r="2.5" fill="#638c59" opacity="0.55"/>
            <circle cx="45" cy="16" r="2" fill="#638c59" opacity="0.4"/>
            {/* flower petals */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <g key={i} transform={`rotate(${angle} 36 16)`}>
                <ellipse cx="36" cy="9" rx="3.5" ry="6" fill="#f4b4bf" opacity="0.85"/>
              </g>
            ))}
            <circle cx="36" cy="16" r="4" fill="#8B4513" opacity="0.75"/>
            <circle cx="36" cy="16" r="2" fill="#fdf8f0"/>
          </svg>
          <div className="flex-1 h-px bg-sage-200" />
        </div>

        {uploads.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sage-400 font-medium text-lg mb-1">Nothing here yet</p>
            <p className="text-sage-300 text-sm">Be the first to upload some inspo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploads.map((upload) => {
              const isOwn = upload.user_id === user?.id
              const isSaved = saved[upload.id]
              const isSaving = saving[upload.id]
              const err = errors[upload.id]

              return (
                <div
                  key={upload.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-sage-100 hover:border-sage-300 group"
                >
                  {/* Image */}
                  <div
                    className="relative w-full aspect-square bg-sage-50 cursor-pointer"
                    onClick={() => setSelectedUpload({ id: upload.id, user_id: upload.user_id, image_path: upload.image_path, image_url: upload.image_url, comment: null, created_at: upload.created_at })}
                  >
                    <Image
                      src={upload.image_url}
                      alt={`Inspo by ${upload.uploader_name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 text-sage-700 text-xs font-medium px-3 py-1.5 rounded-full">
                        View full size
                      </span>
                    </div>
                  </div>

                  {/* Info + save button */}
                  <div className="p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{upload.uploader_name}</p>
                      <p className="text-xs text-sage-400 truncate">@{upload.uploader_username}</p>
                    </div>

                    {!isOwn && (
                      <button
                        onClick={() => handleSave(upload.id)}
                        disabled={isSaving || isSaved}
                        title={isSaved ? 'Saved to your board' : 'Save to my board'}
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                          isSaved
                            ? 'bg-sage-500 text-white'
                            : 'bg-sage-100 hover:bg-sage-500 text-sage-600 hover:text-white'
                        } disabled:opacity-60`}
                      >
                        {isSaving ? (
                          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : isSaved ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    )}

                    {isOwn && (
                      <span className="text-xs text-sage-300 italic flex-shrink-0">yours</span>
                    )}
                  </div>

                  {err && <p className="text-xs text-blush-500 px-3 pb-2">{err}</p>}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <ImageLightbox
        upload={selectedUpload}
        onClose={() => setSelectedUpload(null)}
        showComments={false}
      />
    </div>
  )
}
