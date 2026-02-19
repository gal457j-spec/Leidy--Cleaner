import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from '../page';
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

describe('AdminPage', () => {
  it('shows stats including pendingReviews', async () => {
    mockedApi.getServices.mockResolvedValue({ services: [], pagination: {} } as any);
    mockedApi.getStats.mockResolvedValue({ users: 1, services: 2, bookings: 3, pendingReviews: 4 } as any);

    renderWithAuth(<AdminPage />);
    await waitFor(() => expect(mockedApi.getStats).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/Avaliações pendentes/i)).toBeInTheDocument());
    expect(screen.getByText(/4/)).toBeInTheDocument();
  });
});
