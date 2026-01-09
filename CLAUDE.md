# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Schweitzer Elementary PTA website built with Next.js 16, React 19, TypeScript, Supabase, and Tailwind CSS 4. Deployed on Vercel.

## Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run test         # Run Vitest unit tests
npm run coverage     # Run tests with coverage report
```

E2E tests use Playwright (`e2e/` directory) but require a running dev server and database.

## Architecture

### Directory Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Shared React components (Header, Footer, Button, Card)
- `src/lib/` - Core utilities and Supabase client code
- `src/lib/supabase/` - Supabase client (browser), server, middleware, and TypeScript types
- `supabase/schema.sql` - Database schema with RLS policies

### Data Flow
- **Browser**: `src/lib/supabase/client.ts` creates browser client via `@supabase/ssr`
- **Server**: `src/lib/supabase/server.ts` creates server client with cookie handling
- **API wrapper**: `src/lib/api.ts` provides typed fetch functions for all entities (news, events, donors, volunteers, users, contact)
- **Auth context**: `src/lib/auth-context.tsx` provides `useAuth()` hook with user/profile state

### API Routes (`src/app/api/`)
All routes follow REST conventions: GET, POST, PUT, DELETE on the same endpoint.
- `/api/news`, `/api/calendar`, `/api/donors`, `/api/volunteers`, `/api/users`, `/api/contact`, `/api/auth/*`

### Database Tables (Supabase)
- `profiles` - User profiles with roles (admin, editor, member)
- `news` - Articles with status (draft, published, archived, scheduled)
- `events` - Calendar events
- `donors` - Business donors/sponsors
- `volunteer_opportunities` - Volunteer positions
- `volunteer_signups` - Signup records
- `contact_submissions` - Contact form entries

Row Level Security (RLS) is enabled on all tables. Admin/editor roles required for write operations.

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Key Patterns

- API routes use Next.js App Router conventions (`route.ts` files)
- Server components fetch data via Supabase server client
- Client components use the `useAuth()` hook for authentication state
- Admin pages are under `/admin` with role-based access control
- Stripe integration for donations (`@stripe/stripe-js`)
