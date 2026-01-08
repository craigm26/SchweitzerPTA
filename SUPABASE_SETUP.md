# Supabase Setup Guide for Schweitzer PTA Website

This guide will walk you through setting up Supabase for the Schweitzer PTA website.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization and enter:
   - **Project Name**: `schweitzer-pta`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for setup to complete

## 2. Get Your API Keys

1. In your Supabase dashboard, go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (safe to use in browser)

## 3. Set Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

For Vercel deployment, add these in your Vercel project settings:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add both variables for Production, Preview, and Development

## 4. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/schema.sql` and paste it
4. Click "Run" to create all tables and policies

## 5. Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Optionally configure:
   - **Confirm email**: Enable if you want email verification
   - **Password requirements**: Set minimum length, etc.

## 6. Create Your First Admin User

### Option A: Via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter email and password
4. After creating, go to **Table Editor** → **profiles**
5. Find your user and change `role` to `admin`

### Option B: Via SQL

```sql
-- After the user signs up, update their profile to admin
UPDATE public.profiles 
SET role = 'admin', full_name = 'Your Name'
WHERE email = 'your-email@example.com';
```

## 7. Add Sample Data (Optional)

Uncomment the seed data section at the bottom of `supabase/schema.sql` and run it to populate the database with sample donors, events, and volunteer opportunities.

## Database Tables Overview

| Table | Description |
|-------|-------------|
| `profiles` | User profiles with roles (admin, editor, member) |
| `news` | News articles with status (draft, published, archived) |
| `events` | Upcoming events and activities |
| `donors` | Business donors and community partners |
| `volunteer_opportunities` | Volunteer positions available |
| `volunteer_signups` | People who signed up for volunteer spots |
| `contact_submissions` | Contact form submissions |

## Row Level Security (RLS)

All tables have Row Level Security enabled:

- **Public data** (published news, active donors, events) is readable by everyone
- **Admin data** (drafts, all users, submissions) requires authentication
- **Write operations** require appropriate role (admin or editor)

## API Routes

| Endpoint | Methods | Auth Required | Description |
|----------|---------|---------------|-------------|
| `/api/news` | GET, POST, PUT, DELETE | Write: Yes | Manage news articles |
| `/api/calendar` | GET, POST, PUT, DELETE | Write: Yes | Manage events |
| `/api/donors` | GET, POST, PUT, DELETE | Write: Yes | Manage donors |
| `/api/volunteers` | GET, POST | Write: Yes | Manage volunteer opportunities |
| `/api/volunteers/signup` | POST | No | Submit volunteer signup |
| `/api/contact` | GET, POST | Read: Yes | Contact form submissions |
| `/api/users` | GET, PUT | Admin only | Manage user roles |
| `/api/auth/login` | POST | No | User login |
| `/api/auth/logout` | POST | Yes | User logout |
| `/api/auth/user` | GET | No | Get current user info |

## Troubleshooting

### "Invalid API key" error

- Double-check your environment variables
- Make sure you're using the `anon` key, not the `service_role` key

### Users can't access admin

- Verify the user exists in the `profiles` table
- Check that their `role` is set to `admin` or `editor`

### RLS policy errors

- Make sure the schema.sql was run completely
- Check that all policies were created in **Authentication** → **Policies**

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Vercel Deployment

The app is configured to work with Vercel:

1. Push your code to GitHub
2. Import the repo in Vercel
3. Add environment variables
4. Deploy!

The Supabase client will automatically use your environment variables.
