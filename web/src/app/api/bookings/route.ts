import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: Request) {
  const { eventId, items, userId } = await req.json() as {
    eventId: string,
    userId: string | null,           // plug in real auth later
    items: { ticketTypeId: string, qty: number }[]
  }

  const supabase = supabaseServer()
  // Load tickets & compute total
  const { data: tickets } = await supabase.from('ticket_types').select('id, price_cents, currency, event_id, name, inventory').in('id', items.map(i=>i.ticketTypeId))
  if (!tickets?.length) return NextResponse.json({ error: 'Invalid tickets' }, { status: 400 })

  const lineItems = items.map(i => {
    const t = tickets.find(t => t.id === i.ticketTypeId)!
    return {
      price_data: {
        currency: t.currency,
        product_data: { name: t.name },
        unit_amount: t.price_cents
      },
      quantity: i.qty
    }
  })

  const total = items.reduce((sum, i) => {
    const t = tickets.find(t => t.id === i.ticketTypeId)!
    return sum + t.price_cents * i.qty
  }, 0)

  // Create pending booking
  const { data: booking, error: bErr } = await supabase.from('bookings')
    .insert({ user_id: userId, event_id: eventId, total_cents: total })
    .select('id,currency').single()
  if (bErr) return NextResponse.json({ error: bErr.message }, { status: 500 })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${process.env.APP_URL}/success?booking=${booking.id}`,
    cancel_url: `${process.env.APP_URL}/events/${eventId}`,
    metadata: { booking_id: booking.id }
  })

  return NextResponse.json({ checkoutUrl: session.url })
}
