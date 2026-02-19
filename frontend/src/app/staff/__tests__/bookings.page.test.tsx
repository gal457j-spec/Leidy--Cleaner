import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import StaffBookingsPage from '../bookings/page';
import { apiClient } from '@/services/api';
import { AuthContext } from '@/contexts/AuthContext';

jest.mock('@/services/api');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

function renderWithAuth(children: React.ReactNode) {
  return render(
    <AuthContext.Provider value={{ isAuthenticated: true, user: { id: 's1', role: 'staff' }, login: jest.fn(), logout: jest.fn(), refresh: jest.fn() }}>
      {children}
    </AuthContext.Provider>
  );
}

describe('StaffBookings page', () => {
  beforeEach(() => {
    mockedApi.getStaffBookings.mockClear();
    // ensure helper methods exist
    mockedApi.getStaffById = jest.fn().mockResolvedValue({} as any);
    mockedApi.getStaffAvailability = jest.fn().mockResolvedValue([] as any);
    mockedApi.updateStaffProfile = jest.fn().mockResolvedValue({} as any);
    mockedApi.setStaffAvailability = jest.fn().mockResolvedValue([] as any);
  });

  it('loads assigned bookings', async () => {
    mockedApi.getStaffBookings.mockResolvedValue({ bookings: [{ id: 'b1', serviceName: 'Serv', scheduledDate: new Date().toISOString(), address: 'Rua', totalPrice: 100, status: 'pending' }] } as any);

    renderWithAuth(<StaffBookingsPage />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() => expect(mockedApi.getStaffBookings).toHaveBeenCalled());
    // wait until loading indicator disappears
    await waitFor(() => expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument());
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    // service cell with text "Serv" should appear (not header)
    const cells = screen.getAllByText(/Serv/i);
    // at least one cell should be a <td>
    expect(cells.some(c => c.tagName === 'TD')).toBe(true);
  });

  it('shows profile form and allows update', async () => {
    mockedApi.getStaffBookings.mockResolvedValue({ bookings: [] } as any);
    mockedApi.getStaffById = jest.fn().mockResolvedValue({ id: 's1', name: 'Staff One', bio: 'Hello', phone: '123', photoUrl: '' } as any);
    mockedApi.getStaffAvailability = jest.fn().mockResolvedValue([{ id: 'a1', day: 'Monday', startTime: '09:00', endTime: '12:00' }] as any);
    mockedApi.updateStaffProfile = jest.fn().mockResolvedValue({ id: 's1', name: 'Updated', bio: 'Hello', phone: '123', photoUrl: '' } as any);
    mockedApi.setStaffAvailability = jest.fn().mockResolvedValue([{ id: 'a1', day: 'Monday', startTime: '09:00', endTime: '12:00' }] as any);

    renderWithAuth(<StaffBookingsPage />);
    await waitFor(() => expect(mockedApi.getStaffById).toHaveBeenCalled());
    // form fields should show up
    const nameInput = await screen.findByLabelText(/Nome/i);
    expect(nameInput).toHaveValue('Staff One');

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Updated' } });
    fireEvent.click(screen.getByText(/Salvar perfil/i));
    await waitFor(() => expect(mockedApi.updateStaffProfile).toHaveBeenCalledWith('s1', expect.objectContaining({ name: 'Updated' })));
  });

  it('allows adding availability slot', async () => {
    mockedApi.getStaffBookings.mockResolvedValue({ bookings: [] } as any);
    mockedApi.getStaffById = jest.fn().mockResolvedValue({ id: 's1', name: 'Staff One' } as any);
    mockedApi.getStaffAvailability = jest.fn().mockResolvedValue([] as any);
    mockedApi.setStaffAvailability = jest.fn().mockResolvedValue([{ id: 'a2', day: 'Tuesday', startTime: '10:00', endTime: '11:00' }] as any);

    renderWithAuth(<StaffBookingsPage />);
    await waitFor(() => expect(mockedApi.getStaffAvailability).toHaveBeenCalled());

    fireEvent.change(screen.getByPlaceholderText(/Dia/i), { target: { value: 'Tuesday' } });
    fireEvent.change(screen.getByPlaceholderText(/Início/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByPlaceholderText(/Fim/i), { target: { value: '11:00' } });
    fireEvent.click(screen.getByText(/Adicionar/i));

    await waitFor(() => expect(mockedApi.setStaffAvailability).toHaveBeenCalled());
    expect(screen.getByText(/Tuesday 10:00-11:00/i)).toBeInTheDocument();
  });
});
