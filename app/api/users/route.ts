import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'

// GET /api/users — admin only, returns all users with upload count
export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all users
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, username, display_name, role, created_at')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Get upload counts for each user
    const { data: uploadCounts, error: countError } = await supabaseAdmin
      .from('uploads')
      .select('user_id')

    if (countError) {
      console.error('Error fetching upload counts:', countError)
    }

    const countMap: Record<string, number> = {}
    if (uploadCounts) {
      for (const row of uploadCounts) {
        countMap[row.user_id] = (countMap[row.user_id] || 0) + 1
      }
    }

    const usersWithCount = users.map((u) => ({
      ...u,
      upload_count: countMap[u.id] || 0,
    }))

    return NextResponse.json({ users: usersWithCount })
  } catch (err) {
    console.error('GET /api/users error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/users — admin only, create a new user
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { username, display_name, password, role } = body

    if (!username || !display_name || !password) {
      return NextResponse.json(
        { error: 'Username, display name, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const normalizedUsername = username.toLowerCase().trim()

    // Check if username already exists
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', normalizedUsername)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      )
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 12)

    // Insert user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        username: normalizedUsername,
        display_name: display_name.trim(),
        password_hash,
        role: role === 'admin' ? 'admin' : 'customer',
      })
      .select('id, username, display_name, role, created_at')
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: newUser }, { status: 201 })
  } catch (err) {
    console.error('POST /api/users error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
