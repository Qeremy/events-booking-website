-- Profiles mapped to auth.users
create table if not exists profiles(
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Venues
create table if not exists venues(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  geo_lat double precision,
  geo_lng double precision,
  capacity integer,
  created_at timestamptz default now()
);

-- Events
create table if not exists events(
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references auth.users(id),
  venue_id uuid references venues(id),
  title text not null,
  slug text unique not null,
  summary text,
  description_md text,
  category text,
  tags text[],
  image_url text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text default 'America/New_York',
  status text check (status in ('draft','published','cancelled')) default 'draft',
  sales_start_at timestamptz,
  sales_end_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ticket types
create table if not exists ticket_types(
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  price_cents integer not null,
  currency text default 'usd',
  inventory integer not null,
  per_user_limit integer default 6,
  is_active boolean default true,
  sort_order integer default 0
);

-- Bookings
create table if not exists bookings(
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  event_id uuid not null references events(id),
  total_cents integer not null,
  currency text default 'usd',
  status text check (status in ('pending','paid','refunded','expired')) default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Booking items
create table if not exists booking_items(
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  ticket_type_id uuid not null references ticket_types(id),
  qty integer not null,
  unit_price_cents integer not null
);

-- Payments (Stripe)
create table if not exists payments(
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  stripe_payment_intent_id text,
  status text,
  amount_cents integer,
  receipt_url text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table events enable row level security;
alter table ticket_types enable row level security;
alter table bookings enable row level security;
alter table booking_items enable row level security;
alter table payments enable row level security;

-- Basic policies (public event browse, user-isolation for bookings)
create policy "Public can view published events"
on events for select
using (status = 'published');

create policy "Public can view ticket types of published events"
on ticket_types for select
using (exists (select 1 from events e where e.id = event_id and e.status = 'published'));

create policy "Users can view own bookings"
on bookings for select
using (auth.uid() = user_id);

create policy "Users insert own bookings"
on bookings for insert
with check (auth.uid() = user_id);

create policy "Users view own booking_items"
on booking_items for select
using (exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid()));

create policy "Users view own payments"
on payments for select
using (exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid()));

-- Seed example venue & event (optional)
insert into venues(name, city, capacity) values ('Downtown Hall', 'Ann Arbor', 500);

insert into events(organizer_id, venue_id, title, slug, summary, category, tags, image_url,
  start_at, end_at, status, sales_start_at, sales_end_at)
values (
  null, (select id from venues limit 1),
  'Indie Night', 'indie-night', 'Local bands + vibes', 'Music', array['live','indie'],
  'https://picsum.photos/seed/indie/800/400',
  now() + interval '14 days', now() + interval '14 days 3 hours', 'published',
  now() - interval '1 day', now() + interval '13 days'
);

insert into ticket_types(event_id, name, price_cents, inventory)
select id, 'General Admission', 2500, 100 from events where slug='indie-night';
