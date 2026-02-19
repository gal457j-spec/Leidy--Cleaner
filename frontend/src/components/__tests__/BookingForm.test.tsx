import React from 'react';
import { render, screen, fireEvent, waitFor, rerender } from '@testing-library/react';
import BookingForm from '../BookingForm';
import { apiClient } from '@/services/api';

jest.mock('@/services/api');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe('BookingForm', () => {
  beforeEach(() => {
    mockedApi.getServiceById.mockClear();
    mockedApi.getStaffList.mockClear();
    mockedApi.createBooking.mockClear();
  });

  it('renders form and allows selecting staff', async () => {
    mockedApi.getServiceById.mockResolvedValue({ id: 'svc1', name: 'S', basePrice: 100 } as any);
    mockedApi.getStaffList.mockResolvedValue([{ id: 'st1', name: 'Staff One', rating: 4.5 }] as any);
    mockedApi.createBooking.mockResolvedValue({ id: 'b1' } as any);

    const onSuccess = jest.fn();
    const { rerender } = render(<BookingForm serviceId="svc1" onSuccess={onSuccess} />);

    // wait for staff dropdown to appear
    await screen.findByText(/Staff One/i);

    // use initialDate prop to avoid interacting with date picker
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    // rerender with initialDate set
    rerender(
      <BookingForm serviceId="svc1" initialDate={future} onSuccess={onSuccess} />
    );
    // fill address and select staff
    fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: 'Rua Teste' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'st1' } });

    fireEvent.click(screen.getByText(/Agendar/i));

    await waitFor(() => expect(mockedApi.createBooking).toHaveBeenCalled());
    expect(mockedApi.createBooking).toHaveBeenCalledWith(expect.objectContaining({ staffId: 'st1' }));
  });
});