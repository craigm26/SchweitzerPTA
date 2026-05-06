'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  getPhotos,
  getEvents,
  getCalendarEvents,
  requestPhotoUploadUrl,
  createPhoto,
  updatePhoto,
  deletePhoto,
  batchUpdatePhotos,
  reorderPhotos,
  createEvent,
  createCalendarEvent,
  photoUrl,
  Photo,
  Event,
  CalendarEvent,
  PhotoEventRefValue,
  PhotoEventSource,
} from '@/lib/api';
import { schoolYearFromDate, isValidSchoolYear, currentSchoolYear } from '@/lib/school-year';
import EventPicker, { EventPickerOption } from '@/components/photos/EventPicker';

// Encode a (source, id) pair for HTML <select> values. e:N = events table,
// c:N = calendar_events table. Filter dropdowns also use 'all' / 'none'.
function encodeRef(ref: PhotoEventRefValue): string {
  return `${ref.source === 'calendar_events' ? 'c' : 'e'}:${ref.id}`;
}
function decodeRef(s: string): PhotoEventRefValue | null {
  const [src, idStr] = s.split(':');
  const id = Number(idStr);
  if (!Number.isInteger(id)) return null;
  if (src === 'e') return { source: 'events', id };
  if (src === 'c') return { source: 'calendar_events', id };
  return null;
}
function refMatchesPhoto(ref: PhotoEventRefValue, p: Photo): boolean {
  return ref.source === 'events'
    ? p.event_id === ref.id
    : p.calendar_event_id === ref.id;
}
function photoEventRef(p: Photo): PhotoEventRefValue | null {
  if (p.event_id !== null) return { source: 'events', id: p.event_id };
  if (p.calendar_event_id !== null) return { source: 'calendar_events', id: p.calendar_event_id };
  return null;
}

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const HEIC_MIME = ['image/heic', 'image/heif'];
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const PUT_TIMEOUT_MS = 60_000;

type UploadItem = {
  localId: string;
  file: File;
  previewUrl: string;
  caption: string;
  // Last caption value the server has acknowledged. Used post-upload to
  // detect when an edit needs to be PATCH'd to /api/photos/:id.
  savedCaption: string;
  captionSaveState: 'idle' | 'saving' | 'saved' | 'error';
  status: 'queued' | 'uploading' | 'processing' | 'done' | 'error';
  progress: number;
  error?: string;
  photo?: Photo;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState<string>('all');
  // 'all' = no filter; 'none' = untagged photos; otherwise a unified ref into
  // either source table.
  const [filterEvent, setFilterEvent] = useState<PhotoEventRefValue | 'all' | 'none'>('all');

  const [batchYear, setBatchYear] = useState<string>(currentSchoolYear());
  const [batchEventRef, setBatchEventRef] = useState<PhotoEventRefValue | null>(null);
  const [batchDate, setBatchDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<UploadItem[]>([]);
  const itemsRef = useRef<UploadItem[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  const isRunningRef = useRef(false);
  const inFlightRef = useRef<Set<string>>(new Set());
  const [dragActive, setDragActive] = useState(false);

  // Drag-reorder state for the gallery list. Only meaningful when filterEvent
  // is a single event id — reordering across "all" or "untagged" doesn't have
  // a stable home for display_order.
  const [draggingPhotoId, setDraggingPhotoId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);

  // Quick-create-event modal state. Triggered from the upload form so a
  // photographer can tag their batch with a brand-new event without leaving
  // this page. Source defaults to calendar_events because that's the main
  // school calendar; the events table is used for special PDF-bearing events
  // and isn't usually where new photo-tag events go.
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    date: string;
    location: string;
    description: string;
    source: PhotoEventSource;
  }>({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    location: '',
    description: '',
    source: 'calendar_events',
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    caption: string;
    alt_text: string;
    school_year: string;
    eventRef: PhotoEventRefValue | null;
    date_taken: string;
    is_published: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [p, e, c] = await Promise.all([
          getPhotos({ limit: 500, include_unpublished: true }),
          getEvents(),
          getCalendarEvents(),
        ]);
        if (cancelled) return;
        setPhotos(p || []);
        setEvents(e || []);
        setCalendarEvents(c || []);
      } catch (err) {
        console.error('Error loading admin photos:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Unified picker options. Both sources flow through one dropdown with a
  // source badge so admins don't have to think about which table an event
  // lives in.
  const pickerOptions = useMemo<EventPickerOption[]>(() => {
    const fromEvents: EventPickerOption[] = events.map((e) => ({
      source: 'events',
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
      category: e.category,
    }));
    const fromCalendar: EventPickerOption[] = calendarEvents.map((e) => ({
      source: 'calendar_events',
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
      category: e.category,
    }));
    return [...fromEvents, ...fromCalendar];
  }, [events, calendarEvents]);

  // Date drives school year. Admin can override the year afterwards.
  useEffect(() => {
    const d = new Date(batchDate);
    if (Number.isNaN(d.getTime())) return;
    setBatchYear(schoolYearFromDate(d));
  }, [batchDate]);

  const filteredPhotos = useMemo(() => {
    const list = photos.filter((p) => {
      if (filterYear !== 'all' && p.school_year !== filterYear) return false;
      if (filterEvent === 'none') {
        return p.event_id === null && p.calendar_event_id === null;
      }
      if (filterEvent !== 'all' && !refMatchesPhoto(filterEvent, p)) return false;
      return true;
    });
    // When viewing a single event, sort by display_order (NULL last) then
    // date_taken DESC so the drag-reorder UI matches what the gallery sees.
    if (typeof filterEvent === 'object' && filterEvent !== null) {
      return [...list].sort((a, b) => {
        const ao = a.display_order ?? Number.POSITIVE_INFINITY;
        const bo = b.display_order ?? Number.POSITIVE_INFINITY;
        if (ao !== bo) return ao - bo;
        return b.date_taken.localeCompare(a.date_taken);
      });
    }
    return list;
  }, [photos, filterYear, filterEvent]);

  const allYears = useMemo(() => {
    const set = new Set<string>([currentSchoolYear()]);
    photos.forEach((p) => set.add(p.school_year));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [photos]);

  function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    const next: UploadItem[] = [];
    for (const file of arr) {
      if (HEIC_MIME.includes(file.type)) {
        next.push({
          localId: uid(), file,
          previewUrl: URL.createObjectURL(file),
          caption: '', savedCaption: '', captionSaveState: 'idle',
          status: 'error', progress: 0,
          error: 'HEIC/HEIF not supported. Please convert to JPEG.',
        });
        continue;
      }
      if (!ALLOWED_MIME.includes(file.type)) {
        next.push({
          localId: uid(), file,
          previewUrl: URL.createObjectURL(file),
          caption: '', savedCaption: '', captionSaveState: 'idle',
          status: 'error', progress: 0,
          error: 'Only JPEG, PNG, or WebP allowed.',
        });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        next.push({
          localId: uid(), file,
          previewUrl: URL.createObjectURL(file),
          caption: '', savedCaption: '', captionSaveState: 'idle',
          status: 'error', progress: 0,
          error: `Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
        });
        continue;
      }
      next.push({
        localId: uid(), file,
        previewUrl: URL.createObjectURL(file),
        caption: '', savedCaption: '', captionSaveState: 'idle',
        status: 'queued', progress: 0,
      });
    }
    setItems((prev) => [...prev, ...next]);
    // Auto-start uploads. Defer so the new items land in itemsRef before the
    // worker pool inspects it.
    setTimeout(() => void runQueueLoop(), 0);
  }

  function updateItem(localId: string, patch: Partial<UploadItem>) {
    setItems((prev) => prev.map((it) => (it.localId === localId ? { ...it, ...patch } : it)));
  }

  function removeItem(localId: string) {
    setItems((prev) => {
      const item = prev.find((it) => it.localId === localId);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((it) => it.localId !== localId);
    });
  }

  async function uploadOne(item: UploadItem): Promise<void> {
    try {
      updateItem(item.localId, { status: 'uploading', progress: 5 });
      const { storage_path, signed_url } = await requestPhotoUploadUrl({
        mime_type: item.file.type,
        size: item.file.size,
      });
      updateItem(item.localId, { progress: 25 });

      // PUT the bytes directly to the signed URL. Bypassing supabase-js here
      // gives us a real timeout and visible error responses (the JS wrapper
      // wraps fetch with no timeout, so failed PUTs hang forever).
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), PUT_TIMEOUT_MS);
      let putRes: Response;
      try {
        putRes = await fetch(signed_url, {
          method: 'PUT',
          headers: {
            'Content-Type': item.file.type,
            'x-upsert': 'false',
          },
          body: item.file,
          signal: ctrl.signal,
        });
      } catch (err) {
        if (ctrl.signal.aborted) {
          throw new Error(`Upload timed out after ${PUT_TIMEOUT_MS / 1000}s. Check your network.`);
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
      if (!putRes.ok) {
        const text = await putRes.text().catch(() => '');
        console.error('Storage PUT failed', { status: putRes.status, body: text, url: signed_url });
        throw new Error(`Storage upload failed (${putRes.status}): ${text || putRes.statusText}`);
      }
      updateItem(item.localId, { status: 'processing', progress: 65 });

      const latest = itemsRef.current.find((it) => it.localId === item.localId);
      const captionText = latest?.caption?.trim() || null;
      const created = await createPhoto({
        storage_path,
        date_taken: new Date(batchDate).toISOString(),
        school_year: isValidSchoolYear(batchYear) ? batchYear : schoolYearFromDate(new Date(batchDate)),
        event_id: batchEventRef?.source === 'events' ? batchEventRef.id : null,
        calendar_event_id: batchEventRef?.source === 'calendar_events' ? batchEventRef.id : null,
        caption: captionText,
      });
      updateItem(item.localId, {
        status: 'done',
        progress: 100,
        photo: created,
        savedCaption: captionText || '',
      });
      setPhotos((prev) => [created, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      updateItem(item.localId, { status: 'error', error: message });
    }
  }

  // Single shared worker pool. Picks queued items off itemsRef.current as they
  // arrive (so files added mid-run get processed by an idle worker) and uses
  // inFlightRef to prevent two workers grabbing the same item.
  async function runQueueLoop() {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    const concurrency = 4;
    async function worker() {
      while (true) {
        const next = itemsRef.current.find(
          (it) => it.status === 'queued' && !inFlightRef.current.has(it.localId),
        );
        if (!next) return;
        inFlightRef.current.add(next.localId);
        try {
          await uploadOne(next);
        } finally {
          inFlightRef.current.delete(next.localId);
        }
      }
    }
    try {
      await Promise.all(Array.from({ length: concurrency }, worker));
    } finally {
      isRunningRef.current = false;
    }
  }

  // Reset errored items back to queued and re-run.
  function handleStartUploads() {
    const errored = itemsRef.current.filter((it) => it.status === 'error');
    if (errored.length > 0) {
      setItems((prev) =>
        prev.map((it) =>
          it.status === 'error' && !it.error?.startsWith('HEIC') && !it.error?.startsWith('Only') && !it.error?.startsWith('Max size')
            ? { ...it, status: 'queued', error: undefined, progress: 0 }
            : it,
        ),
      );
    }
    setTimeout(() => void runQueueLoop(), 0);
  }

  function clearDone() {
    setItems((prev) => {
      prev.filter((it) => it.status === 'done').forEach((it) => URL.revokeObjectURL(it.previewUrl));
      return prev.filter((it) => it.status !== 'done');
    });
  }

  function startEdit(p: Photo) {
    setEditingId(p.id);
    setEditForm({
      caption: p.caption || '',
      alt_text: p.alt_text || '',
      school_year: p.school_year,
      eventRef: photoEventRef(p),
      date_taken: p.date_taken.slice(0, 10),
      is_published: p.is_published,
    });
  }

  async function saveEdit() {
    if (!editingId || !editForm) return;
    if (!isValidSchoolYear(editForm.school_year)) {
      alert('School year must be in YYYY-YYYY format with consecutive years.');
      return;
    }
    try {
      const updated = await updatePhoto(editingId, {
        caption: editForm.caption || null,
        alt_text: editForm.alt_text || null,
        school_year: editForm.school_year,
        // Send both fields so the server clears whichever one isn't selected
        // (the API also auto-nulls the opposite, but being explicit lets the
        // edit cleanly switch between sources).
        event_id: editForm.eventRef?.source === 'events' ? editForm.eventRef.id : null,
        calendar_event_id: editForm.eventRef?.source === 'calendar_events' ? editForm.eventRef.id : null,
        date_taken: new Date(editForm.date_taken).toISOString(),
        is_published: editForm.is_published,
      });
      setPhotos((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    }
  }

  // Save caption edits made after the upload has finished. The upload pipeline
  // races user typing — small files often POST before the user gets to the
  // input — so this is the recovery path that keeps captions editable in the
  // upload list itself.
  async function handleCaptionBlur(item: UploadItem) {
    if (item.status !== 'done' || !item.photo) return;
    const trimmed = item.caption.trim();
    if (trimmed === (item.savedCaption || '').trim()) return;
    updateItem(item.localId, { captionSaveState: 'saving' });
    try {
      const updated = await updatePhoto(item.photo.id, { caption: trimmed || null });
      updateItem(item.localId, {
        captionSaveState: 'saved',
        savedCaption: trimmed,
        photo: updated,
      });
      setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      // Drop the "saved" badge after a beat so it doesn't linger.
      setTimeout(() => {
        const cur = itemsRef.current.find((it) => it.localId === item.localId);
        if (cur?.captionSaveState === 'saved') {
          updateItem(item.localId, { captionSaveState: 'idle' });
        }
      }, 1500);
    } catch (err) {
      console.error('caption save failed', err);
      updateItem(item.localId, { captionSaveState: 'error' });
    }
  }

  async function handleSubmitNewEvent() {
    const title = newEvent.title.trim();
    const location = newEvent.location.trim();
    const description = newEvent.description.trim() || title;
    if (!title || !newEvent.date || !location) {
      alert('Title, date, and location are required.');
      return;
    }
    setCreatingEvent(true);
    try {
      const payload = { title, description, date: newEvent.date, location };
      if (newEvent.source === 'calendar_events') {
        const created = (await createCalendarEvent(payload)) as CalendarEvent;
        setCalendarEvents((prev) => [...prev, created]);
        setBatchEventRef({ source: 'calendar_events', id: created.id });
      } else {
        const created = (await createEvent(payload)) as Event;
        setEvents((prev) => [...prev, created]);
        setBatchEventRef({ source: 'events', id: created.id });
      }
      // Roll the date over so the next quick-add doesn't reuse the old one,
      // but keep the user's source choice — they probably want consecutive
      // adds to land in the same table.
      setNewEvent((prev) => ({
        title: '',
        date: new Date().toISOString().slice(0, 10),
        location: '',
        description: '',
        source: prev.source,
      }));
      setShowNewEvent(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setCreatingEvent(false);
    }
  }

  // Drag-reorder handlers. Only active when filterEvent is a single event id.
  // Optimistically reorder photos[] in place, then persist via /api/photos/reorder.
  async function commitReorder(orderedIds: number[]) {
    try {
      await reorderPhotos(orderedIds);
    } catch (err) {
      console.error('reorder failed, refetching to recover', err);
      const refreshed = await getPhotos({ limit: 500, include_unpublished: true });
      setPhotos(refreshed || []);
    }
  }

  function handlePhotoDrop(targetId: number) {
    const sourceId = draggingPhotoId;
    setDraggingPhotoId(null);
    setDropTargetId(null);
    if (sourceId === null || sourceId === targetId) return;
    // Drag only makes sense when filtered to one specific event ref.
    if (filterEvent === 'all' || filterEvent === 'none') return;
    const ref = filterEvent;

    // Reorder only the currently-filtered subset; keep other photos untouched
    // in photos[] (they belong to different events).
    const subset = photos.filter((p) => refMatchesPhoto(ref, p));
    const fromIdx = subset.findIndex((p) => p.id === sourceId);
    const toIdx = subset.findIndex((p) => p.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const reordered = [...subset];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Re-stamp display_order locally so the gallery sort reflects the new
    // ordering immediately, before the network round-trip resolves.
    const idToOrder = new Map(reordered.map((p, i) => [p.id, i]));
    setPhotos((prev) =>
      prev.map((p) =>
        refMatchesPhoto(ref, p) && idToOrder.has(p.id)
          ? { ...p, display_order: idToOrder.get(p.id) ?? null }
          : p,
      ),
    );
    void commitReorder(reordered.map((p) => p.id));
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this photo? This removes the original and all derived sizes.')) return;
    try {
      await deletePhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  async function applyBatchTagToFiltered() {
    if (filteredPhotos.length === 0) return;
    if (!confirm(`Apply current batch tags (school year + event) to ${filteredPhotos.length} filtered photos?`)) return;
    if (!isValidSchoolYear(batchYear)) {
      alert('Batch school year is invalid.');
      return;
    }
    try {
      const ids = filteredPhotos.map((p) => p.id);
      await batchUpdatePhotos(ids, {
        school_year: batchYear,
        // Always send both fields so we clear the opposite ref when switching.
        event_id: batchEventRef?.source === 'events' ? batchEventRef.id : null,
        calendar_event_id: batchEventRef?.source === 'calendar_events' ? batchEventRef.id : null,
      });
      const refreshed = await getPhotos({ limit: 500, include_unpublished: true });
      setPhotos(refreshed || []);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Batch update failed');
    }
  }

  const queuedCount = items.filter((it) => it.status === 'queued').length;
  const uploadingCount = items.filter((it) => it.status === 'uploading' || it.status === 'processing').length;
  const erroredCount = items.filter((it) => it.status === 'error').length;
  const retryableErrorCount = items.filter(
    (it) =>
      it.status === 'error' &&
      !it.error?.startsWith('HEIC') &&
      !it.error?.startsWith('Only') &&
      !it.error?.startsWith('Max size'),
  ).length;

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Photo Management</h1>
        <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
          Upload photos and tag them with school year and event.
        </p>
      </header>

      <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#221910] p-4 md:p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-gray-500 dark:text-white/60 font-medium uppercase tracking-wide">Date taken (batch)</span>
            <input
              type="date"
              value={batchDate}
              onChange={(e) => setBatchDate(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-gray-500 dark:text-white/60 font-medium uppercase tracking-wide">School year</span>
            <input
              type="text"
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value)}
              placeholder="YYYY-YYYY"
              className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-gray-500 dark:text-white/60 font-medium uppercase tracking-wide flex items-center justify-between">
              <span>Event (optional)</span>
              <button
                type="button"
                onClick={() => {
                  setNewEvent((prev) => ({ ...prev, date: batchDate || prev.date }));
                  setShowNewEvent(true);
                }}
                className="normal-case tracking-normal text-primary hover:underline text-xs font-medium inline-flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                New event
              </button>
            </span>
            <EventPicker
              options={pickerOptions}
              value={batchEventRef}
              onChange={(ref) => setBatchEventRef(ref)}
              placeholder="Search events by name, location, date…"
            />
          </div>
        </div>

        <div
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 dark:border-white/20 hover:border-primary/60'
          }`}
        >
          <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-white/40 mb-2">
            cloud_upload
          </span>
          <p className="text-gray-700 dark:text-white/80 font-medium">Drag & drop photos here</p>
          <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
            Uploads start automatically · JPEG, PNG, or WebP up to 15MB · HEIC must be converted first
          </p>
          <label className="mt-4 inline-flex items-center gap-2 cursor-pointer rounded-lg bg-primary px-4 py-2 text-white text-sm font-medium hover:bg-orange-600">
            <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
            Select files
            <input
              type="file"
              multiple
              accept={ALLOWED_MIME.join(',')}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
          </label>
        </div>

        {items.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-gray-600 dark:text-white/70">
                {items.length} file{items.length === 1 ? '' : 's'} ·{' '}
                {queuedCount} queued, {uploadingCount} in progress
                {erroredCount > 0 ? `, ${erroredCount} failed` : ''}
              </p>
              <div className="flex gap-2">
                {(queuedCount > 0 || retryableErrorCount > 0) && (
                  <button
                    type="button"
                    onClick={handleStartUploads}
                    className="rounded-lg bg-primary text-white text-sm font-medium px-3 h-9"
                  >
                    {retryableErrorCount > 0 ? `Retry ${retryableErrorCount}` : 'Resume uploads'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearDone}
                  className="rounded-lg border border-gray-200 dark:border-white/15 text-sm px-3 h-9 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Clear done
                </button>
              </div>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-white/10 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#2a221a]/40">
              {items.map((it) => {
                const hasUnsavedCaption =
                  it.status === 'done' && it.caption.trim() !== (it.savedCaption || '').trim();
                return (
                  <li key={it.localId} className="flex items-start gap-3 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.previewUrl} alt="" className="w-14 h-14 rounded object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{it.file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-white/50">
                        {(it.file.size / 1024 / 1024).toFixed(2)} MB · {it.status}
                        {it.error ? ` — ${it.error}` : ''}
                      </p>
                      {it.status !== 'error' && (
                        <div className="mt-1 h-1 w-full rounded bg-gray-200 dark:bg-white/10 overflow-hidden">
                          <div className="h-full bg-primary transition-all" style={{ width: `${it.progress}%` }} />
                        </div>
                      )}
                      {it.status !== 'error' && (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={it.caption}
                            onChange={(e) => updateItem(it.localId, { caption: e.target.value, captionSaveState: 'idle' })}
                            onBlur={() => void handleCaptionBlur(it)}
                            placeholder="Caption (optional)"
                            maxLength={300}
                            className="flex-1 h-9 rounded-md border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          {it.status === 'done' && (
                            <span className="text-xs whitespace-nowrap min-w-[4rem] text-right">
                              {it.captionSaveState === 'saving' && <span className="text-gray-500">Saving…</span>}
                              {it.captionSaveState === 'saved' && <span className="text-green-600 dark:text-green-400">Saved</span>}
                              {it.captionSaveState === 'error' && <span className="text-red-600 dark:text-red-400">Retry</span>}
                              {it.captionSaveState === 'idle' && hasUnsavedCaption && (
                                <span className="text-amber-600 dark:text-amber-400">Unsaved</span>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(it.localId)}
                      className="text-gray-400 hover:text-red-500 shrink-0"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#221910] p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All photos ({photos.length})</h2>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              aria-label="Filter by school year"
              title="Filter by school year"
              className="h-9 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-2 text-sm"
            >
              <option value="all">All years</option>
              {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select
              value={
                filterEvent === 'all' || filterEvent === 'none'
                  ? filterEvent
                  : encodeRef(filterEvent)
              }
              onChange={(e) => {
                const v = e.target.value;
                if (v === 'all') setFilterEvent('all');
                else if (v === 'none') setFilterEvent('none');
                else {
                  const ref = decodeRef(v);
                  if (ref) setFilterEvent(ref);
                }
              }}
              aria-label="Filter by event"
              title="Filter by event"
              className="h-9 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-2 text-sm"
            >
              <option value="all">All events</option>
              <option value="none">Untagged</option>
              {calendarEvents.length > 0 && (
                <optgroup label="Calendar">
                  {calendarEvents.map((ev) => (
                    <option key={`c-${ev.id}`} value={encodeRef({ source: 'calendar_events', id: ev.id })}>
                      {ev.title}
                    </option>
                  ))}
                </optgroup>
              )}
              {events.length > 0 && (
                <optgroup label="Event">
                  {events.map((ev) => (
                    <option key={`e-${ev.id}`} value={encodeRef({ source: 'events', id: ev.id })}>
                      {ev.title}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <button
              type="button"
              onClick={applyBatchTagToFiltered}
              disabled={filteredPhotos.length === 0}
              className="rounded-lg border border-gray-200 dark:border-white/15 text-sm px-3 h-9 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
              title="Apply batch school year + event to all filtered photos"
            >
              Apply batch tags to filtered
            </button>
          </div>
        </div>

        {typeof filterEvent === 'object' && filterEvent !== null && filteredPhotos.length > 1 && (
          <p className="text-xs text-gray-500 dark:text-white/60 mb-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-base">drag_indicator</span>
            Drag photos to reorder them within this event. The public gallery uses the same order.
          </p>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading photos...</p>
        ) : filteredPhotos.length === 0 ? (
          <p className="text-gray-500 text-sm">No photos match these filters.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredPhotos.map((p) => {
              const reorderable = typeof filterEvent === 'object' && filterEvent !== null;
              const isDragging = draggingPhotoId === p.id;
              const isDropTarget = dropTargetId === p.id && draggingPhotoId !== p.id;
              return (
              <li
                key={p.id}
                draggable={reorderable}
                onDragStart={reorderable ? (e) => {
                  setDraggingPhotoId(p.id);
                  e.dataTransfer.effectAllowed = 'move';
                  // Some browsers need data set or the drag is rejected.
                  e.dataTransfer.setData('text/plain', String(p.id));
                } : undefined}
                onDragEnd={reorderable ? () => {
                  setDraggingPhotoId(null);
                  setDropTargetId(null);
                } : undefined}
                onDragOver={reorderable ? (e) => {
                  if (draggingPhotoId === null || draggingPhotoId === p.id) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dropTargetId !== p.id) setDropTargetId(p.id);
                } : undefined}
                onDragLeave={reorderable ? () => {
                  if (dropTargetId === p.id) setDropTargetId(null);
                } : undefined}
                onDrop={reorderable ? (e) => {
                  e.preventDefault();
                  handlePhotoDrop(p.id);
                } : undefined}
                className={`rounded-lg overflow-hidden border bg-white dark:bg-[#2a221a] transition-all ${
                  isDropTarget
                    ? 'border-primary ring-2 ring-primary/40'
                    : 'border-gray-200 dark:border-white/10'
                } ${isDragging ? 'opacity-50' : ''} ${reorderable ? 'cursor-move' : ''}`}
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-black/30">
                  <Image
                    src={photoUrl(p.thumb_path)}
                    alt={p.alt_text || p.caption || ''}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                  {!p.is_published && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-medium">
                      Hidden
                    </span>
                  )}
                  {reorderable && (
                    <span className="absolute top-1 right-1 rounded bg-black/55 text-white text-xs px-1.5 py-0.5 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-sm">drag_indicator</span>
                      {(p.display_order ?? null) !== null ? (p.display_order ?? 0) + 1 : '—'}
                    </span>
                  )}
                </div>
                <div className="p-2 text-xs">
                  <p className="text-gray-700 dark:text-white/80 truncate">
                    {p.event?.title || p.calendar_event?.title || '— Untagged —'}
                  </p>
                  <p className="text-gray-500 dark:text-white/50">{p.school_year}</p>
                  <div className="mt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="text-primary hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
              );
            })}
          </ul>
        )}
      </section>

      {editingId !== null && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#221910] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit photo</h3>
            <div className="space-y-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-gray-700 dark:text-white/80">Caption</span>
                <input
                  type="text"
                  value={editForm.caption}
                  onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                  className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-gray-700 dark:text-white/80">Alt text (accessibility)</span>
                <input
                  type="text"
                  value={editForm.alt_text}
                  onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                  className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-gray-700 dark:text-white/80">Date taken</span>
                  <input
                    type="date"
                    value={editForm.date_taken}
                    onChange={(e) => setEditForm({ ...editForm, date_taken: e.target.value, school_year: schoolYearFromDate(new Date(e.target.value)) })}
                    className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-gray-700 dark:text-white/80">School year</span>
                  <input
                    type="text"
                    value={editForm.school_year}
                    onChange={(e) => setEditForm({ ...editForm, school_year: e.target.value })}
                    className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm"
                  />
                </label>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-gray-700 dark:text-white/80">Event</span>
                <EventPicker
                  options={pickerOptions}
                  value={editForm.eventRef}
                  onChange={(ref) => setEditForm({ ...editForm, eventRef: ref })}
                  placeholder="Search events…"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-white/80">
                <input
                  type="checkbox"
                  checked={editForm.is_published}
                  onChange={(e) => setEditForm({ ...editForm, is_published: e.target.checked })}
                />
                Published (visible on public gallery)
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setEditingId(null); setEditForm(null); }}
                className="rounded-lg border border-gray-200 dark:border-white/15 text-sm px-4 h-10 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="rounded-lg bg-primary text-white text-sm font-medium px-4 h-10 hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#221910] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">New event</h3>
            <p className="text-xs text-gray-500 dark:text-white/60 mb-4">
              Create an event so you can tag this batch of photos with it.
            </p>
            <div className="space-y-3">
              <fieldset className="flex flex-col gap-1 text-sm">
                <legend className="text-gray-700 dark:text-white/80 mb-1">Add to</legend>
                <div className="inline-flex rounded-lg border border-gray-200 dark:border-white/15 overflow-hidden self-start">
                  <button
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, source: 'calendar_events' })}
                    className={`px-3 h-9 text-sm font-medium ${
                      newEvent.source === 'calendar_events'
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-[#2a221a] text-gray-700 dark:text-white/80'
                    }`}
                  >
                    School calendar
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, source: 'events' })}
                    className={`px-3 h-9 text-sm font-medium border-l border-gray-200 dark:border-white/15 ${
                      newEvent.source === 'events'
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-[#2a221a] text-gray-700 dark:text-white/80'
                    }`}
                  >
                    Events page
                  </button>
                </div>
              </fieldset>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-gray-700 dark:text-white/80">Title</span>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Spring Carnival"
                  className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-gray-700 dark:text-white/80">Date</span>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-gray-700 dark:text-white/80">Location</span>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="e.g. Schweitzer gym"
                    className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-gray-700 dark:text-white/80">Description (optional)</span>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                  placeholder="Defaults to the title if left blank."
                  className="rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewEvent(false)}
                disabled={creatingEvent}
                className="rounded-lg border border-gray-200 dark:border-white/15 text-sm px-4 h-10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitNewEvent}
                disabled={creatingEvent || !newEvent.title.trim() || !newEvent.location.trim() || !newEvent.date}
                className="rounded-lg bg-primary text-white text-sm font-medium px-4 h-10 hover:bg-orange-600 disabled:opacity-50"
              >
                {creatingEvent ? 'Creating…' : 'Create event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
