# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Schweitzer Elementary PTA website built with Next.js 16, React 19, TypeScript, Supabase, and Tailwind CSS 4. Deployed on Vercel.

## ⚠️ Editing via PTA Studio — guardrails (READ FIRST)

Most changes here are now requested by a **non-technical parent volunteer** through
**PTA Studio** — a chat tool that runs you headlessly in this repo to make a change,
show it on a dev preview, and let her Publish it to the live site. When you are making
a change (you almost always are), follow these rules:

**Do**
- Make the **smallest** change that satisfies the request. Prefer editing existing
  content/components over adding anything new.
- Edit page **content, copy, text, images, and simple styling/layout** of existing pages
  and components.
- Keep the site **building and working** at all times — valid TSX, no broken imports,
  no half-finished edits.
- If the request is ambiguous, make one reasonable choice and **state the assumption**
  in plain language.
- Finish with **one short, non-technical sentence** starting `Done:` that says what you
  changed and which page to look at.

**Never do these — they need Craig. Refuse simply and make no changes:**
- Don't touch auth / data plumbing: `src/lib/supabase/**`, `src/lib/auth-context.tsx`,
  `src/middleware.ts`, RLS, or `supabase/schema.sql` (no migrations).
- Don't edit **API routes** (`src/app/api/**`) — server/backend behavior.
- Don't touch **payments/donations**: `src/app/api/donate/**`, Stripe code, `src/utils/stripe.ts`.
- Don't change **config/tooling**: `package.json`, `pnpm-lock.yaml`, `next.config.ts`,
  `vercel.json`, `tsconfig.json`, `.env*`, `.gitignore`, anything in `.github/`.
- Don't add, remove, or upgrade **dependencies** (no new packages).
- Don't **delete** pages, components, or files.
- Don't run git / commit / push, and don't start or stop the dev server — PTA Studio
  handles saving and publishing.
- Don't change the admin role/permission logic.

If a request can't be done safely within these rules, don't force it — say in one
friendly sentence that this one needs Craig, and change nothing. Full playbook +
examples: `.claude/skills/pta-website-edits/SKILL.md`.

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
Current routes: `analytics`, `auction-items`, `auth/*`, `calendar`, `contact`,
`documents`, `donate` (Stripe), `donors`, `events`, `fundraisers`, `news`,
`newsletter-subscriptions`, `photos`, `upload`, `users`, `volunteer-events`,
`volunteers`, `volunteer-shifts`. (These are server/backend — off-limits to PTA Studio edits.)

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
