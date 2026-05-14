import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import ClientBoardsGrid from '@/components/ClientBoardsGrid'
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
  const latestImageMap: Record<string, string | null> = {}
  const latestAtMap: Record<string, string | null> = {}

  if (uploads) {
    for (const u of uploads) {
      countMap[u.user_id] = (countMap[u.user_id] || 0) + 1
      if (!latestImageMap[u.user_id]) {
        latestImageMap[u.user_id] = u.image_path
        latestAtMap[u.user_id] = u.created_at
      }
    }
  }

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    display_name: u.display_name,
    upload_count: countMap[u.id] || 0,
    latest_image_path: latestImageMap[u.id] || null,
    latest_upload_at: latestAtMap[u.id] || null,
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

        <ClientBoardsGrid boards={boards} currentUserId={session.id} />
      </main>
    </div>
  )
}
