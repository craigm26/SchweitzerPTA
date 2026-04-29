# Events Page PDF Flyers + Fundraiser-Style Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-event PDF flyer uploads with auto-generated thumbnails, restyle the public events page to match the fundraiser layout, and ship a small batch of related cleanups (full descriptions on calendar/events, remove the "Join the PTA" home-page button, drop the school-year hero pill).

**Architecture:** Three nullable columns on `public.events` (`pdf_url`, `pdf_filename`, `pdf_thumbnail_url`). A new auth-gated route `/api/events/upload-flyer` accepts the PDF, uploads it to the existing `documents` Supabase Storage bucket, renders the first page to a PNG with `pdfjs-dist` + `@napi-rs/canvas`, uploads the PNG, and returns all three URLs. The admin events modal gets a PDF dropzone next to the existing image-URL field. The public `/events` page is rewritten in the style of `/fundraisers` (single-column card list, 280px image column, no calendar, no sidebar).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase (Postgres + Storage), Tailwind CSS 4, `pdfjs-dist` (legacy build), `@napi-rs/canvas` (Vercel-friendly native canvas).

**Spec:** `docs/superpowers/specs/2026-04-28-events-page-pdf-redesign-design.md`

---

## File map

| Path | Purpose |
| --- | --- |
| `supabase/migrations/20260428_events_pdf_flyer.sql` | **Create** — adds `pdf_url`, `pdf_filename`, `pdf_thumbnail_url` to `public.events` |
| `src/lib/supabase/types.ts` | **Modify** — extend `events` table types (Row/Insert/Update) with the three PDF columns |
| `src/lib/api.ts` | **Modify** — extend `Event` interface and `createEvent` / `updateEvent` arg types |
| `src/app/api/events/route.ts` | **Modify** — pass new fields through `POST` and `PUT` |
| `src/app/api/events/upload-flyer/route.ts` | **Create** — auth-gated PDF upload + first-page-render endpoint |
| `src/app/admin/events/page.tsx` | **Modify** — add PDF upload UI to the Add/Edit modal, extend form state |
| `src/app/events/page.tsx` | **Rewrite body** — fundraiser-style cards, drop calendar/sidebar/school-year pill |
| `src/app/calendar/page.tsx` | **Modify** — drop `line-clamp-2` from event description |
| `src/app/page.tsx` | **Modify** — remove "Join the PTA" Link/Button block + now-unused imports |
| `package.json` / `package-lock.json` | **Modify** — add `pdfjs-dist`, `@napi-rs/canvas` |

---

## Task 1: Database migration for PDF columns

**Files:**
- Create: `supabase/migrations/20260428_events_pdf_flyer.sql`

- [ ] **Step 1: Create the migration file**

Write to `supabase/migrations/20260428_events_pdf_flyer.sql`:

```sql
-- Migration: Add PDF flyer columns to events table
-- For the events page redesign: each event can optionally have a PDF flyer
-- with an auto-generated first-page thumbnail.

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS pdf_filename TEXT,
  ADD COLUMN IF NOT EXISTS pdf_thumbnail_url TEXT;
```

- [ ] **Step 2: Apply the migration to Supabase**

Apply via the Supabase MCP `apply_migration` tool with name `20260428_events_pdf_flyer` and the SQL body above. Alternatively run `npx supabase db push` if the local Supabase CLI is wired up.

Expected: success response, no errors.

- [ ] **Step 3: Verify columns exist**

Run via Supabase MCP `execute_sql`:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'events'
  AND column_name IN ('pdf_url', 'pdf_filename', 'pdf_thumbnail_url')
ORDER BY column_name;
```

Expected: 3 rows, all `text` and `YES` for `is_nullable`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260428_events_pdf_flyer.sql
git commit -m "feat(events): add pdf_url, pdf_filename, pdf_thumbnail_url columns"
```

---

## Task 2: Install PDF rendering dependencies

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install dependencies**

```bash
npm install pdfjs-dist @napi-rs/canvas
```

Expected: both packages added to `dependencies` in `package.json`. `@napi-rs/canvas` ships prebuilt binaries; no native compilation step.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(events): add pdfjs-dist and @napi-rs/canvas for flyer thumbnails"
```

---

## Task 3: Update TypeScript types for new columns

**Files:**
- Modify: `src/lib/supabase/types.ts:59-102` (the `events` table block)
- Modify: `src/lib/api.ts:647-662` (the `Event` interface) and `src/lib/api.ts:132-153` (`createEvent` / `updateEvent` signatures)

- [ ] **Step 1: Extend the `events` table types in `src/lib/supabase/types.ts`**

Find the `events` table block (currently at lines 59-102) and add the three PDF columns to all three of `Row`, `Insert`, and `Update`. After the change, the block should read:

```ts
events: {
  Row: {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    end_time: string | null;
    location: string;
    category: string | null;
    image: string | null;
    is_featured: boolean;
    pdf_url: string | null;
    pdf_filename: string | null;
    pdf_thumbnail_url: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: number;
    title: string;
    description: string;
    date: string;
    time: string;
    end_time?: string | null;
    location: string;
    category?: string | null;
    image?: string | null;
    is_featured?: boolean;
    pdf_url?: string | null;
    pdf_filename?: string | null;
    pdf_thumbnail_url?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: number;
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    end_time?: string | null;
    location?: string;
    category?: string | null;
    image?: string | null;
    is_featured?: boolean;
    pdf_url?: string | null;
    pdf_filename?: string | null;
    pdf_thumbnail_url?: string | null;
    created_at?: string;
    updated_at?: string;
  };
};
```

- [ ] **Step 2: Extend the `Event` interface in `src/lib/api.ts`**

Find the existing `Event` interface (currently at lines 647-662) and add three fields after `image`:

```ts
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  end_date: string | null;
  time: string | null;
  end_time: string | null;
  location: string;
  category: string | null;
  image: string | null;
  pdf_url: string | null;
  pdf_filename: string | null;
  pdf_thumbnail_url: string | null;
  is_featured: boolean;
  is_all_day: boolean;
  created_at: string;
  updated_at: string;
}
```

- [ ] **Step 3: Extend `createEvent` arg type**

Replace the existing `createEvent` signature in `src/lib/api.ts` so the argument type accepts the three new optional fields:

```ts
export async function createEvent(data: {
  title: string;
  description: string;
  date: string;
  end_date?: string | null;
  time?: string | null;
  end_time?: string | null;
  location: string;
  category?: string;
  image?: string;
  pdf_url?: string | null;
  pdf_filename?: string | null;
  pdf_thumbnail_url?: string | null;
  is_featured?: boolean;
  is_all_day?: boolean;
}) {
  const res = await fetch(`${API_BASE}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}
```

(`updateEvent` already takes `Record<string, unknown>` and needs no change.)

- [ ] **Step 4: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/supabase/types.ts src/lib/api.ts
git commit -m "feat(events): extend Event types with PDF flyer fields"
```

---

## Task 4: Pass PDF fields through events API

**Files:**
- Modify: `src/app/api/events/route.ts:50-89` (`POST`) and `src/app/api/events/route.ts:91-124` (`PUT`)

- [ ] **Step 1: Add PDF fields to `POST`'s insert**

Replace the body of `POST` in `src/app/api/events/route.ts` so the insert object includes the three new fields. The full updated function:

```ts
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('events')
      .insert({
        title: body.title,
        description: body.description,
        date: body.date,
        end_date: body.end_date || null,
        time: body.time || null,
        end_time: body.end_time || null,
        location: body.location,
        category: body.category,
        image: body.image || null,
        pdf_url: body.pdf_url || null,
        pdf_filename: body.pdf_filename || null,
        pdf_thumbnail_url: body.pdf_thumbnail_url || null,
        is_featured: body.is_featured || false,
        is_all_day: body.is_all_day || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
```

- [ ] **Step 2: Verify `PUT` already passes through unknown fields**

`PUT` does `const { id, ...updateData } = body;` and passes `updateData` straight to `.update()`. That already handles the three new optional fields without code changes — Supabase will ignore unknown columns and accept known ones. No change needed.

- [ ] **Step 3: Typecheck and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors, no new warnings.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/events/route.ts
git commit -m "feat(events): pass pdf_url, pdf_filename, pdf_thumbnail_url through events API"
```

---

## Task 5: Create the PDF flyer upload endpoint

**Files:**
- Create: `src/app/api/events/upload-flyer/route.ts`

- [ ] **Step 1: Write the new route file**

Create `src/app/api/events/upload-flyer/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCanvas, DOMMatrix } from '@napi-rs/canvas';

// pdfjs-dist's Node legacy build needs a few browser-only globals to exist.
// @napi-rs/canvas provides a compatible DOMMatrix.
type GlobalShim = typeof globalThis & { DOMMatrix?: unknown };
const g = globalThis as GlobalShim;
if (!g.DOMMatrix) g.DOMMatrix = DOMMatrix;

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
const THUMBNAIL_SCALE = 1.5;
const BUCKET = 'documents';

async function renderFirstPageToPng(pdfBuffer: ArrayBuffer): Promise<Buffer | null> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(pdfBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const doc = await loadingTask.promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: THUMBNAIL_SCALE });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    await page.render({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      canvasContext: context as any,
      viewport,
    }).promise;
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('PDF thumbnail render failed:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 },
      );
    }

    const pdfBuffer = await file.arrayBuffer();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const timestamp = Date.now();
    const pdfPath = `event-flyers/${timestamp}-${safeName}`;

    const { error: pdfUploadError } = await supabase.storage
      .from(BUCKET)
      .upload(pdfPath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (pdfUploadError) {
      console.error('PDF upload failed:', pdfUploadError);
      return NextResponse.json({ error: pdfUploadError.message }, { status: 500 });
    }

    const { data: { publicUrl: pdf_url } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(pdfPath);

    // Best-effort thumbnail render. A failure here does not fail the request.
    const pngBuffer = await renderFirstPageToPng(pdfBuffer);
    let pdf_thumbnail_url: string | null = null;

    if (pngBuffer) {
      const thumbBaseName = safeName.replace(/\.pdf$/i, '') || 'flyer';
      const thumbPath = `event-flyers/${timestamp}-${thumbBaseName}-thumb.png`;
      const { error: thumbUploadError } = await supabase.storage
        .from(BUCKET)
        .upload(thumbPath, pngBuffer, {
          contentType: 'image/png',
          upsert: false,
        });

      if (thumbUploadError) {
        console.error('Thumbnail upload failed:', thumbUploadError);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(thumbPath);
        pdf_thumbnail_url = publicUrl;
      }
    }

    return NextResponse.json({
      pdf_url,
      pdf_filename: file.name,
      pdf_thumbnail_url,
    });
  } catch (error: unknown) {
    console.error('Error in event flyer upload:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Typecheck and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors. (If `pdfjs-dist/legacy/build/pdf.mjs` types complain, the dynamic `await import()` will still work at runtime — fall back to `// @ts-expect-error` on the import line and proceed.)

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
```

In another shell, log in as an admin in the browser, then exercise the route from the browser DevTools console while signed in:

```js
const fd = new FormData();
fd.append('file', /* pick a small PDF File handle, e.g. via <input type=file> */);
const res = await fetch('/api/events/upload-flyer', { method: 'POST', body: fd });
console.log(await res.json());
```

Expected: 200 response with `{ pdf_url, pdf_filename, pdf_thumbnail_url }` (the thumbnail URL may be `null` if rendering failed; the PDF URL must be present).

- [ ] **Step 4: Commit**

```bash
git add src/app/api/events/upload-flyer/route.ts
git commit -m "feat(events): add /api/events/upload-flyer route with PDF thumbnail render"
```

---

## Task 6: Add PDF upload UI to the admin events modal

**Files:**
- Modify: `src/app/admin/events/page.tsx`

- [ ] **Step 1: Add PDF state and ref to the component**

Near the top of `EventManagementPage`, add a `useRef` import alongside the existing React imports if not already present. The current import is `import { useEffect, useState } from 'react';` — change it to:

```ts
import { useEffect, useState, useRef } from 'react';
```

Inside the component, just below the existing `useState` declarations and above `useEffect`, add:

```ts
const pdfInputRef = useRef<HTMLInputElement>(null);
const [pdfUploading, setPdfUploading] = useState(false);
```

- [ ] **Step 2: Extend the `formData` shape**

Find the existing `useState` for `formData` (currently with 10 fields starting `title`/`description`/...) and add three new fields. The full updated declaration:

```ts
const [formData, setFormData] = useState({
  title: '',
  description: '',
  date: '',
  end_date: '',
  time: '',
  end_time: '',
  location: '',
  category: 'general',
  image: '',
  pdf_url: '',
  pdf_filename: '',
  pdf_thumbnail_url: '',
  is_featured: false,
  is_all_day: false,
});
```

- [ ] **Step 3: Initialize PDF fields in `openAddModal`**

Update `openAddModal` to seed the new fields with empty strings:

```ts
const openAddModal = () => {
  setFormData({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    end_date: '',
    time: '18:00',
    end_time: '',
    location: '',
    category: 'general',
    image: '',
    pdf_url: '',
    pdf_filename: '',
    pdf_thumbnail_url: '',
    is_featured: false,
    is_all_day: false,
  });
  setEditingEvent(null);
  setShowAddModal(true);
};
```

- [ ] **Step 4: Hydrate PDF fields in `openEditModal`**

Update `openEditModal` to copy existing PDF values from the event:

```ts
const openEditModal = (event: Event) => {
  const isValidTime = event.time && /^\d{2}:\d{2}(:\d{2})?$/.test(event.time);
  const isAllDay = !isValidTime || event.is_all_day;
  setFormData({
    title: event.title,
    description: event.description,
    date: event.date,
    end_date: event.end_date || '',
    time: isValidTime && event.time ? event.time : '',
    end_time: event.end_time && /^\d{2}:\d{2}(:\d{2})?$/.test(event.end_time) ? event.end_time : '',
    location: event.location,
    category: event.category || 'general',
    image: event.image || '',
    pdf_url: event.pdf_url || '',
    pdf_filename: event.pdf_filename || '',
    pdf_thumbnail_url: event.pdf_thumbnail_url || '',
    is_featured: event.is_featured,
    is_all_day: isAllDay,
  });
  setEditingEvent(event);
  setShowAddModal(true);
};
```

- [ ] **Step 5: Add upload + remove handlers**

Add these handlers anywhere among the other handler functions (e.g., right above `openAddModal`):

```ts
const handlePdfSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.type !== 'application/pdf') {
    alert('Only PDF files are allowed');
    if (pdfInputRef.current) pdfInputRef.current.value = '';
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB');
    if (pdfInputRef.current) pdfInputRef.current.value = '';
    return;
  }

  setPdfUploading(true);
  try {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/events/upload-flyer', {
      method: 'POST',
      body: fd,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Upload failed');
    }
    const { pdf_url, pdf_filename, pdf_thumbnail_url } = await res.json();
    setFormData((prev) => ({
      ...prev,
      pdf_url: pdf_url || '',
      pdf_filename: pdf_filename || '',
      pdf_thumbnail_url: pdf_thumbnail_url || '',
    }));
  } catch (error) {
    console.error('Error uploading flyer:', error);
    alert(error instanceof Error ? error.message : 'Failed to upload PDF');
  } finally {
    setPdfUploading(false);
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  }
};

const handlePdfRemove = () => {
  setFormData((prev) => ({
    ...prev,
    pdf_url: '',
    pdf_filename: '',
    pdf_thumbnail_url: '',
  }));
  if (pdfInputRef.current) pdfInputRef.current.value = '';
};
```

- [ ] **Step 6: Pass PDF fields in `handleSubmit`'s payload**

Update the existing `dataToSubmit` block at the top of `handleSubmit`:

```ts
const dataToSubmit = {
  ...formData,
  time: formData.is_all_day ? null : (formData.time || null),
  end_time: formData.is_all_day ? null : (formData.end_time || null),
  end_date: formData.end_date || null,
  pdf_url: formData.pdf_url || null,
  pdf_filename: formData.pdf_filename || null,
  pdf_thumbnail_url: formData.pdf_thumbnail_url || null,
};
```

- [ ] **Step 7: Add the PDF upload UI to the modal form**

In the modal `<form>`, insert a new field block immediately above the existing `<div>` that contains the "Image URL" input (search for `Image URL`). Insert this JSX:

```tsx
<div>
  <label className="block text-sm font-medium text-[#181411] dark:text-white mb-2">
    Flyer (PDF, optional)
  </label>
  {formData.pdf_url ? (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20">
      {formData.pdf_thumbnail_url ? (
        <img
          src={formData.pdf_thumbnail_url}
          alt=""
          className="w-16 h-20 object-cover rounded border border-gray-200"
        />
      ) : (
        <div className="w-16 h-20 flex items-center justify-center rounded border border-gray-200 bg-white">
          <span className="material-symbols-outlined text-3xl text-gray-400">picture_as_pdf</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#181411] dark:text-white truncate">
          {formData.pdf_filename || 'Flyer'}
        </p>
        <div className="flex gap-3 mt-1">
          <label className="text-xs text-primary font-bold cursor-pointer hover:underline">
            Replace
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              onChange={handlePdfSelect}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={handlePdfRemove}
            className="text-xs text-red-500 font-bold hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:border-primary transition-colors">
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf"
        onChange={handlePdfSelect}
        className="hidden"
        id="pdf-flyer-upload"
      />
      <label
        htmlFor="pdf-flyer-upload"
        className={`cursor-pointer ${pdfUploading ? 'pointer-events-none' : ''}`}
      >
        {pdfUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500">Uploading and rendering preview...</p>
          </div>
        ) : (
          <>
            <span className="material-symbols-outlined text-3xl text-gray-400">upload_file</span>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Click to upload a flyer (PDF, max 10MB)
            </p>
          </>
        )}
      </label>
    </div>
  )}
</div>
```

- [ ] **Step 8: Typecheck and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors, no new warnings.

- [ ] **Step 9: Manual verification**

```bash
npm run dev
```

In the browser:
1. Sign in as admin → go to `/admin/events`.
2. Click "Add New Event" → confirm a "Flyer (PDF, optional)" dropzone is visible above the "Image URL" field.
3. Upload a small PDF → confirm spinner shows, then a thumbnail + filename + Replace/Remove appear.
4. Click "Remove" → confirm the dropzone returns.
5. Re-upload, fill remaining required fields, save → confirm the row appears in the events table.
6. Edit the saved event → confirm the PDF preview is restored.

- [ ] **Step 10: Commit**

```bash
git add src/app/admin/events/page.tsx
git commit -m "feat(admin): add PDF flyer upload to event modal"
```

---

## Task 7: Rewrite the public events page

**Files:**
- Modify: `src/app/events/page.tsx` (whole file, replace contents)

This task replaces the current implementation entirely. The hero stays (minus the school-year pill); the calendar widget, sidebar, donor fetch, and unused helpers all go.

- [ ] **Step 1: Replace `src/app/events/page.tsx` with the new implementation**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { getEvents, Event } from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsData = await getEvents({ upcoming: true });
        setEvents(eventsData || []);
      } catch (error) {
        console.error('Error fetching events data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getDateParts = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: day.toString().padStart(2, '0'),
    };
  };

  const getPacificTimeZoneLabel = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return 'PT';
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      timeZoneName: 'short',
    }).formatToParts(date);
    return parts.find((part) => part.type === 'timeZoneName')?.value ?? 'PT';
  };

  const formatTime12Hour = (time: string) => {
    const match = time.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
    if (!match) return time;
    const hour = Number(match[1]);
    const minute = match[2];
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };

  const formatEventTimeRange = (event: Event) => {
    if (event.is_all_day || !event.time) {
      return 'All Day';
    }
    const tzLabel = getPacificTimeZoneLabel(event.date);
    const start = formatTime12Hour(event.time);
    if (event.end_time) {
      const end = formatTime12Hour(event.end_time);
      return `${start} - ${end} ${tzLabel}`;
    }
    return `${start} ${tzLabel}`;
  };

  if (loading) {
    return (
      <main className="layout-container flex h-full grow flex-col pb-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading events...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="layout-container flex h-full grow flex-col pb-20">
      {/* Hero */}
      <div className="w-full bg-[#181411]">
        <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDe6jw42NH7O6HBK4-_pDgetxwbKwV4vkea4ZUWqNCs5GTreR5TneieFr-c-uwq6-FlXAybVI_T9Dl5_2n1GREGYCuVNkF5dBWrhs37Sd7cZvgea7YLD8y7wyqFwcRuVLTHWiuNmT5cB5Ge9d3Okuys58iW_ifv7uxNGzxJRNjbfGv56j6yiD3FTrEkymsy-hC3jltB2ZHsVuMX6TJG3Yril76y4wq5nwnvI9820utJK1HM3-Hv4KddLzchnVvhCL0FskaRtoU5q-dQ")',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4 max-w-4xl">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Upcoming Events
            </h1>
            <h2 className="text-gray-300 text-base md:text-lg font-normal max-w-2xl">
              Browse upcoming PTA meetings, school spirit days, and community fundraisers. Subscribe to get
              event updates delivered straight to your inbox.
            </h2>
            <div className="mt-4 flex gap-3">
              <button className="flex cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-primary hover:bg-orange-600 text-white text-base font-bold transition-all shadow-lg shadow-orange-900/50">
                <span className="mr-2 material-symbols-outlined text-[20px]">notifications_active</span>
                Subscribe to Events
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-10 lg:px-20 py-10 flex justify-center">
        <div className="flex w-full max-w-6xl flex-col gap-6">
          {events.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#2a221a] rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">event_busy</span>
              <p className="text-gray-500">No upcoming events.</p>
            </div>
          ) : (
            events.map((event) => {
              const { month, day } = getDateParts(event.date);
              const thumbnail = event.pdf_thumbnail_url || event.image;
              const hasPdf = !!event.pdf_url;

              return (
                <div
                  key={event.id}
                  className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a221a] shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
                    {thumbnail ? (
                      hasPdf ? (
                        <a
                          href={event.pdf_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative h-56 md:h-full w-full bg-gray-100 dark:bg-[#1f1a14] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          title="Open flyer (PDF)"
                          aria-label={`Open flyer PDF for ${event.title}`}
                        >
                          <img
                            src={thumbnail}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"></div>
                        </a>
                      ) : (
                        <div className="relative h-56 md:h-full w-full bg-gray-100 dark:bg-[#1f1a14] overflow-hidden">
                          <img
                            src={thumbnail}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )
                    ) : (
                      <div className="relative h-56 md:h-full bg-gray-100 dark:bg-[#1f1a14] flex items-center justify-center text-sm text-gray-400">
                        No flyer available
                      </div>
                    )}
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center min-w-14 px-2 py-1 rounded-md bg-primary/10">
                            <span className="text-primary text-xs font-bold uppercase">{month}</span>
                            <span className="text-[#181411] dark:text-white text-xl font-bold leading-none">
                              {day}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-[#181411] dark:text-white">
                            {event.title}
                          </h3>
                        </div>
                        {event.is_featured && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-md uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {formatEventTimeRange(event)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          {event.location}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed whitespace-pre-line">
                        {event.description}
                      </p>
                      {hasPdf && (
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={event.pdf_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary font-bold hover:bg-primary/20 transition-colors"
                            title={event.pdf_filename || 'View flyer'}
                          >
                            View Flyer (PDF)
                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
```

Note the `whitespace-pre-line` on the description `<p>` — line breaks in admin-entered text are preserved and the description is no longer clamped.

- [ ] **Step 2: Typecheck and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors. (If `next/link` was the only consumer of an unused import elsewhere, lint will catch it — but in this rewrite we removed both `Link` and the donor imports, so the file should be clean.)

- [ ] **Step 3: Manual verification**

```bash
npm run dev
```

In the browser, visit `/events`:
1. Hero — confirm the "School Year YYYY-YYYY" pill is gone; "Subscribe to Events" button still present.
2. Calendar widget and right sidebar — confirm both are gone.
3. Card layout — confirm fundraiser-style 280px image column + content column, full-width container.
4. With at least one event that has a PDF: confirm the thumbnail shows, clicking it opens the PDF in a new tab, and "View Flyer (PDF)" button appears.
5. With at least one event that has no PDF and no image: confirm "No flyer available" placeholder.
6. With at least one event that has an `image` but no PDF: confirm the image renders (not clickable).
7. Description — confirm long descriptions show in full (no 3-line clip), and any blank lines in the description are preserved.

- [ ] **Step 4: Commit**

```bash
git add src/app/events/page.tsx
git commit -m "feat(events): redesign public events page in fundraiser-style cards with PDF support"
```

---

## Task 8: Drop line-clamp on the calendar page event description

**Files:**
- Modify: `src/app/calendar/page.tsx:275`

- [ ] **Step 1: Remove `line-clamp-2`**

Open `src/app/calendar/page.tsx` and find line 275:

```tsx
<p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{event.description}</p>
```

Replace with:

```tsx
<p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line">{event.description}</p>
```

(`whitespace-pre-line` keeps line breaks in admin-entered text, matching the rewritten events page.)

- [ ] **Step 2: Typecheck and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors.

- [ ] **Step 3: Manual verification**

```bash
npm run dev
```

Visit `/calendar` — confirm long descriptions are no longer truncated to two lines.

- [ ] **Step 4: Commit**

```bash
git add src/app/calendar/page.tsx
git commit -m "fix(calendar): show full event descriptions instead of clamping to two lines"
```

---

## Task 9: Remove "Join the PTA" button on the home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Remove the Link/Button block**

Open `src/app/page.tsx`. Delete the entire `<div>` at lines 125-129:

```tsx
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about">
                  <Button size="large">Join the PTA</Button>
                </Link>
              </div>
```

- [ ] **Step 2: Remove now-unused imports**

After deleting the block, both `Link` (line 4) and `Button` (line 6) are unused everywhere else in the file. Remove them:

```ts
// Delete this line:
import Link from 'next/link';
// Delete this line:
import Button from '@/components/Button';
```

The remaining imports stay:

```ts
import { FormEvent, useState } from 'react';
import Image from 'next/image';
```

- [ ] **Step 3: Typecheck and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors, no `unused import` warnings.

- [ ] **Step 4: Manual verification**

```bash
npm run dev
```

Visit `/` — confirm the "Join the PTA" button is gone, and the newsletter subscribe form below it still renders correctly.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "chore(home): remove Join the PTA CTA button"
```

---

## Final verification

- [ ] **Build the whole thing**

```bash
npm run build
```

Expected: build succeeds with no type errors and no new warnings.

- [ ] **Run the unit test suite**

```bash
npm run test -- --run
```

Expected: all existing tests still pass. (No new tests in this plan; the spec calls out manual verification as the testing strategy.)

- [ ] **End-to-end smoke**

In a fresh browser session, walk through:
1. `/` — no Join-the-PTA button.
2. `/calendar` — descriptions show fully.
3. `/admin/events` — upload a flyer, save an event, edit it, remove the flyer, save again.
4. `/events` — fundraiser-style cards, working PDF thumbnail click-through, "View Flyer (PDF)" button, descriptions in full.
