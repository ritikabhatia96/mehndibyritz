'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Upload } from '@/types'

interface ImageCardProps {
  upload: Upload
  onImageClick: (upload: Upload) => void
  showComments?: boolean
}

export default function ImageCard({ upload, onImageClick, showComments = true }: ImageCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const formattedDate = new Date(upload.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const imageUrl = upload.image_url || ''

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden group transition-all duration-200"
      style={{
        boxShadow: '0 1px 4px rgba(139,69,19,0.06), 0 1px 2px rgba(99,140,89,0.04)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(139,69,19,0.11), 0 2px 8px rgba(99,140,89,0.07)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(139,69,19,0.06), 0 1px 2px rgba(99,140,89,0.04)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Image */}
      <div
        className="relative w-full aspect-square cursor-pointer overflow-hidden bg-sage-50"
        onClick={() => onImageClick(upload)}
      >
        {!imgError ? (
          <Image
            src={imageUrl}
            alt={upload.comment || 'Inspiration photo'}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sage-50">
            <svg
              className="w-12 h-12 text-sage-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 bg-white/90 text-sage-700 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
            View full size
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 border-t border-sage-50">
        <p className="text-xs text-sage-300 mb-1">{formattedDate}</p>

        {showComments && (
          upload.comment ? (
            <div>
              <p className={`text-sm text-gray-600 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
                {upload.comment}
              </p>
              {upload.comment.length > 80 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-sage-500 hover:text-sage-600 font-medium mt-1 transition-colors"
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-sage-300 italic">No note added</p>
          )
        )}
      </div>
    </div>
  )
}
