'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/supabase-client'
import type { CustomerBoard } from '@/types'

const STORAGE_KEY = 'adminBoardsLastVisit'

interface Props {
  boards: CustomerBoard[]
  currentUserId: string
}

export default function ClientBoardsGrid({ boards, currentUserId }: Props) {
  const [newBoards, setNewBoards] = useState<Set<string>>(new Set())

  useEffect(() => {
    const lastVisit = localStorage.getItem(STORAGE_KEY)
    if (lastVisit) {
      const newSet = new Set<string>()
      for (const board of boards) {
        if (board.latest_upload_at && new Date(board.latest_upload_at) > new Date(lastVisit)) {
          newSet.add(board.id)
        }
      }
      setNewBoards(newSet)
    }
    // Mark as visited now
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    // Notify NavBar to clear red dot
    window.dispatchEvent(new Event('adminBoardsVisited'))
  }, [boards])

  if (boards.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-sage-300 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-sage-400 font-medium">No boards yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {boards.map((board) => {
        const isOwn = board.id === currentUserId
        const href = isOwn ? '/my-folder' : `/folder/${board.username}`
        const isNew = newBoards.has(board.id)

        return (
          <Link
            key={board.id}
            href={href}
            className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 ${
              isOwn ? 'ring-2 ring-blush-300' : 'ring-1 ring-sage-100 hover:ring-sage-300'
            }`}
          >
            <div className="relative w-full aspect-square bg-sage-50 overflow-hidden">
              {board.latest_image_path ? (
                <>
                  <Image
                    src={getImageUrl(board.latest_image_path)}
                    alt={`${board.display_name}'s latest upload`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-blush-300/0 group-hover:bg-blush-300/15 transition-colors duration-300" />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-sage-300">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                  </svg>
                  <span className="text-xs font-medium">No uploads yet</span>
                </div>
              )}

              {/* Upload count badge */}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-sage-600 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                {board.upload_count} {board.upload_count === 1 ? 'photo' : 'photos'}
              </div>

              {isOwn && (
                <div className="absolute top-2 left-2 bg-blush-300 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  Your Board
                </div>
              )}

            </div>

            <div className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-playfair font-semibold text-henna-500 text-base truncate">
                  {board.display_name}
                </h3>
                <p className="text-sage-400 text-xs mt-0.5">@{board.username}</p>
              </div>
              {isNew && !isOwn && (
                <span className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-2 h-2 bg-blush-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-blush-500">New</span>
                </span>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
