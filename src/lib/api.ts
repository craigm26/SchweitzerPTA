// API utility functions for fetching data

const API_BASE = '';

// News API
export async function getNews(options?: { status?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (options?.status) params.set('status', options.status);
  if (options?.limit) params.set('limit', options.limit.toString());
  
  const res = await fetch(`${API_BASE}/api/news?${params}`, {
    cache: 'no-store', // Always fetch fresh data from Supabase
  });
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}

export async function getNewsArticle(id: string) {
  const res = await fetch(`${API_BASE}/api/news?id=${id}`, {
    cache: 'no-store', // Always fetch fresh data from Supabase
  });
  if (!res.ok) throw new Error('Failed to fetch article');
  const data = await res.json();
  return Array.isArray(data) ? data.find((a: { id: number }) => a.id.toString() === id) : data;
}

export async function createNews(data: {
  title: string;
  content: string;
  excerpt?: string;
  author_name: string;
  featured_image?: string;
  status?: string;
  category?: string;
  tags?: string[];
}) {
  const res = await fetch(`${API_BASE}/api/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create news');
  return res.json();
}

export async function updateNews(id: number, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/news`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error('Failed to update news');
  return res.json();
}

export async function deleteNews(id: number) {
  const res = await fetch(`${API_BASE}/api/news?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete news');
  return res.json();
}

// Events API
export async function getEvents(options?: { category?: string; featured?: boolean; upcoming?: boolean }) {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);
  if (options?.featured) params.set('featured', 'true');
  if (options?.upcoming) params.set('upcoming', 'true');
  
  const res = await fetch(`${API_BASE}/api/calendar?${params}`, {
    cache: 'no-store', // Always fetch fresh data from Supabase
  });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function createEvent(data: {
  title: string;
  description: string;
  date: string;
  time: string;
  end_time?: string;
  location: string;
  category?: string;
  image?: string;
  is_featured?: boolean;
}) {
  const res = await fetch(`${API_BASE}/api/calendar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

export async function updateEvent(id: number, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/calendar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error('Failed to update event');
  return res.json();
}

export async function deleteEvent(id: number) {
  const res = await fetch(`${API_BASE}/api/calendar?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete event');
  return res.json();
}

// Donors API
export async function getDonors(options?: { includeInactive?: boolean }) {
  const params = new URLSearchParams();
  if (options?.includeInactive) params.set('includeInactive', 'true');
  
  try {
    const res = await fetch(`${API_BASE}/api/donors?${params}`, {
      cache: 'no-store', // Always fetch fresh data from Supabase
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch donors: ${res.status} ${errorData.error || res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error in getDonors:', error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

export async function createDonor(data: {
  name: string;
  website: string;
  logo?: string;
  description?: string;
  is_active?: boolean;
}) {
  const res = await fetch(`${API_BASE}/api/donors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create donor');
  return res.json();
}

export async function updateDonor(id: number, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/donors`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error('Failed to update donor');
  return res.json();
}

export async function deleteDonor(id: number) {
  const res = await fetch(`${API_BASE}/api/donors?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete donor');
  return res.json();
}

// Volunteer API
export async function getVolunteerOpportunities(options?: { category?: string; activeOnly?: boolean }) {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);
  if (options?.activeOnly !== false) params.set('activeOnly', 'true');
  
  const res = await fetch(`${API_BASE}/api/volunteers?${params}`, {
    cache: 'no-store', // Always fetch fresh data from Supabase
  });
  if (!res.ok) throw new Error('Failed to fetch volunteer opportunities');
  return res.json();
}

export async function signUpForVolunteer(data: {
  opportunity_id: number;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}) {
  const res = await fetch(`${API_BASE}/api/volunteers/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to sign up');
  return res.json();
}

// Contact API
export async function submitContactForm(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit contact form');
  return res.json();
}

// Users API (admin only)
export async function getUsers(options?: { role?: string }) {
  const params = new URLSearchParams();
  if (options?.role) params.set('role', options.role);
  
  const res = await fetch(`${API_BASE}/api/users?${params}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function updateUser(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

// Types for API responses
export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  author_name: string;
  featured_image: string | null;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  category: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Event {
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
  created_at: string;
  updated_at: string;
}

export interface Donor {
  id: number;
  name: string;
  website: string;
  logo: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VolunteerOpportunity {
  id: number;
  title: string;
  description: string;
  date: string | null;
  time_commitment: string;
  spots_available: number;
  spots_filled: number;
  category: string | null;
  contact_email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'editor' | 'member';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

