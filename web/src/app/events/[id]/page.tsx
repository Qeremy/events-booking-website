'use client'

import { useState, useEffect } from 'react'
import { formatDate, formatTime, formatPrice } from '@/lib/utils'
import { Event, TicketType } from '@/lib/types'

interface EventPageProps {
  params: { id: string }
}

interface EventData {
  event: Event
  tickets: TicketType[]
}

export default function EventPage({ params }: EventPageProps) {
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  // Fetch event data on component mount
  useEffect(() => {
    fetch(`/api/events/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setEventData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleQuantityChange = (ticketId: string, qty: number) => {
    setQuantities(prev => ({
      ...prev,
      [ticketId]: Math.max(0, qty)
    }))
  }

  const handleCheckout = async () => {
    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketTypeId, qty]) => ({ ticketTypeId, qty }))

    if (items.length === 0) {
      alert('Please select at least one ticket')
      return
    }

    setBookingLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: params.id, items, userId: null })
      })
      const { checkoutUrl } = await res.json()
      window.location.href = checkoutUrl
    } catch (error) {
      alert('Error creating booking')
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Event not found</div>
      </div>
    )
  }

  const { event, tickets } = eventData
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  const totalPrice = tickets.reduce((sum, ticket) => {
    const qty = quantities[ticket.id] || 0
    return sum + (ticket.price_cents * qty)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {event.image_url && (
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <p className="text-gray-600 mb-6">{event.summary}</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                <div className="space-y-2">
                  <p><strong>Date:</strong> {formatDate(event.start_at)}</p>
                  <p><strong>Time:</strong> {formatTime(event.start_at)} - {formatTime(event.end_at)}</p>
                  <p><strong>Category:</strong> {event.category}</p>
                  {event.tags && event.tags.length > 0 && (
                    <p><strong>Tags:</strong> {event.tags.join(', ')}</p>
                  )}
                </div>
                
                {event.description_md && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{event.description_md}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Tickets</h2>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{ticket.name}</h3>
                        <span className="text-lg font-bold">{formatPrice(ticket.price_cents)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {ticket.inventory} tickets available
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(ticket.id, (quantities[ticket.id] || 0) - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{quantities[ticket.id] || 0}</span>
                        <button
                          onClick={() => handleQuantityChange(ticket.id, (quantities[ticket.id] || 0) + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {totalItems > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total ({totalItems} tickets):</span>
                      <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      disabled={bookingLoading}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {bookingLoading ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
