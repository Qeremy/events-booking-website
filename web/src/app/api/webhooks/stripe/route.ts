import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature')!
  const payload = await req.text()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.booking_id!
    const amount = session.amount_total ?? 0
    const paymentIntent = session.payment_intent as string | null

    const supabase = supabaseServer()
    await supabase.from('bookings').update({ status: 'paid' }).eq('id', bookingId)
    await supabase.from('payments').insert({
      booking_id: bookingId, amount_cents: amount, status: 'paid', stripe_payment_intent_id: paymentIntent ?? undefined
    })
  }

  return NextResponse.json({ received: true })
}

export const config = { api: { bodyParser: false } } // Next.js reads text()
