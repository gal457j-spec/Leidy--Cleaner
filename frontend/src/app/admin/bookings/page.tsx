"use client";

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import BookingList from '@/components/admin/BookingList';

export default function AdminBookingsPage() {
  return (
    <ProtectedRoute role="admin">
      <div>
        <h2 className="text-2xl font-bold mb-4">Bookings (Admin)</h2>
        <BookingList />
      </div>
    </ProtectedRoute>
  );
}
