'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  getPhotos,
  getEvents,
  requestPhotoUploadUrl,
  createPhoto,
  updatePhoto,
  deletePhoto,
  batchUpdatePhotos,
  photoUrl,
  Photo,
  Event,
} from '@/lib/api';
import { createClient } from '@/lib/supabase/client';
import { schoolYearFromDate, isValidSchoolYear, currentSchoolYear } from '@/lib/school-year';

const BUCKET = 'event-photos';
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const HEIC_MIME = ['image/heic', 'image/heif'];
const MAX_FILE_SIZE = 15 * 1024 * 1024;

type UploadItem = {
  localId: string;
  file: File;
  previewUrl: string;
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
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterEvent, setFilterEvent] = useState<number | 'all' | 'none'>('all');

  const [batchYear, setBatchYear] = useState<string>(currentSchoolYear());
  const [batchEventId, setBatchEventId] = useState<string>('');
  const [batchDate, setBatchDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    caption: string;
    alt_text: string;
    school_year: string;
    event_id: string;
    date_taken: string;
    is_published: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [p, e] = await Promise.all([
          getPhotos({ limit: 500, include_unpublished: true }),
          getEvents(),
        ]);
        if (cancelled) return;
        setPhotos(p || []);
        setEvents(e || []);
      } catch (err) {
        console.error('Error loading admin photos:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Date drives school year. Admin can override the year afterwards.
  useEffect(() => {
    const d = new Date(batchDate);
    if (Number.isNaN(d.getTime())) return;
    setBatchYear(schoolYearFromDate(d));
  }, [batchDate]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      if (filterYear !== 'all' && p.school_year !== filterYear) return false;
      if (filterEvent === 'none') return p.event_id === null;
      if (filterEvent !== 'all' && p.event_id !== filterEvent) return false;
      return true;
    });
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
          status: 'error', progress: 0,
          error: 'HEIC/HEIF not supported. Please convert to JPEG.',
        });
        continue;
      }
      if (!ALLOWED_MIME.includes(file.type)) {
        next.push({
          localId: uid(), file,
          previewUrl: URL.createObjectURL(file),
          status: 'error', progress: 0,
          error: 'Only JPEG, PNG, or WebP allowed.',
        });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        next.push({
          localId: uid(), file,
          previewUrl: URL.createObjectURL(file),
          status: 'error', progress: 0,
          error: `Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
        });
        continue;
      }
      next.push({
        localId: uid(), file,
        previewUrl: URL.createObjectURL(file),
        status: 'queued', progress: 0,
      });
    }
    setItems((prev) => [...prev, ...next]);
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

  async function uploadOne(item: UploadItem): Promise<Photo | null> {
    try {
      updateItem(item.localId, { status: 'uploading', progress: 5 });
      const { storage_path, token } = await requestPhotoUploadUrl({
        mime_type: item.file.type,
        size: item.file.size,
      });
      updateItem(item.localId, { progress: 25 });

      const supabase = createClient();
      const upload = await supabase.storage
        .from(BUCKET)
        .uploadToSignedUrl(storage_path, token, item.file, { contentType: item.file.type });
      if (upload.error) throw upload.error;
      updateItem(item.localId, { status: 'processing', progress: 65 });

      const created = await createPhoto({
        storage_path,
        date_taken: new Date(batchDate).toISOString(),
        school_year: isValidSchoolYear(batchYear) ? batchYear : schoolYearFromDate(new Date(batchDate)),
        event_id: batchEventId ? Number(batchEventId) : null,
      });
      updateItem(item.localId, { status: 'done', progress: 100, photo: created });
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      updateItem(item.localId, { status: 'error', error: message });
      return null;
    }
  }

  async function handleStartUploads() {
    const queued = items.filter((it) => it.status === 'queued');
    if (queued.length === 0) return;
    // Upload in parallel, but cap concurrency at 4 to avoid overloading the
    // sharp/processing route.
    const concurrency = 4;
    const created: Photo[] = [];
    let cursor = 0;
    async function worker() {
      while (cursor < queued.length) {
        const i = cursor++;
        const result = await uploadOne(queued[i]);
        if (result) created.push(result);
      }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, queued.length) }, worker));
    if (created.length) {
      setPhotos((prev) => [...created, ...prev]);
    }
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
      event_id: p.event_id ? String(p.event_id) : '',
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
        event_id: editForm.event_id ? Number(editForm.event_id) : null,
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
        event_id: batchEventId ? Number(batchEventId) : null,
      });
      const refreshed = await getPhotos({ limit: 500, include_unpublished: true });
      setPhotos(refreshed || []);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Batch update failed');
    }
  }

  const queuedCount = items.filter((it) => it.status === 'queued').length;
  const uploadingCount = items.filter((it) => it.status === 'uploading' || it.status === 'processing').length;

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
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-gray-500 dark:text-white/60 font-medium uppercase tracking-wide">Event (optional)</span>
            <select
              value={batchEventId}
              onChange={(e) => setBatchEventId(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">— No event —</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.date})
                </option>
              ))}
            </select>
          </label>
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
            JPEG, PNG, or WebP up to 15MB. HEIC must be converted first.
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-white/70">
                {items.length} file{items.length === 1 ? '' : 's'} ·{' '}
                {queuedCount} queued, {uploadingCount} in progress
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleStartUploads}
                  disabled={queuedCount === 0}
                  className="rounded-lg bg-primary text-white text-sm font-medium px-3 h-9 disabled:opacity-60"
                >
                  Start uploads
                </button>
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
              {items.map((it) => (
                <li key={it.localId} className="flex items-center gap-3 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.previewUrl} alt="" className="w-12 h-12 rounded object-cover" />
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
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(it.localId)}
                    className="text-gray-400 hover:text-red-500"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </li>
              ))}
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
              className="h-9 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-2 text-sm"
            >
              <option value="all">All years</option>
              {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select
              value={filterEvent === 'all' ? 'all' : filterEvent === 'none' ? 'none' : String(filterEvent)}
              onChange={(e) => {
                const v = e.target.value;
                if (v === 'all') setFilterEvent('all');
                else if (v === 'none') setFilterEvent('none');
                else setFilterEvent(Number(v));
              }}
              className="h-9 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-2 text-sm"
            >
              <option value="all">All events</option>
              <option value="none">Untagged</option>
              {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
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

        {loading ? (
          <p className="text-gray-500 text-sm">Loading photos...</p>
        ) : filteredPhotos.length === 0 ? (
          <p className="text-gray-500 text-sm">No photos match these filters.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredPhotos.map((p) => (
              <li key={p.id} className="rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2a221a]">
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
                </div>
                <div className="p-2 text-xs">
                  <p className="text-gray-700 dark:text-white/80 truncate">{p.event?.title || '— Untagged —'}</p>
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
            ))}
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
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-gray-700 dark:text-white/80">Event</span>
                <select
                  value={editForm.event_id}
                  onChange={(e) => setEditForm({ ...editForm, event_id: e.target.value })}
                  className="h-10 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#2a221a] px-3 text-sm"
                >
                  <option value="">— No event —</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title} ({ev.date})</option>
                  ))}
                </select>
              </label>
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
    </div>
  );
}
