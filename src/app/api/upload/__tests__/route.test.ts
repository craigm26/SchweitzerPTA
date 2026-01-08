import { POST } from '../route';
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

// Mock the Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

const mockSupabase = mockDeep<any>();

describe('Upload API', () => {
  beforeEach(() => {
    mockReset(mockSupabase);
    (createClient as any).mockResolvedValue(mockSupabase);
  });

  it('should reject unauthenticated users', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest('http://localhost:3000/api/upload', {
      method: 'POST',
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it('should reject requests without a file', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    
    const formData = new FormData();
    // No file appended

    const req = new NextRequest('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  // Note: Testing actual file upload with mocks is tricky because FormData handling in node environment 
  // might behave differently than browser. We'll focus on the logic flow.
});
