import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') ?? ''
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const supabase = supabaseServer()
    let query = supabase.from('events').select('*').eq('status','published')

    if (q) query = query.ilike('title', `%${q}%`)
    if (from) query = query.gte('start_at', from)
    if (to) query = query.lte('start_at', to)

    const { data, error } = await query.order('start_at', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (error: any) {
    if (error.message.includes('not configured')) {
      return NextResponse.json({ 
        error: 'Database not configured',
        message: 'Please set up your Supabase project and update environment variables',
        setupRequired: true
      }, { status: 503 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
