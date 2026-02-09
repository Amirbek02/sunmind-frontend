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

  const hasRole = (roleName: string) =>
    user?.roles?.some((r) => r.role_name.toLowerCase() === roleName.toLowerCase());

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (requiredRole && !hasRole(requiredRole) && !hasRole('admin')) {
      router.push('/dashboard/control');
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated) return null;

  if (requiredRole && !hasRole(requiredRole) && !hasRole('admin')) {
    return null;
  }

  return <>{children}</>;
}
