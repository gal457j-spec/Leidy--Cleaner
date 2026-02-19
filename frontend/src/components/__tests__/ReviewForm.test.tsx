import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewForm from '../ReviewForm';
import { apiClient } from '../../services/api';

jest.mock('../../services/api');
const mockedApi = apiClient as jest.Mocked<typeof apiClient>;

describe('ReviewForm', () => {
  beforeEach(() => {
    mockedApi.createReview.mockClear();
  });

  it('submits rating and comment', async () => {
    const fake = { id: 'r1', rating: 3, comment: 'ok' };
    mockedApi.createReview.mockResolvedValue(fake as any);
    mockedApi.client.post.mockResolvedValue({});

    const onSubmitted = jest.fn();
    render(<ReviewForm bookingId="b1" onSubmitted={onSubmitted} />);

    fireEvent.change(screen.getByLabelText(/Nota/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/Comentário/i), { target: { value: 'ok' } });
    fireEvent.click(screen.getByText(/Enviar avaliação/i));

    await waitFor(() => expect(mockedApi.createReview).toHaveBeenCalled());
    expect(onSubmitted).toHaveBeenCalledWith(fake);
  });

  it('uploads files when provided', async () => {
    const fake = { id: 'r2', rating: 4 };
    mockedApi.createReview.mockResolvedValue(fake as any);
    mockedApi.client.post.mockResolvedValue({});

    const onSubmitted = jest.fn();
    render(<ReviewForm bookingId="b1" onSubmitted={onSubmitted} />);

    const file = new File(['blob'], 'photo.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Fotos/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.change(screen.getByLabelText(/Nota/i), { target: { value: '4' } });
    fireEvent.click(screen.getByText(/Enviar avaliação/i));

    await waitFor(() => expect(mockedApi.createReview).toHaveBeenCalled());
    expect(mockedApi.client.post).toHaveBeenCalledWith(expect.stringContaining('/reviews/r2/images'), expect.any(FormData), expect.anything());
  });
});
