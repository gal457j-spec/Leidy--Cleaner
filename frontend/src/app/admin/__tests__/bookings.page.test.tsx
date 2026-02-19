import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminBookingsPage from '../bookings/page';
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

describe('AdminBookings page', () => {
  it('loads bookings and staff list and allows assignment', async () => {
    mockedApi.getAllBookings.mockResolvedValue({ bookings: [{ id: 'b1', serviceName: 'Serv', userId: 'u1', scheduledDate: new Date().toISOString(), address: 'Rua', totalPrice: 100, status: 'pending' }] } as any);
    mockedApi.getUsersByRole.mockResolvedValue([{ id: 's1', name: 'Staff One' }] as any);
    mockedApi.assignStaffToBooking.mockResolvedValue({ id: 'b1', staffId: 's1' } as any);

    renderWithAuth(<AdminBookingsPage />);
    expect(screen.getByText(/Carregando bookings/i)).toBeInTheDocument();

    await waitFor(() => expect(mockedApi.getAllBookings).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText(/Carregando bookings/i)).not.toBeInTheDocument());
    // verify row exists by id rather than service header
    expect(screen.getByText('b1')).toBeInTheDocument();

    // simulate assign on first combobox (staff selector)
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 's1' } });
    await waitFor(() => expect(mockedApi.assignStaffToBooking).toHaveBeenCalled());
  });
});
