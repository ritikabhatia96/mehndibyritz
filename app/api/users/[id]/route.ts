import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'

// DELETE /api/users/[id] — admin only
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params

    // Prevent admin from deleting themselves
    if (id === session.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    // Get user's uploads to delete from storage
    const { data: uploads } = await supabaseAdmin
      .from('uploads')
      .select('image_path')
      .eq('user_id', id)

    // Delete storage files
    if (uploads && uploads.length > 0) {
      const paths = uploads.map((u) => u.image_path)
      await supabaseAdmin.storage.from('inspirations').remove(paths)
    }

    // Delete user (uploads cascade via FK)
    const { error } = await supabaseAdmin.from('users').delete().eq('id', id)

    if (error) {
      console.error('Error deleting user:', error)
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/users/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/users/[id] — admin only, reset password
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { password } = body

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const password_hash = await bcrypt.hash(password, 12)

    const { error } = await supabaseAdmin
      .from('users')
      .update({ password_hash })
      .eq('id', id)

    if (error) {
      console.error('Error resetting password:', error)
      return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/users/[id] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
