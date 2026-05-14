import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getImageUrl } from '@/lib/supabase'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('uploads')
    .select('id, user_id, image_path, created_at, users(display_name, username)')
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

  // Download the original file from storage
  const { data: fileData, error: downloadError } = await supabaseAdmin.storage
    .from('inspirations')
    .download(original.image_path)

  if (downloadError || !fileData) {
    return NextResponse.json({ error: 'Failed to copy image' }, { status: 500 })
  }

  // Re-upload under the current user's folder
  const ext = original.image_path.split('.').pop() || 'jpg'
  const newPath = `${session.id}/${crypto.randomUUID()}.${ext}`

  const buffer = await fileData.arrayBuffer()
  const { error: uploadError } = await supabaseAdmin.storage
    .from('inspirations')
    .upload(newPath, buffer, { contentType: fileData.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 })
  }

  // Insert new DB record
  const { data: newUpload, error: dbError } = await supabaseAdmin
    .from('uploads')
    .insert({ user_id: session.id, image_path: newPath, comment: null })
    .select()
    .single()

  if (dbError) {
    await supabaseAdmin.storage.from('inspirations').remove([newPath])
    return NextResponse.json({ error: 'Failed to save to your board' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    upload: { ...newUpload, image_url: getImageUrl(newPath) },
  })
}
