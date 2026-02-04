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
  end_date?: string | null;
  time?: string | null;
  end_time?: string | null;
  location: string;
  category?: string;
  image?: string;
  is_featured?: boolean;
  is_all_day?: boolean;
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
export async function getDonors(options?: { includeInactive?: boolean; limit?: number | 'all' }) {
  const params = new URLSearchParams();
  if (options?.includeInactive) params.set('includeInactive', 'true');
  // Default to fetching all donors for public pages
  params.set('limit', options?.limit?.toString() || 'all');

  try {
    const res = await fetch(`${API_BASE}/api/donors?${params}`, {
      cache: 'no-store', // Always fetch fresh data from Supabase
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || res.statusText;
      console.error('Failed to fetch donors:', {
        status: res.status,
        error: errorMessage,
        details: errorData.details,
        hint: errorData.hint
      });
      // If it's an API key error, provide helpful message
      if (errorData.error === 'Invalid API key' || errorMessage?.includes('API key')) {
        console.error('⚠️ Supabase API key issue. Please check your .env.local file contains:');
        console.error('   NEXT_PUBLIC_SUPABASE_URL');
        console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
      }
      throw new Error(`Failed to fetch donors: ${res.status} ${errorMessage}`);
    }
    const result = await res.json();
    // Handle paginated response - extract data array
    return result.data || result || [];
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

// Auction Items API
export async function getAuctionItems(options?: {
  includeInactive?: boolean;
  itemType?: 'live' | 'silent';
  donorId?: number;
  limit?: number | 'all';
}) {
  const params = new URLSearchParams();
  if (options?.includeInactive) params.set('includeInactive', 'true');
  if (options?.itemType) params.set('itemType', options.itemType);
  if (options?.donorId) params.set('donorId', options.donorId.toString());
  params.set('limit', options?.limit?.toString() || 'all');

  try {
    const res = await fetch(`${API_BASE}/api/auction-items?${params}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || res.statusText;
      console.error('Failed to fetch auction items:', {
        status: res.status,
        error: errorMessage,
        details: errorData.details,
        hint: errorData.hint,
      });
      throw new Error(`Failed to fetch auction items: ${res.status} ${errorMessage}`);
    }
    const result = await res.json();
    return result.data || result || [];
  } catch (error) {
    console.error('Error in getAuctionItems:', error);
    return [];
  }
}

export async function createAuctionItem(data: {
  donor_id?: number | null;
  title: string;
  description?: string | null;
  item_type?: 'live' | 'silent';
  image_urls?: string[];
  estimated_value?: number | null;
  restrictions?: string | null;
  quantity?: number | null;
  display_order?: number | null;
  is_active?: boolean;
}) {
  const res = await fetch(`${API_BASE}/api/auction-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create auction item');
  return res.json();
}

export async function updateAuctionItem(id: number, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/auction-items`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error('Failed to update auction item');
  return res.json();
}

export async function deleteAuctionItem(id: number) {
  const res = await fetch(`${API_BASE}/api/auction-items?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete auction item');
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

// Event volunteer API
export async function getVolunteerEvents(options?: {
  includeInactive?: boolean;
  includeInactiveShifts?: boolean;
  upcoming?: boolean;
  eventId?: number;
}) {
  const params = new URLSearchParams();
  if (options?.includeInactive) params.set('includeInactive', 'true');
  if (options?.includeInactiveShifts) params.set('includeInactiveShifts', 'true');
  if (options?.upcoming === false) params.set('upcoming', 'false');
  if (options?.eventId) params.set('eventId', options.eventId.toString());

  const res = await fetch(`${API_BASE}/api/volunteer-events?${params}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch volunteer events');
  return res.json();
}

export async function createVolunteerShift(data: {
  event_id: number;
  job_title: string;
  shift_description?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  spots_available: number;
  is_active?: boolean;
}) {
  const res = await fetch(`${API_BASE}/api/volunteer-shifts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create volunteer shift');
  return res.json();
}

export async function updateVolunteerShift(id: number, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/volunteer-shifts`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error('Failed to update volunteer shift');
  return res.json();
}

export async function deleteVolunteerShift(id: number) {
  const res = await fetch(`${API_BASE}/api/volunteer-shifts?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete volunteer shift');
  return res.json();
}

export async function signUpForVolunteerShift(data: {
  shift_id: number;
  name: string;
  email: string;
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
  end_date: string | null;
  time: string | null;
  end_time: string | null;
  location: string;
  category: string | null;
  image: string | null;
  is_featured: boolean;
  is_all_day: boolean;
  volunteer_active: boolean;
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

export interface AuctionItemDonor {
  id: number;
  name: string;
  website: string;
  logo: string | null;
}

export interface AuctionItem {
  id: number;
  donor_id: number | null;
  title: string;
  description: string | null;
  item_type: 'live' | 'silent';
  image_urls: string[];
  estimated_value: number | null;
  restrictions: string | null;
  quantity: number | null;
  display_order: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  donor?: AuctionItemDonor | null;
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

export interface VolunteerShift {
  id: number;
  event_id: number;
  job_title: string;
  shift_description: string | null;
  start_time: string | null;
  end_time: string | null;
  spots_available: number;
  spots_filled: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VolunteerEvent extends Event {
  shifts: VolunteerShift[];
}

export interface VolunteerSignup {
  id: number;
  shift_id: number;
  user_id: string | null;
  name: string;
  email: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
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

export interface Document {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  category: string | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

// Documents API
export async function getDocuments(options?: { category?: string }) {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);

  const res = await fetch(`${API_BASE}/api/documents?${params}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch documents');
  const data = await res.json();
  return data.documents || [];
}

export async function createDocument(data: {
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  category?: string;
}) {
  const res = await fetch(`${API_BASE}/api/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create document');
  return res.json();
}

export async function updateDocument(id: number, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/documents`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error('Failed to update document');
  return res.json();
}

export async function deleteDocument(id: number) {
  const res = await fetch(`${API_BASE}/api/documents?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete document');
  return res.json();
}

// File upload utility
export async function uploadFile(file: File, bucket: 'sponsor-logos' | 'documents' = 'sponsor-logos') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upload file');
  }

  return res.json();
}

