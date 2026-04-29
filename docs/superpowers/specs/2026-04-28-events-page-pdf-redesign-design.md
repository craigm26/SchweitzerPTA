# Events Page PDF Flyers + Fundraiser-Style Redesign

**Date:** 2026-04-28
**Scope:** Public `/events` page and `/admin/events` panel.

## Problem

The public `/events` page currently shows a calendar widget, an event list, and a sidebar. There is no way to attach a printable flyer to an event, and the layout does not match the cleaner fundraiser-style cards used elsewhere on the site.

## Goals

1. Let admins upload a PDF flyer per event from the events admin panel.
2. Show that PDF as a clickable thumbnail on the public events page (first-page preview rendered server-side at upload time).
3. Replace the existing events page layout with a fundraiser-style card list.
4. Remove the calendar widget from the events page.

## Non-goals

- Multiple PDFs per event. One flyer per event.
- Inline PDF viewer / embedded reader. Clicking the thumbnail or the action button opens the PDF in a new tab.
- Touching the `/calendar` page or the `calendar_events` table (separate concern).
- Wiring up the RSVP / Share buttons (they were never wired up; they get removed).
- Lightbox for the thumbnail. The thumbnail is a preview; the real artifact is the PDF.

## Architecture

### Schema change (`events` table)

Three nullable columns:

```sql
ALTER TABLE public.events
  ADD COLUMN pdf_url TEXT,
  ADD COLUMN pdf_filename TEXT,
  ADD COLUMN pdf_thumbnail_url TEXT;
```

- `pdf_url` — public URL of the uploaded PDF in Supabase Storage.
- `pdf_filename` — original filename (used as the link's `download` attribute / tooltip).
- `pdf_thumbnail_url` — public URL of the auto-generated first-page PNG.

All three are optional. Existing rows are unaffected. The pre-existing `image` column stays as-is for events that don't have a flyer.

### Storage

Reuse the existing `documents` Supabase Storage bucket for both the PDF and the rendered PNG thumbnail. No new bucket, no new RLS — the bucket already accepts `application/pdf` and image MIME types up to 10MB. Filenames stay timestamp-prefixed (matches the convention in `/api/upload/route.ts`).

### Upload endpoint: `POST /api/events/upload-flyer`

New auth-gated route that handles upload + render + thumbnail upload in one round trip.

Request: `multipart/form-data` with a single `file` field.

Steps:
1. `supabase.auth.getUser()` — return 401 if no session.
2. Validate `file.type === 'application/pdf'` and `file.size <= 10 * 1024 * 1024`.
3. Upload the PDF to the `documents` bucket → capture public URL.
4. Render the **first page** of the PDF to a PNG using `pdfjs-dist` (Node legacy build) + `@napi-rs/canvas`.
5. Upload the PNG to the `documents` bucket → capture public URL.
6. Return `{ pdf_url, pdf_filename, pdf_thumbnail_url }`.

**Failure mode:** if step 4 or 5 fails, log the error but still return a 200 with `pdf_thumbnail_url: null`. The PDF upload is the primary artifact; the thumbnail is a cosmetic preview, and a render failure should not block the admin from saving the event. The public page falls back to `image` / placeholder when the thumbnail is missing.

**Why a dedicated route** instead of extending `/api/upload`: keeps the existing upload route a simple file-pass-through, isolates the heavier PDF-render dependency, and gives a focused endpoint to harden later.

**Dependencies:**
- `pdfjs-dist` — JS-only PDF parser/renderer (Mozilla's PDF.js). Use the legacy build for Node compatibility.
- `@napi-rs/canvas` — Vercel-friendly native canvas backend. Pure prebuilt binaries; no system libs (poppler, cairo) needed.

### Public events API (`/api/events`)

Add `pdf_url`, `pdf_filename`, `pdf_thumbnail_url` to the insert/update payloads in `src/app/api/events/route.ts` (`POST` and `PUT`). `GET` already does `select('*')` and will return them automatically.

### Type updates (`src/lib/api.ts`)

Extend the `Event` interface with the three new fields (all `string | null`) and the `createEvent` / `updateEvent` argument types accordingly.

### Admin events panel (`src/app/admin/events/page.tsx`)

In the Add/Edit modal, add a PDF upload section above the existing "Image URL" field. The "Image URL" field stays — it remains the cover-image source for events without a flyer.

UI states (modeled on the documents admin dropzone in `src/app/admin/documents/page.tsx`):
- **Empty:** dashed dropzone, "Click to upload a flyer (PDF, max 10MB)".
- **Uploading:** spinner + "Uploading…" / "Generating preview…".
- **Filled:** small thumbnail preview + filename + "Replace" and "Remove" buttons. "Remove" clears `pdf_url`, `pdf_filename`, `pdf_thumbnail_url` on the form (the actual storage objects are not deleted — that's a separate cleanup concern out of scope).

The form's `formData` state grows three fields: `pdf_url`, `pdf_filename`, `pdf_thumbnail_url`. `handleSubmit`, `openAddModal`, `openEditModal`, and `closeModal` all initialize / pass these through.

### Public events page (`src/app/events/page.tsx`)

Replace the page body. Hero stays (orange "Subscribe to Events" button included).

**Removed:**
- Calendar widget and its month nav (`generateCalendarDays`, `prevMonth`, `nextMonth`, `currentMonth` state, the calendar grid).
- Right sidebar (Community Partners card + Newsletter signup).
- The 3-column grid layout.
- Donor fetch (`getDonors`, `donors` state).

**New layout** — mirrors `/fundraisers`:
- Centered container, `max-w-6xl`, vertical stack of cards with `gap-6`.
- Each card: `grid grid-cols-1 md:grid-cols-[280px_1fr]`, `rounded-2xl`, border, shadow.

**Card contents:**

Image column (280px):
- If `pdf_thumbnail_url` → render `<img>` wrapped in an `<a href={pdf_url} target="_blank">`. Cursor pointer, subtle hover overlay.
- Else if `image` → render `<img>`, not clickable.
- Else → placeholder: "No flyer available" centered, matches fundraiser empty-image state.

Content column:
- Top row: date pill (`APR 28` style, primary color) + title + Featured badge (when `is_featured`).
- Description (full text — events typically have short descriptions, and the fundraiser cards don't clamp).
- Metadata row: time range (`formatEventTimeRange` — kept) + location, with material icons.
- Action row: if `pdf_url`, render a "View Flyer (PDF)" button styled like the fundraiser "Visit Fundraiser" button (`open_in_new` icon, opens in new tab). If no `pdf_url`, no button.

**State / data:** only `events` and `loading`. The `formatEventTimeRange`, `formatTime12Hour`, `getPacificTimeZoneLabel`, `getEventEndDate`, and date-parsing helpers stay (still used). `generateCalendarDays`, `formatMonthYear`, `prevMonth`, `nextMonth`, `currentMonth`, `isEventOnDate`, donor fetching, and `donors` state all go.

## Display priority on the card

1. `pdf_thumbnail_url` (preferred when a PDF is attached).
2. `image` (existing field, fallback for events without a PDF).
3. Placeholder.

## Files to change

- `supabase/migrations/<new>_events_pdf_flyer.sql` — new migration for the three columns.
- `src/lib/supabase/types.ts` — add the three columns to the `events` table type.
- `src/lib/api.ts` — extend `Event` interface and `createEvent` / `updateEvent` signatures.
- `src/app/api/events/route.ts` — pass new fields through `POST` and `PUT`.
- `src/app/api/events/upload-flyer/route.ts` — **new file**, PDF upload + thumbnail render endpoint.
- `src/app/admin/events/page.tsx` — add PDF upload UI to the modal, extend form state.
- `src/app/events/page.tsx` — full body rewrite to fundraiser-style cards; remove calendar + sidebar.
- `package.json` — add `pdfjs-dist` and `@napi-rs/canvas`.

## Testing

- E2E (Playwright) is out of scope for this spec — existing tests should still pass since the public route is unchanged at the URL level.
- Unit tests for the PDF render path are nice-to-have but not required (the upload route depends on native canvas, hard to unit-test cleanly). Manual verification:
  1. Upload a multi-page PDF in admin → confirm thumbnail PNG appears in storage.
  2. Save event → confirm the public events page shows the thumbnail and the "View Flyer (PDF)" button opens the PDF.
  3. Save an event without a PDF → confirm fallback to `image` works, then to placeholder.
  4. Upload a corrupted PDF → confirm event still saves with `pdf_url` set and `pdf_thumbnail_url` null.

## Open questions / future work

- **Storage cleanup:** removing a flyer in admin clears the form fields but leaves the underlying objects in Supabase Storage. Out of scope for this change; can be addressed later with a delete-on-replace hook or a janitor job.
- **Thumbnail dimensions:** PNG at PDF page's natural resolution scaled to ~600px wide is plenty for a 280px display column. Final scale factor to be picked during implementation.
