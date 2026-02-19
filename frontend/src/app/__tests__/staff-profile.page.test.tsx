import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StaffProfilePage from '../staff-profile/[id]/page';
import { apiClient } from '@/services/api';

jest.mock('@/services/api');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe('StaffProfilePage', () => {
  it('fetches and shows profile data including rating and reviews', async () => {
    mockedApi.getStaffById.mockResolvedValue({ id: 's1', name: 'Staff One', bio: 'Bio text', phone: '123' } as any);
    mockedApi.getStaffRating.mockResolvedValue(4.2 as any);
    mockedApi.getStaffReviews.mockResolvedValue([{ id: 'r1', rating: 5, comment: 'Great!' }] as any);

    render(<StaffProfilePage params={{ id: 's1' }} /> as any);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
    await waitFor(() => expect(mockedApi.getStaffById).toHaveBeenCalledWith('s1'));
    await screen.findByText(/Staff One/i);
    expect(screen.getByText(/Bio text/i)).toBeInTheDocument();
    expect(screen.getByText(/Avaliação média: 4\.2/i)).toBeInTheDocument();
    expect(screen.getByText(/Great!/i)).toBeInTheDocument();
  });
});
