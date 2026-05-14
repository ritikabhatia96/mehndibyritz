import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data } = await supabaseAdmin
    .from('uploads')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({ latestUploadAt: data?.created_at || null })
}
