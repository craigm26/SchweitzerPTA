Schweitzer PTA — Website

This repository contains the Next.js site for the Schweitzer PTA. This document is written for new maintainers and admins: it explains setup, administration tasks, local development, and Vercel deployment.

Quick links: `package.json`, `next.config.ts`, `supabase/schema.sql`, `src/lib/supabase/client.ts`, `src/app/admin`

Table of contents
- Project setup
- Environment variables
- Local development
- Admin responsibilities (Supabase + app admin UI)
- Deployment to Vercel
- Troubleshooting & common tasks

## Project setup (prerequisites)

- Node.js (LTS) and `npm` installed. Recommended: Node 20.x.
- A Supabase project for the production database. See `supabase/schema.sql`.
- (Optional) Vercel account for hosting.

## Environment variables

Create a `.env.local` in the project root with at least:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Other secret keys (Stripe, third-party APIs) should also be stored in `.env.local` for local development and set in Vercel for production.

## Local development

1. Install dependencies:

```powershell
npm install
```

2. Run development server:

```powershell
npm run dev
# open http://localhost:3000
```

3. Build for production (to validate):

```powershell
npm run build
npm start
```

Files to know:
- `src/lib/supabase/client.ts` — client creation using `NEXT_PUBLIC_SUPABASE_*` env vars.
- `src/app/admin` — UI and pages for site administrators.
- `src/app/news`, `src/app/calendar`, `src/app/sponsors`, `src/app/volunteer` — content pages and admin APIs.

## Admin responsibilities

1. Supabase setup
   - Run the SQL in `supabase/schema.sql` inside Supabase SQL Editor to create tables and policies.
   - Seed data (optional) — uncomment seed sections in `supabase/schema.sql` and re-run.

2. Creating admin users
   - Via Supabase Dashboard → Authentication → Users: create user and then in `profiles` table set `role = 'admin'`.
   - Or run SQL: `UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';`

3. Managing content
   - Editors/admins can use the admin UI (`/admin`) to create/update news, events, sponsors, and volunteers.
   - Server API routes under `src/app/api/*` provide endpoints used by the admin UI. Use them for scripted imports or integrations.

4. Row Level Security (RLS)
   - RLS is enabled for tables. Admin/editor roles are required for write operations. If you hit RLS errors, verify policies and the user's `role` in `profiles`.

## Deployment to Vercel

Two common flows: Git integration (recommended) or Vercel CLI.

1. GitHub → Vercel (recommended)
   - Push repository to GitHub (or Git provider).
   - Import the repository into Vercel (New Project → Import Git Repository).
   - Under Project Settings → Environment Variables add the same values as `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (set for Production, Preview, Development).
   - Vercel auto-detects Next.js. Build command: `npm run build`. Output: `.next` (default).

2. Vercel CLI quick deploy
   - Install CLI: `npm i -g vercel`
   - Login: `vercel login`
   - From project root: `vercel --prod`
   - Add env vars via CLI if needed: `vercel env add NEXT_PUBLIC_SUPABASE_URL production`

Security note: never expose a Supabase `service_role` key to the client. Keep it server-only (Vercel Environment Variables) and use serverless functions for privileged operations.

## Common maintenance tasks

- Update Node version: change on local machine and set the same Node version in Vercel (Project → General → Environment → Node.js version).
- Run DB migrations / schema updates: apply changes to `supabase/schema.sql` using Supabase SQL Editor.
- Rotate keys: update `.env.local` locally and update Vercel Environment Variables; redeploy.

## Troubleshooting

- `Invalid API key` — verify you're using the anon key in client envs and `service_role` only on the server.
- Build failures locally: run `npm run build` and look at the first error; missing env vars are a common cause.
- RLS / permission denials: check `profiles.role` and Supabase policies.

## Contact / Handover notes

- Owner / primary admin: update this section with contact details.
- For changes to the public site content, prefer using the Admin UI rather than direct DB edits.

---

If you want, I can also:
- add a short `vercel.json` or a GitHub Actions workflow for CI/CD,
- create a `DEPLOY.md` with step-by-step Vercel import screenshots.
