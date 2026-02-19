import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../profile/page';
import { apiClient } from '@/services/api';
import { AuthContext } from '@/contexts/AuthContext';

jest.mock('@/services/api');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe('ProfilePage', () => {
  beforeEach(() => {
    mockedApi.getProfile.mockClear();
    mockedApi.updateProfile.mockClear();
  });

  function renderWithAuth(children: React.ReactNode) {
    return render(
      <AuthContext.Provider value={{ isAuthenticated: true, user: { id: 'u1', role: 'customer' }, login: jest.fn(), logout: jest.fn(), refresh: jest.fn() }}>
        {children}
      </AuthContext.Provider>
    );
  }

  it('loads and updates profile', async () => {
    mockedApi.getProfile.mockResolvedValue({ email: 'a@b.com', name: 'Alice', phone: '123' } as any);
    mockedApi.updateProfile.mockResolvedValue({ email: 'a@b.com', name: 'Alice B', phone: '456' } as any);

    renderWithAuth(<ProfilePage />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
    await waitFor(() => expect(mockedApi.getProfile).toHaveBeenCalled());
    // wait for form fields to appear
    const nameInput = await screen.findByLabelText(/Nome/i);
    const phoneInput = await screen.findByLabelText(/Telefone/i);

    fireEvent.change(nameInput, { target: { value: 'Alice B' } });
    fireEvent.change(phoneInput, { target: { value: '456' } });
    fireEvent.click(screen.getByText(/Salvar/i));

    await waitFor(() => expect(mockedApi.updateProfile).toHaveBeenCalled());
    expect(screen.getByText(/sucesso/i)).toBeInTheDocument();
  });
});
