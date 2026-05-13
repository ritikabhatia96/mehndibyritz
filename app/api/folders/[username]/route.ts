import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getImageUrl } from '@/lib/supabase'
import { getSession } from '@/lib/session'

// GET /api/folders/[username] — authenticated, returns uploads for a user
export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username } = params

    // Look up user by username
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, username, display_name')
      .eq('username', username.toLowerCase())
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get their uploads ordered by newest first
    const { data: uploads, error: uploadsError } = await supabaseAdmin
      .from('uploads')
      .select('id, image_path, comment, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (uploadsError) {
      console.error('Error fetching uploads:', uploadsError)
      return NextResponse.json({ error: 'Failed to fetch uploads' }, { status: 500 })
    }

    const uploadsWithUrls = (uploads || []).map((u) => ({
      ...u,
      image_url: getImageUrl(u.image_path),
    }))

    return NextResponse.json({
      user: {
        username: user.username,
        display_name: user.display_name,
      },
      uploads: uploadsWithUrls,
    })
  } catch (err) {
    console.error('GET /api/folders/[username] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
