import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getImageUrl } from '@/lib/supabase'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('uploads')
    .select('id, user_id, image_path, created_at, users(display_name, username)')
    .is('source_upload_id', null)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to load community board' }, { status: 500 })
  }

  const uploads = (data || []).map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    image_path: row.image_path,
    created_at: row.created_at,
    image_url: getImageUrl(row.image_path),
    uploader_name: row.users?.display_name || 'Unknown',
    uploader_username: row.users?.username || '',
  }))

  return NextResponse.json({ uploads })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { uploadId } = await request.json()
  if (!uploadId) {
    return NextResponse.json({ error: 'Missing upload ID' }, { status: 400 })
  }

  // Fetch the original upload
  const { data: original } = await supabaseAdmin
    .from('uploads')
    .select('*')
    .eq('id', uploadId)
    .single()

  if (!original) {
    return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
  }

  if (original.user_id === session.id) {
    return NextResponse.json({ error: 'This is already your photo' }, { status: 400 })
  }

  // Save to user's board, tracking the source so community board stays clean
  const { data: newUpload, error: dbError } = await supabaseAdmin
    .from('uploads')
    .insert({
      user_id: session.id,
      image_path: original.image_path,
      comment: null,
      source_upload_id: original.id,
    })
    .select()
    .single()

  if (dbError) {
    return NextResponse.json({ error: 'Failed to save to your board' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    upload: { ...newUpload, image_url: getImageUrl(original.image_path) },
  })
}
