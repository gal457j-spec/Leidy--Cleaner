import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import NewBookingClient from '../bookings/new/NewBookingClient';
import { apiClient } from '@/services/api';

jest.mock('@/services/api');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe('NewBooking page', () => {
  beforeEach(() => {
    mockedApi.getServiceById.mockClear();
    mockedApi.getStaffList = jest.fn().mockResolvedValue([]) as any;
  });

  it('shows service info and booking form', async () => {
    mockedApi.getServiceById.mockResolvedValue({ id: 'svc1', name: 'Test', basePrice: 50 } as any);
    render(<NewBookingClient serviceId="svc1" />);
    const titles = await screen.findAllByText(/Servi\u00e7o:/i);
    expect(titles.length).toBeGreaterThanOrEqual(1);
    const names = screen.getAllByText(/Test/i);
    expect(names.length).toBeGreaterThanOrEqual(1);
    // booking form header should appear (may render twice in strict mode)
    const headers = screen.getAllByText(/Novo Agendamento/i);
    expect(headers.length).toBeGreaterThanOrEqual(1);
  });
});
