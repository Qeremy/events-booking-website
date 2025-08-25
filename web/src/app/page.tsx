import { formatDate, formatPrice } from '@/lib/utils'
import { Event } from '@/lib/types'

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${process.env.APP_URL}/api/events`, { 
      cache: 'no-store',
      // Add a timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    })
    if (!res.ok) {
      console.error('Failed to fetch events:', res.status, res.statusText)
      return []
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export default async function HomePage() {
  const events = await getEvents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Events Booking
          </h1>
          <p className="text-xl text-gray-600">
            Discover and book amazing events in your area
          </p>
        </div>
        
        {events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {event.image_url && (
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {formatDate(event.start_at)}
                    </span>
                    <a 
                      href={`/events/${event.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">No Events Found</h3>
              <p className="text-gray-600 mb-6">
                There are no events available at the moment. This could be because:
              </p>
              <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                <li>• The database hasn't been set up yet</li>
                <li>• No events have been added to the database</li>
                <li>• The API connection is not configured</li>
              </ul>
              <div className="space-y-3">
                <a
                  href="/api/events"
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  target="_blank"
                >
                  Test API Endpoint
                </a>
                <p className="text-xs text-gray-500">
                  Check the testing guide for setup instructions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
