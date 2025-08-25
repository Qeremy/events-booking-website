# Events Booking Website

A modern event booking platform built with Next.js, Supabase, and Stripe.

## Features

- 🎫 Event browsing and search
- 🔐 User authentication and profiles
- 💳 Secure payment processing with Stripe
- 📅 Event registration and booking
- 🏢 Venue management
- 📊 Booking management and analytics
- 📱 Responsive design
- 🔍 Event recommendations (coming soon)

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Stripe
- **Deployment**: Vercel
- **Package Manager**: pnpm

## Project Structure

```
events-app/
├── web/                    # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and configurations
│   │   └── types/        # TypeScript type definitions
│   ├── database-schema.sql # Database schema
│   └── env.example       # Environment variables template
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- Supabase account
- Stripe account
- Vercel account (for deployment)

### 1. Clone and Install

```bash
git clone <your-repo>
cd events-app/web
pnpm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and keys from Settings > API
3. Run the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `database-schema.sql`
   - Execute the script

### 3. Set up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Set up webhook endpoints (instructions below)

### 4. Environment Variables

Copy `env.example` to `.env.local` and fill in your credentials:

```bash
cp env.example .env.local
```

Fill in the following variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

### 5. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## Database Schema

The application uses the following main tables:

- **profiles**: User profiles linked to Supabase auth
- **venues**: Event venues with location data
- **events**: Event information and metadata
- **ticket_types**: Different ticket categories and pricing
- **bookings**: User bookings for events
- **booking_items**: Individual ticket purchases
- **payments**: Stripe payment records

## API Routes

The application includes the following API routes:

- `/api/events` - Event CRUD operations
- `/api/bookings` - Booking management
- `/api/payments` - Stripe payment processing
- `/api/webhooks/stripe` - Stripe webhook handling

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Set up Stripe Webhooks

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy the webhook secret to your environment variables

## Development

### Adding New Features

1. Create database migrations in Supabase
2. Update TypeScript types in `src/lib/types.ts`
3. Create API routes in `src/app/api/`
4. Build UI components in `src/components/`
5. Add pages in `src/app/`

### Code Style

- Use TypeScript for type safety
- Follow Next.js 15 App Router conventions
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for better UX

## Next Steps

- [ ] Add event search and filtering
- [ ] Implement event recommendations
- [ ] Add email notifications
- [ ] Create admin dashboard
- [ ] Add mobile app with React Native
- [ ] Implement real-time updates
- [ ] Add analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
