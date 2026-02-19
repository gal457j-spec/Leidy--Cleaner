import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StaffDirectoryPage from '../staff-directory/page';
import { apiClient } from '@/services/api';

jest.mock('@/services/api');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe('StaffDirectoryPage', () => {
  it('loads and displays staff members', async () => {
    mockedApi.getStaffList.mockResolvedValue([
      { id: 's1', name: 'Staff One', bio: 'Bio', photoUrl: '', email: 's1@v.com', role: 'staff' },
    ] as any);
    mockedApi.getStaffRating.mockResolvedValue(4.5 as any);

    render(<StaffDirectoryPage />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() => expect(mockedApi.getStaffList).toHaveBeenCalled());
    await screen.findByText(/Staff One/i);
    expect(screen.getByText(/4\.5 ⭐/i)).toBeInTheDocument();
  });
});
