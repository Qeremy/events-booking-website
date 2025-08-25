# Quick Setup Guide

Your events booking website is now running at **http://localhost:3000**! 

## Current Status ✅

- ✅ **Server running**: http://localhost:3000
- ✅ **Error handling**: Graceful fallbacks implemented
- ⏳ **Database**: Needs Supabase setup
- ⏳ **Payments**: Needs Stripe setup

## Step 1: Set up Supabase (Required)

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Get Your API Keys
1. In your Supabase dashboard, go to **Settings > API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Anon key** (starts with: `eyJ...`)
   - **Service role key** (starts with: `eyJ...`)

### 3. Update Environment Variables
1. Open `events-app/web/.env.local`
2. Replace the placeholder values with your actual Supabase credentials:

```bash
# Replace these with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Set up Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `database-schema.sql`
3. Paste and execute the script
4. Verify tables are created in **Table Editor**

## Step 2: Test Your Setup

### 1. Restart the Server
```bash
# Stop the server (Ctrl+C) and restart
pnpm dev
```

### 2. Test the Application
1. Visit **http://localhost:3000**
2. You should now see the "Indie Night" event
3. Click "View Details" to test the event page
4. Test the booking flow (will redirect to Stripe)

## Step 3: Set up Stripe (Optional for Testing)

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete account setup

### 2. Get API Keys
1. In Stripe dashboard, go to **Developers > API keys**
2. Copy:
   - **Secret key** (starts with: `sk_test_...`)

### 3. Update Environment Variables
Add your Stripe key to `.env.local`:
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### 4. Set up Webhook (New Terminal)
```bash
# Install Stripe CLI if not already installed
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 5. Update Webhook Secret
Copy the `whsec_...` secret from the terminal and add it to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Step 4: Test Complete Flow

1. **Browse Events**: http://localhost:3000
2. **View Event Details**: Click "View Details" on any event
3. **Book Tickets**: Select quantities and proceed to checkout
4. **Complete Payment**: Use test card `4242 4242 4242 4242`
5. **Verify Success**: Check success page and database records

## Troubleshooting

### "Database not configured" Error
- Check that your Supabase credentials are correct in `.env.local`
- Ensure you've restarted the server after updating environment variables

### "No events found"
- Verify the database schema was executed in Supabase
- Check that sample data was inserted

### API Errors
- Check browser console for detailed error messages
- Verify all environment variables are set correctly

## Test Cards for Stripe

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## Next Steps

Once everything is working:
1. Add more events via Supabase dashboard
2. Implement user authentication
3. Add booking management features
4. Deploy to production

Your events booking website is ready to test! 🎉
