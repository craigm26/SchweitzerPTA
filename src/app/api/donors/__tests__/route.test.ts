import { GET, POST, PUT, DELETE } from '../route';
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

// Mock the Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

const mockSupabase = mockDeep<any>();

describe('Donors API', () => {
  beforeEach(() => {
    mockReset(mockSupabase);
    (createClient as any).mockResolvedValue(mockSupabase);
  });

  describe('GET', () => {
    it('should return a list of active donors by default', async () => {
      const mockData = [{ id: 1, name: 'Donor A', is_active: true }];
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/donors');
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(mockData);
    });

    it('should support pagination and filtering', async () => {
      const mockData = [{ id: 2, name: 'Donor B', is_active: false }];
      // Mock the chain: from -> select -> range -> eq -> order
      const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockRange = vi.fn().mockReturnValue({ eq: mockEq, order: mockOrder }); // Allow eq to be optional or chained
      const mockSelect = vi.fn().mockReturnValue({ range: mockRange });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const req = new NextRequest('http://localhost:3000/api/donors?page=2&limit=10&includeInactive=true');
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(mockData);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockRange).toHaveBeenCalledWith(10, 19); // (page - 1) * limit, page * limit - 1
    });
  });

  describe('POST', () => {
    it('should reject unauthenticated users', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const req = new NextRequest('http://localhost:3000/api/donors', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Donor' }),
      });
      const res = await POST(req);

      expect(res.status).toBe(401);
    });

    it('should reject non-admin/non-editor users', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
      // Mock profile check to return member role
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: 'member' }, error: null }),
          }),
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/donors', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Donor' }),
      });
      const res = await POST(req);

      expect(res.status).toBe(403);
    });
  });

  describe('PUT', () => {
     it('should reject non-admin/non-editor users', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: 'member' }, error: null }),
          }),
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/donors', {
        method: 'PUT',
        body: JSON.stringify({ id: 1, name: 'Updated Donor' }),
      });
      const res = await PUT(req);

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE', () => {
     it('should reject non-admin/non-editor users', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { role: 'member' }, error: null }),
          }),
        }),
      });

      const req = new NextRequest('http://localhost:3000/api/donors?id=1', {
        method: 'DELETE',
      });
      const res = await DELETE(req);

      expect(res.status).toBe(403);
    });
  });
});
