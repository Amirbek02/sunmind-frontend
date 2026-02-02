'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'instructor';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
      router.push('/dashboard/control');
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
