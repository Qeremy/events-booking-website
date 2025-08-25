'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

interface Booking {
  id: string
  total_cents: number
  currency: string
  status: string
  event: {
    title: string
    start_at: string
  }
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      // In a real app, you'd fetch the booking details from your API
      // For now, we'll just show a success message
      setLoading(false)
    }
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your booking. You will receive a confirmation email shortly.
          </p>
          
          {bookingId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Booking ID:</p>
              <p className="font-mono text-sm">{bookingId}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <a
              href="/"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse More Events
            </a>
            
            <a
              href="/bookings"
              className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              View My Bookings
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
