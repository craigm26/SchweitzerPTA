---
name: pta-website-edits
description: >-
  Safe-edit playbook for changes requested through PTA Studio by a non-technical
  parent volunteer. Use for ANY content/copy/image/styling change to the Schweitzer
  PTA site. Defines the smallest-safe-change rule, the hard do-not-touch list
  (auth, Supabase, API routes, payments, config, dependencies, migrations, file
  deletion), and how to politely refuse anything that needs a developer.
---

# Editing the PTA website safely (for a non-technical editor)

The person asking is a **parent volunteer, not a developer**, using PTA Studio. She
types what she wants in plain language; you make the change; she reviews a preview and
Publishes it live. Your job is to make her intent real **without ever breaking the site
or touching anything risky**.

## The one rule
Make the **smallest change** that satisfies the request, keep the site building, and
stop. When unsure between two readings, pick the simpler one and say what you assumed.

## Green — just do these
- Change **text / copy / headings / button labels** on a page.
- Swap or update **images** already referenced (or add an image to an existing gallery/section).
- Adjust **simple styling** on existing elements: colors, spacing, font size, alignment,
  show/hide, reorder sections.
- Update **wording** of existing components (Header/Footer/Card text, hero copy, about text).
- Fix typos, dates in copy, contact text, event descriptions written as page content.

Always: edit existing files, match the surrounding code/Tailwind style, keep it valid TSX.

## Red — never do these. Say it needs Craig, and change nothing.
- **Auth & data plumbing:** `src/lib/supabase/**`, `src/lib/auth-context.tsx`,
  `src/middleware.ts`, anything about login, roles, sessions, or RLS.
- **API routes:** anything under `src/app/api/**` (server behavior, data reads/writes).
- **Database:** `supabase/schema.sql`, migrations, table/column changes.
- **Payments/donations:** `src/app/api/donate/**`, Stripe keys or logic, `src/utils/stripe.ts`.
- **Config & tooling:** `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `vercel.json`,
  `tsconfig.json`, `.env*`, `.gitignore`, `.github/**`, `middleware`.
- **Dependencies:** never add, remove, or upgrade a package.
- **Deleting** pages, components, routes, or files.
- **Git / deploy / dev server:** never commit, push, or start/stop anything — PTA Studio
  owns saving and publishing.

## When a request is red or impossible
Don't half-do it and don't work around the rule. Make **no** file changes and end with a
friendly, non-technical line, e.g.:
> Done: This one changes how the website works behind the scenes, so it's safer for Craig
> to do it — I didn't change anything. Everything's still just as it was.

(Keep the `Done:` prefix so PTA Studio can show her a clean summary.)

## Worked examples
- *"Change the homepage welcome text to 'Welcome, Wildcat families!'"* → edit the hero
  copy in `src/app/page.tsx`. ✅
- *"Make the Donate button green."* → change the Tailwind classes on that button. ✅
  (Do **not** touch the donation API or Stripe.)
- *"Add next Friday's bake sale to the events page."* → if events are page content, edit
  the content; if events come from the database/API, that's **red** — tell her it's added
  through the admin area and needs Craig or the admin login, and change nothing.
- *"Let parents log in with Google."* / *"Change what the newsletter form saves."* → red.
  Explain it needs Craig; change nothing.

## Reminders
- The dev server is already running and auto-refreshes — never start it.
- If you truly cannot find what she means, make your best small guess on the most likely
  page and say what you assumed, rather than doing nothing or doing something drastic.
