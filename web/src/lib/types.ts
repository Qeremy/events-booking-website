import { z } from 'zod'

// Database Types
export const ProfileSchema = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.string()
})

export const VenueSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  geo_lat: z.number().nullable(),
  geo_lng: z.number().nullable(),
  capacity: z.number().nullable(),
  created_at: z.string()
})

export const EventSchema = z.object({
  id: z.string().uuid(),
  organizer_id: z.string().uuid().nullable(),
  venue_id: z.string().uuid().nullable(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().nullable(),
  description_md: z.string().nullable(),
  category: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  image_url: z.string().nullable(),
  start_at: z.string(),
  end_at: z.string(),
  timezone: z.string(),
  status: z.enum(['draft', 'published', 'cancelled']),
  sales_start_at: z.string().nullable(),
  sales_end_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string()
})

export const TicketTypeSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  name: z.string(),
  price_cents: z.number(),
  currency: z.string(),
  inventory: z.number(),
  per_user_limit: z.number(),
  is_active: z.boolean(),
  sort_order: z.number()
})

export const BookingSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  event_id: z.string().uuid(),
  total_cents: z.number(),
  currency: z.string(),
  status: z.enum(['pending', 'paid', 'refunded', 'expired']),
  created_at: z.string(),
  updated_at: z.string()
})

export const BookingItemSchema = z.object({
  id: z.string().uuid(),
  booking_id: z.string().uuid(),
  ticket_type_id: z.string().uuid(),
  qty: z.number(),
  unit_price_cents: z.number()
})

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  booking_id: z.string().uuid(),
  stripe_payment_intent_id: z.string().nullable(),
  status: z.string().nullable(),
  amount_cents: z.number().nullable(),
  receipt_url: z.string().nullable(),
  created_at: z.string()
})

// TypeScript Types
export type Profile = z.infer<typeof ProfileSchema>
export type Venue = z.infer<typeof VenueSchema>
export type Event = z.infer<typeof EventSchema>
export type TicketType = z.infer<typeof TicketTypeSchema>
export type Booking = z.infer<typeof BookingSchema>
export type BookingItem = z.infer<typeof BookingItemSchema>
export type Payment = z.infer<typeof PaymentSchema>

// Extended types with relations
export type EventWithVenue = Event & {
  venue: Venue | null
}

export type EventWithTicketTypes = Event & {
  ticket_types: TicketType[]
}

export type BookingWithItems = Booking & {
  booking_items: (BookingItem & {
    ticket_type: TicketType
  })[]
  event: Event
}
