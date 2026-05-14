import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { createToken } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { username, password, displayName, signupCode } = await request.json()

    if (!username || !password || !displayName || !signupCode) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (signupCode.trim() !== process.env.SIGNUP_CODE) {
      return NextResponse.json({ error: 'Invalid invite code.' }, { status: 401 })
    }

    const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '').trim()
    if (clean.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters (letters, numbers, underscores only).' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', clean)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'That username is already taken.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({ username: clean, display_name: displayName.trim(), password_hash: passwordHash, role: 'customer' })
      .select()
      .single()

    if (error || !newUser) {
      return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 })
    }

    const token = await createToken({
      id: newUser.id,
      username: newUser.username,
      displayName: newUser.display_name,
      role: 'customer',
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
