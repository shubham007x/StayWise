'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({
    children,
    requireAuth = true,
    requireAdmin = false
}: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !user) {
                router.push('/login');
            } else if (requireAdmin && user?.role !== 'admin') {
                router.push('/login');
            }
        }
    }, [user, isLoading, requireAuth, requireAdmin, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (requireAuth && !user) {
        return null;
    }

    if (requireAdmin && user?.role !== 'admin') {
        return null;
    }

    return <>{children}</>;
}