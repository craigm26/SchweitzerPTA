// @vitest-environment jsdom
import * as matchers from '@testing-library/jest-dom/matchers';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DonorManagementPage from '../page';
import { getDonors, deleteDonor } from '@/lib/api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

expect.extend(matchers);

// Mock the API calls
vi.mock('@/lib/api', () => ({
  getDonors: vi.fn(),
  createDonor: vi.fn(),
  updateDonor: vi.fn(),
  deleteDonor: vi.fn(),
}));

describe('DonorManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the donor list', async () => {
    const mockDonors = [
      { id: 1, name: 'Donor A', website: 'https://a.com', logo: 'a.png', is_active: true },
      { id: 2, name: 'Donor B', website: 'https://b.com', logo: 'b.png', is_active: false },
    ];
    (getDonors as any).mockResolvedValue(mockDonors);

    render(<DonorManagementPage />);

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText('Loading donors...')).not.toBeInTheDocument());

    expect(screen.getByText('Donor A')).toBeInTheDocument();
    expect(screen.getByText('Donor B')).toBeInTheDocument();
  });

  it('handles delete donor', async () => {
    const user = userEvent.setup();
    const mockDonors = [
      { id: 1, name: 'Donor A', website: 'https://a.com', logo: 'a.png', is_active: true },
    ];
    (getDonors as any).mockResolvedValue(mockDonors);
    (deleteDonor as any).mockResolvedValue({ success: true });
    
    // Mock confirm on the window object
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    render(<DonorManagementPage />);

    await waitFor(() => expect(screen.queryByText('Loading donors...')).not.toBeInTheDocument());

    const deleteButtons = screen.getAllByText('delete');
    await user.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalled();
    await waitFor(() => expect(deleteDonor).toHaveBeenCalledWith(1));
    await waitFor(() => expect(screen.queryByText('Donor A')).not.toBeInTheDocument());
    
    confirmSpy.mockRestore();
  });
});