import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';
import { AuthContext } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api';

jest.mock('@/services/api');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

function renderWithAuth(user: any) {
  render(
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login: jest.fn(), logout: jest.fn(), refresh: jest.fn() }}>
      <Navbar />
    </AuthContext.Provider>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    mockedApi.getCompanyInfo.mockResolvedValue({ name: 'Limpar Plus', logoUrl: '/logo.svg' } as any);
  });

  it('shows basic links for anonymous users and logo', async () => {
    renderWithAuth(null);
    // logo should load
    expect(await screen.findByAltText(/Limpar Plus/i)).toBeInTheDocument();

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Serviços/i)).toBeInTheDocument();
    expect(screen.getByText(/Equipe/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('shows admin links when user is admin', async () => {
    renderWithAuth({ id: 'u1', role: 'admin', name: 'Admin' });
    await screen.findByAltText(/Limpar Plus/i);
    const adminLinks = screen.getAllByText(/Admin/i);
    expect(adminLinks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
  });
});
