import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminReviews from '../reviews/page';
import { apiClient } from '@/services/api';
import { AuthContext } from '@/contexts/AuthContext';

jest.mock('@/services/api');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

function renderWithAuth(children: React.ReactNode) {
  return render(
    <AuthContext.Provider value={{ isAuthenticated: true, user: { id: 'a', role: 'admin' }, login: jest.fn(), logout: jest.fn(), refresh: jest.fn() }}>
      {children}
    </AuthContext.Provider>
  );
}

describe('AdminReviews page', () => {
  it('list reviews and allows approving', async () => {
    mockedApi.client.get.mockResolvedValue({ data: { data: { reviews: [{ id: 'r1', serviceName: 'S', rating: 5, isApproved: false, createdAt: new Date().toISOString() }] } } });
    mockedApi.client.put.mockResolvedValue({});
    mockedApi.client.delete.mockResolvedValue({});

    renderWithAuth(<AdminReviews />);

    expect(screen.getByText(/Carregando avaliações/i)).toBeInTheDocument();
    await waitFor(() => expect(mockedApi.client.get).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText(/Carregando avaliações/i)).not.toBeInTheDocument());
    // rating appears inside the row text
    expect(screen.getByText(/⭐/)).toBeInTheDocument();
    expect(screen.getByText(/Aprovar/i)).toBeInTheDocument();
  });
});
