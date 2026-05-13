import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSession } from '@/lib/session'
import { supabaseAdmin, getImageUrl } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import type { CustomerBoard } from '@/types'

async function getDashboardData(currentUserId: string): Promise<CustomerBoard[]> {
  // Get all users (customers only for display, but admin can see all)
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, username, display_name')
    .order('display_name', { ascending: true })

  if (!users) return []

  // Get upload counts and latest image per user
  const { data: uploads } = await supabaseAdmin
    .from('uploads')
    .select('user_id, image_path, created_at')
    .order('created_at', { ascending: false })

  const countMap: Record<string, number> = {}
  const latestMap: Record<string, string | null> = {}

  if (uploads) {
    for (const u of uploads) {
      countMap[u.user_id] = (countMap[u.user_id] || 0) + 1
      if (!latestMap[u.user_id]) {
        latestMap[u.user_id] = u.image_path
      }
    }
  }

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    display_name: u.display_name,
    upload_count: countMap[u.id] || 0,
    latest_image_path: latestMap[u.id] || null,
  }))
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const boards = await getDashboardData(session.id)

  return (
    <div className="min-h-screen bg-cream-100">
      <NavBar
        username={session.username}
        displayName={session.displayName}
        role={session.role}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-henna-500 mb-2">
            Inspiration Boards
          </h1>
          <p className="text-sage-500">Browse all inspiration boards</p>
        </div>

        {/* Grid */}
        {boards.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-sage-300 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sage-400 font-medium">No boards yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {boards.map((board) => {
              const isOwn = board.id === session.id
              const href = isOwn ? '/my-folder' : `/folder/${board.username}`

              return (
                <Link
                  key={board.id}
                  href={href}
                  className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 ${
                    isOwn ? 'ring-2 ring-blush-300' : 'ring-1 ring-sage-100 hover:ring-sage-300'
                  }`}
                >
                  {/* Image preview / placeholder */}
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

                    {/* "Your Board" label */}
                    {isOwn && (
                      <div className="absolute top-2 left-2 bg-blush-300 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                        Your Board
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="p-3">
                    <h3 className="font-playfair font-semibold text-henna-500 text-base truncate">
                      {board.display_name}
                    </h3>
                    <p className="text-sage-400 text-xs mt-0.5">@{board.username}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
