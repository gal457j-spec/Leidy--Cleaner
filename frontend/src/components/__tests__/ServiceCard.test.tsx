import React from 'react';
import { render, screen } from '@testing-library/react';
import ServiceCard from '../ServiceCard';

const service = {
  id: 's1',
  name: 'Limpeza Básica',
  description: 'Limpeza rápida e eficiente',
  basePrice: 120,
  durationMinutes: 60,
  category: 'Residencial',
  isActive: true,
};

describe('ServiceCard', () => {
  it('renderiza informações do serviço', () => {
    render(<ServiceCard service={service as any} />);

    expect(screen.getByText(/Limpeza Básica/i)).toBeInTheDocument();
    expect(screen.getByText(/Limpeza rápida e eficiente/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 120/i)).toBeInTheDocument();
    expect(screen.getByText(/60 min/i)).toBeInTheDocument();
    // link should exist
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/services/s1');
  });
});
