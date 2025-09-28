'use client';

import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Calendar, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <Home className="h-8 w-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">StayWise</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link
                            href={user?.role === 'admin' ? '/admin' : '/properties'}
                            className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            {user?.role === 'admin' ? 'Dashboard' : 'Properties'}
                        </Link>

                        {user ? (
                            <>
                                {user.role !== 'admin' && (
                                    <Link
                                        href="/bookings"
                                        className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        <span>My Bookings</span>
                                    </Link>
                                )}

                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-700">
                                            {user.firstName} {user.lastName}
                                        </span>
                                        {user.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full hover:bg-primary-200 transition-colors"
                                            >
                                                Admin
                                            </Link>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}