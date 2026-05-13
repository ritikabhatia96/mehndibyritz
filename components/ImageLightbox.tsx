'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import type { Upload } from '@/types'

interface ImageLightboxProps {
  upload: Upload | null
  onClose: () => void
  onDelete?: (uploadId: string) => void
}

export default function ImageLightbox({ upload, onClose, onDelete }: ImageLightboxProps) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (upload) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [upload, handleKeyDown])

  useEffect(() => {
    setConfirming(false)
  }, [upload])

  if (!upload) return null

  const formattedDate = new Date(upload.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  async function handleDelete() {
    if (!upload) return
    setDeleting(true)
    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: upload.id }),
      })
      if (res.ok) {
        onDelete?.(upload.id)
        onClose()
      }
    } finally {
      setDeleting(false)
      setConfirming(false)
    }
  }

  const imageUrl = upload.image_url || ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full p-2 shadow transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative w-full" style={{ maxHeight: '70vh' }}>
          <div className="relative w-full aspect-video bg-sage-50">
            <Image
              src={imageUrl}
              alt={upload.comment || 'Inspiration photo'}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="p-5 bg-cream-50 border-t border-sage-100 flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-sage-400 mb-2">{formattedDate}</p>
            {upload.comment ? (
              <p className="text-gray-700 text-sm leading-relaxed">{upload.comment}</p>
            ) : (
              <p className="text-sage-300 italic text-sm">No note added</p>
            )}
          </div>

          {onDelete && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {confirming ? (
                <>
                  <span className="text-sm text-gray-500">Remove this photo?</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-sm px-3 py-1.5 rounded-lg bg-blush-500 hover:bg-blush-400 text-white transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Removing...' : 'Yes, remove'}
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-sage-100 hover:bg-sage-200 text-sage-700 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirming(true)}
                  className="text-sm px-3 py-1.5 rounded-lg border border-blush-300 text-blush-500 hover:bg-blush-50 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
