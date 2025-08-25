# Manual Testing Guide

This guide will help you test all features of your events booking website step by step.

## Prerequisites Setup

### 1. Set up Supabase Project

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Project Credentials**
   - Go to Settings > API in your Supabase dashboard
   - Copy the following:
     - Project URL
     - Anon key (public)
     - Service role key (secret)

3. **Set up Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy the entire contents of `database-schema.sql`
   - Paste and execute the script
   - Verify tables are created in the Table Editor

### 2. Set up Stripe Account

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up for a free account
   - Complete account setup

2. **Get API Keys**
   - Go to Developers > API keys in Stripe dashboard
   - Copy:
     - Publishable key (starts with `pk_test_`)
     - Secret key (starts with `sk_test_`)

### 3. Configure Environment Variables

1. **Create Environment File**
   ```bash
   cd events-app/web
   cp env.example .env.local
   ```

2. **Fill in Credentials**
   ```bash
   # Edit .env.local with your actual values
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   APP_URL=http://localhost:3000
   ```

## Starting the Application

### 1. Start Development Server
```bash
cd events-app/web
pnpm dev
```

### 2. Set up Stripe Webhook (New Terminal)
```bash
# Install Stripe CLI if not already installed
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. **Copy Webhook Secret**
   - The command will output something like: `Ready! Your webhook signing secret is whsec_123...`
   - Copy this secret and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Manual Testing Checklist

### ✅ Test 1: Home Page Loading
**URL:** http://localhost:3000

**Expected Behavior:**
- [ ] Page loads without errors
- [ ] "Welcome to Events Booking" heading is displayed
- [ ] "Discover and book amazing events" subtitle is shown
- [ ] If no events exist, "No events found. Check back later!" is displayed

**If you see "No events found":**
- This is expected if you haven't added events to your database yet
- Continue to Test 2 to add sample data

### ✅ Test 2: Database Setup Verification
**Check Supabase Dashboard:**

1. **Verify Tables Created:**
   - Go to Table Editor in Supabase
   - Confirm these tables exist:
     - `profiles`
     - `venues`
     - `events`
     - `ticket_types`
     - `bookings`
     - `booking_items`
     - `payments`

2. **Check Sample Data:**
   - Look for the sample venue "Downtown Hall"
   - Look for the sample event "Indie Night"
   - Look for the sample ticket type "General Admission"

3. **If No Sample Data:**
   - Go to SQL Editor
   - Run this query to check if data exists:
   ```sql
   SELECT * FROM events;
   SELECT * FROM venues;
   SELECT * FROM ticket_types;
   ```

### ✅ Test 3: Events API Endpoint
**URL:** http://localhost:3000/api/events

**Expected Response:**
```json
[
  {
    "id": "uuid-here",
    "title": "Indie Night",
    "slug": "indie-night",
    "summary": "Local bands + vibes",
    "category": "Music",
    "start_at": "2024-01-XX...",
    "end_at": "2024-01-XX...",
    "status": "published"
  }
]
```

**Test with Filters:**
- http://localhost:3000/api/events?q=indie
- http://localhost:3000/api/events?from=2024-01-01

### ✅ Test 4: Individual Event API
**URL:** http://localhost:3000/api/events/[event-id]

**Steps:**
1. Get an event ID from the events list API
2. Replace `[event-id]` with the actual UUID
3. Test the endpoint

**Expected Response:**
```json
{
  "event": {
    "id": "uuid",
    "title": "Indie Night",
    "summary": "Local bands + vibes",
    "start_at": "2024-01-XX...",
    "end_at": "2024-01-XX...",
    "status": "published"
  },
  "tickets": [
    {
      "id": "uuid",
      "name": "General Admission",
      "price_cents": 2500,
      "currency": "usd",
      "inventory": 100
    }
  ]
}
```

### ✅ Test 5: Home Page with Events
**URL:** http://localhost:3000

**Expected Behavior:**
- [ ] Events are displayed in a grid layout
- [ ] Each event shows:
  - [ ] Event image (if available)
  - [ ] Event title
  - [ ] Event summary
  - [ ] Event date
  - [ ] "View Details" button
- [ ] Clicking "View Details" navigates to event page

### ✅ Test 6: Individual Event Page
**URL:** http://localhost:3000/events/[event-id]

**Expected Behavior:**
- [ ] Event details are displayed
- [ ] Event image is shown (if available)
- [ ] Event information includes:
  - [ ] Title
  - [ ] Summary
  - [ ] Date and time
  - [ ] Category
  - [ ] Tags (if any)
  - [ ] Description (if any)

**Ticket Section:**
- [ ] Available tickets are listed
- [ ] Each ticket shows:
  - [ ] Ticket name
  - [ ] Price
  - [ ] Available inventory
  - [ ] Quantity selector (+/- buttons)

**Booking Flow:**
- [ ] Select ticket quantities using +/- buttons
- [ ] Total price updates automatically
- [ ] "Proceed to Checkout" button appears when tickets are selected
- [ ] Click "Proceed to Checkout" redirects to Stripe

### ✅ Test 7: Stripe Checkout Flow
**Steps:**
1. Select tickets on event page
2. Click "Proceed to Checkout"
3. Verify redirect to Stripe checkout page

**Stripe Test Cards:**
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

**Test Payment:**
- [ ] Use test card `4242 4242 4242 4242`
- [ ] Any future expiry date
- [ ] Any 3-digit CVC
- [ ] Any billing address
- [ ] Complete payment

### ✅ Test 8: Success Page
**Expected Behavior:**
- [ ] Redirected to success page after payment
- [ ] Success message is displayed
- [ ] Booking ID is shown
- [ ] "Browse More Events" button works
- [ ] "View My Bookings" button works (will show empty for now)

### ✅ Test 9: Webhook Processing
**Check Supabase Dashboard:**

1. **Verify Booking Created:**
   - Go to Table Editor > `bookings`
   - Look for a new booking with status "paid"

2. **Verify Payment Record:**
   - Go to Table Editor > `payments`
   - Look for a new payment record

3. **Check Webhook Logs:**
   - In your terminal running `stripe listen`
   - Verify webhook events are being received

### ✅ Test 10: Error Handling

**Test Invalid Event ID:**
- Navigate to: http://localhost:3000/events/invalid-id
- Expected: "Event not found" message

**Test Invalid API Calls:**
- http://localhost:3000/api/events/invalid-id
- Expected: 404 error response

**Test Stripe Decline:**
- Use test card `4000 0000 0000 0002`
- Expected: Payment declined, redirected to cancel URL

## Troubleshooting

### Common Issues:

1. **"No events found"**
   - Check if database schema was executed
   - Verify sample data was inserted
   - Check Supabase connection

2. **API errors**
   - Verify environment variables are set correctly
   - Check Supabase project URL and keys
   - Ensure database tables exist

3. **Stripe checkout not working**
   - Verify Stripe secret key is correct
   - Check webhook endpoint is running
   - Ensure APP_URL is set correctly

4. **Webhook not processing**
   - Verify webhook secret is correct
   - Check if `stripe listen` is running
   - Ensure webhook endpoint is accessible

### Debug Commands:

```bash
# Check if server is running
curl http://localhost:3000/api/events

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Check webhook forwarding
stripe listen --print-secret
```

## Next Steps After Testing

Once all tests pass, you can:

1. **Add Real Events** - Use Supabase dashboard to add more events
2. **Implement Authentication** - Add user login/signup
3. **Add Booking Management** - Create user dashboard
4. **Add Admin Features** - Event creation and management
5. **Deploy to Production** - Deploy to Vercel

## Test Data for Development

You can add more test events via Supabase SQL Editor:

```sql
-- Add more venues
INSERT INTO venues(name, city, capacity) VALUES 
('Concert Hall', 'New York', 1000),
('Jazz Club', 'Chicago', 200);

-- Add more events
INSERT INTO events(organizer_id, venue_id, title, slug, summary, category, tags, image_url, start_at, end_at, status, sales_start_at, sales_end_at)
VALUES 
(null, (SELECT id FROM venues WHERE name = 'Concert Hall' LIMIT 1),
 'Rock Concert', 'rock-concert', 'Amazing rock bands', 'Music', array['rock','live'],
 'https://picsum.photos/seed/rock/800/400',
 now() + interval '7 days', now() + interval '7 days 2 hours', 'published',
 now() - interval '1 day', now() + interval '6 days');

-- Add more ticket types
INSERT INTO ticket_types(event_id, name, price_cents, inventory)
SELECT id, 'VIP Pass', 5000, 50 FROM events WHERE slug='rock-concert';
```

This testing guide covers all the core functionality of your events booking website. Follow each test step by step to ensure everything is working correctly!
