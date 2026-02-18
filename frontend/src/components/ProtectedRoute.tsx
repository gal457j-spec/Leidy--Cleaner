"use client";

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children, role }: { children: ReactNode; role?: string }) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (!loading && role && user?.role !== role) {
      router.push('/');
    }
  }, [isAuthenticated, user, role, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (role && user?.role !== role) return null;

  return <>{children}</>;
}
