import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }>}) {
  const { id } = await params
  const supabase = supabaseServer()
  const { data: event, error } = await supabase.from('events').select('*').eq('id', id).single()
  if (error || !event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: tickets } = await supabase.from('ticket_types').select('*').eq('event_id', id).eq('is_active', true).order('sort_order')
  return NextResponse.json({ event, tickets: tickets ?? [] })
}
