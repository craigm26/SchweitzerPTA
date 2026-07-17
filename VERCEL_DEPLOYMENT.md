# Vercel Deployment Guide

How the Schweitzer PTA website builds and deploys on Vercel. Last verified against the
repo on 2026-07-16.

## How deploys happen

Deployment is **Git integration**: push to `main` on GitHub and Vercel builds and deploys
automatically. There is no `vercel` CLI step and no GitHub Actions workflow — Vercel *is*
the CI/CD here.

```bash
git push origin main   # Vercel auto-builds & deploys
```

(The PTA Studio kiosk's **Publish** button does exactly this `git push` under the hood.)

Vercel installs with **pnpm** (detected from `pnpm-lock.yaml`) and runs `next build`. There
is **no `postinstall` script** — native modules are handled by config, not an install hook
(see below). To redeploy without a new commit: Vercel Dashboard → *Deployments* → **Redeploy**.

Before pushing, it's cheapest to catch failures locally:

```bash
pnpm build   # production build (next build)
pnpm lint
```

## Environment variables

Set these in the Vercel dashboard → *Settings → Environment Variables* (per Production /
Preview / Development). Never commit them; `.env*` and `.vercel` are gitignored. Locally
they live in `.env.local` (also gitignored; `pnpm exec vercel env pull` can fetch them).

**Required**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon (public) key

**Used by specific features (set if that feature is on)**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — client-side donations checkout
- `STRIPE_SECRET_KEY` — server-side donations (`/api/donate`)
- `RESEND_API_KEY` — transactional email
- `SITE_EMAIL_FROM_VOLUNTEER_SIGNUP`, `SITE_EMAIL_REPLY_TO`, `SITE_EMAIL_CC` — email addressing

Only variables prefixed `NEXT_PUBLIC_` are exposed to the browser — that correctly includes
the Stripe **publishable** key. Everything else (`STRIPE_SECRET_KEY`, `RESEND_API_KEY`,
`SITE_EMAIL_*`) is server-only and must **never** be prefixed `NEXT_PUBLIC_`. A missing
runtime var fails at request time, not build time — check the environment if a page 500s.

## Build configuration

**`vercel.json`**
- `framework: "nextjs"`, region pinned `iad1` (US East).
- API routes (`src/app/api/**/*.ts`) capped at **`maxDuration` 30s**. Anything longer needs a
  background job, not a bigger timeout.

**`next.config.ts`**
- `reactStrictMode: true`.
- `compiler.removeConsole` in production (keeps `error`/`warn`).
- Image optimization: AVIF/WebP; remote patterns for Supabase storage, Google favicons,
  icon.horse, and Clearbit logos.
- **Native-module handling (this is what replaced the old postinstall script):**
  - `serverExternalPackages: ['@napi-rs/canvas', 'pdfjs-dist', 'sharp']` — these ship
    platform-specific `.node` bindings; keeping them external stops the bundler from breaking
    on them.
  - `outputFileTracingIncludes` force-includes the pdfjs worker for `/api/events/upload-flyer`
    (pdfjs v5 imports it dynamically, so Vercel's tracer misses it). It globs the **real pnpm
    store path** (`node_modules/.pnpm/pdfjs-dist@*/…/pdf.worker.mjs`), **not** the symlinked
    `node_modules/pdfjs-dist` — packaging the symlink causes an "invalid deployment package" error.

**`package.json`**
- `optionalDependencies: { "@rollup/rollup-win32-x64-msvc": … }`. The lockfile is authored on
  Windows, so Windows-only native binaries must sit in **`optionalDependencies`** — the Linux
  Vercel install skips them gracefully while pnpm pulls the matching Linux binaries via the
  upstream packages' own optionalDependencies. **Never** move a `*-win32-*` binary into regular
  `dependencies` — that breaks the Linux build.
- No `postinstall` script, and `scripts/` contains only `check-env.js` and `dev.js`.

Keep **`pnpm-lock.yaml` in sync** — Vercel installs from it, and a stale lockfile fails the build.

## Database (Supabase)

The site reads/writes Supabase. Ensure schema + RLS are in place (`supabase/schema.sql`,
`supabase/migrations/`) and at least one admin user exists. See `SUPABASE_SETUP.md`.

## Troubleshooting

**Build fails on a native module** (`@napi-rs/canvas`, `sharp`, `pdfjs-dist`, rollup/oxide/
lightningcss binaries) — almost always one of:
- a `*-win32-*` binary landed in `dependencies` instead of `optionalDependencies`;
- the pdfjs worker tracer/symlink issue (see `next.config.ts` note above);
- a stale `pnpm-lock.yaml`.
Open the Vercel build log; the failing line names the module.

**A route times out** — the 30s `maxDuration` cap in `vercel.json`; move long work to a
background job.

**Env var "not working"** — confirm the `NEXT_PUBLIC_` prefix for anything the browser needs,
and that it's set for the right environment (Production). Redeploy after adding one.

**Image won't load** — check the Supabase storage bucket and the `remotePatterns` in
`next.config.ts`.

## After deploy

Watch the newest deployment reach **Ready** (a red "Error" means a failed build — production
keeps serving the previous good deploy, so the live site is never broken by a bad build).
Then exercise a route that touches the native path — the flyer upload / PDF-thumbnail route
`/api/events/upload-flyer` is the canary (it's the one that broke repeatedly).

## Related docs
- `README_ADMIN.md` — admin usage
- `SUPABASE_SETUP.md` — database setup
- `CLAUDE.md` — repo overview + PTA Studio editing guardrails
