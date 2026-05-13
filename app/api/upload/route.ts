import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getImageUrl } from '@/lib/supabase'
import { getSession } from '@/lib/session'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { uploadId } = await request.json()
    if (!uploadId) {
      return NextResponse.json({ error: 'Missing upload ID' }, { status: 400 })
    }

    // Fetch the upload to verify ownership
    const { data: upload } = await supabaseAdmin
      .from('uploads')
      .select('*')
      .eq('id', uploadId)
      .single()

    if (!upload) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    // Only the owner or admin can delete
    if (upload.user_id !== session.id && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete from storage
    await supabaseAdmin.storage.from('inspirations').remove([upload.image_path])

    // Delete from database
    await supabaseAdmin.from('uploads').delete().eq('id', uploadId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const comment = formData.get('comment') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, WebP, GIF, or HEIC image.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Generate a unique file path
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const uniqueId = crypto.randomUUID()
    const imagePath = `${session.id}/${uniqueId}.${ext}`

    // Convert file to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('inspirations')
      .upload(imagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image. Please try again.' },
        { status: 500 }
      )
    }

    // Insert upload record into database
    const { data: uploadRecord, error: dbError } = await supabaseAdmin
      .from('uploads')
      .insert({
        user_id: session.id,
        image_path: imagePath,
        comment: comment?.trim() || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Try to clean up the uploaded file
      await supabaseAdmin.storage.from('inspirations').remove([imagePath])
      return NextResponse.json(
        { error: 'Failed to save upload record. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      upload: {
        ...uploadRecord,
        image_url: getImageUrl(imagePath),
      },
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
