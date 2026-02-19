import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewList from '../ReviewList';

describe('ReviewList', () => {
  it('shows message when empty', () => {
    render(<ReviewList reviews={[]} />);
    expect(screen.getByText(/Nenhuma avaliação/i)).toBeInTheDocument();
  });

  it('renders reviews', () => {
    const reviews = [
      { id: 'r1', rating: 4, comment: 'Bom', createdAt: new Date().toISOString() },
      { id: 'r2', rating: 5, comment: 'Ótimo', createdAt: new Date().toISOString() },
    ];
    render(<ReviewList reviews={reviews as any} />);
    expect(screen.getByText(/4 ⭐/)).toBeInTheDocument();
    expect(screen.getByText(/5 ⭐/)).toBeInTheDocument();
  });

  it('shows images', () => {
    const reviews = [
      { id: 'r3', rating: 5, images: ['http://a.jpg'], createdAt: new Date().toISOString() },
    ];
    render(<ReviewList reviews={reviews as any} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
