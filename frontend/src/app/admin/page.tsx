'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Booking, User, Property } from '@/types';
import BookingCard from '@/components/bookings/BookingCard';
import UserAdminCard from '@/components/admin/UserAdminCard';
import PropertyAdminCard from '@/components/admin/PropertyAdminCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import {
    Users,
    Home,
    Calendar,
    DollarSign,
    TrendingUp,
    Filter
} from 'lucide-react';

interface AdminStats {
    totalUsers: number;
    totalProperties: number;
    totalBookings: number;
    totalRevenue: number;
    recentBookings: Booking[];
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

function AdminDashboardContent() {
    const [selectedTab, setSelectedTab] = useState<'overview' | 'bookings' | 'users' | 'properties'>('overview');
    const [statusFilter, setStatusFilter] = useState('all');
    const queryClient = useQueryClient();

    // Fetch admin stats
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            // In a real app, you'd have a dedicated stats endpoint
            const [bookingsRes, propertiesRes] = await Promise.all([
                api.get('/bookings'),
                api.get('/properties?limit=1000')
            ]);

            const bookings = bookingsRes.data.data.bookings;
            const properties = propertiesRes.data.data.properties;

            return {
                totalUsers: bookings.reduce((acc: Set<string>, booking: Booking) => {
                    if (typeof booking.user === 'object') {
                        acc.add(booking.user.id);
                    }
                    return acc;
                }, new Set()).size,
                totalProperties: properties.length,
                totalBookings: bookings.length,
                totalRevenue: bookings.reduce((sum: number, booking: Booking) => sum + booking.totalPrice, 0),
                recentBookings: bookings.slice(0, 5)
            };
        }
    });

    // Fetch all bookings for bookings tab
    const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
        queryKey: ['admin-bookings', statusFilter],
        queryFn: async () => {
            const response = await api.get('/bookings');
            let bookings = response.data.data.bookings;

            if (statusFilter !== 'all') {
                bookings = bookings.filter((booking: Booking) => booking.status === statusFilter);
            }

            return { bookings };
        }
    });

    // Fetch users
    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const response = await api.get('/users');
            return response.data.data.users;
        }
    });

    const updateUserMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: { role?: string; isActive?: boolean } }) => {
            const response = await api.put(`/users/${id}`, updates);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }
    });

    // Fetch properties
    const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
        queryKey: ['admin-properties'],
        queryFn: async () => {
            const response = await api.get('/properties/admin');
            return response.data.data.properties;
        }
    });

    const updatePropertyMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: { isApproved?: boolean; isActive?: boolean } }) => {
            const response = await api.put(`/properties/${id}`, updates);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
        }
    });

    const handleUpdateUser = (id: string, updates: { role?: string; isActive?: boolean }) => {
        updateUserMutation.mutate({ id, updates });
    };

    const handleUpdateProperty = (id: string, updates: { isApproved?: boolean; isActive?: boolean }) => {
        updatePropertyMutation.mutate({ id, updates });
    };

    const stats = statsData as AdminStats | undefined;
    const bookings = bookingsData?.bookings || [];
    const users = usersData || [];
    const properties = propertiesData || [];

    if (statsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-gray-600 mt-1">Manage your StayWise platform</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {/* <Button variant="outline" size="sm" className="flex items-center space-x-2">
                                    <Download className="h-4 w-4" />
                                    <span>Export Data</span>
                                </Button> */}
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="mt-6 border-b">
                            <nav className="flex space-x-8">
                                {[
                                    { key: 'overview', label: 'Overview', icon: TrendingUp },
                                    { key: 'bookings', label: 'Bookings', icon: Calendar },
                                    { key: 'users', label: 'Users', icon: Users },
                                    { key: 'properties', label: 'Properties', icon: Home },
                                ].map(({ key, label, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedTab(key as 'overview' | 'bookings' | 'users' | 'properties')}
                                        className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${selectedTab === key
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {selectedTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Users"
                                value={stats?.totalUsers || 0}
                                icon={Users}
                                color="bg-blue-500"
                            />
                            <StatCard
                                title="Total Properties"
                                value={stats?.totalProperties || 0}
                                icon={Home}
                                color="bg-green-500"
                            />
                            <StatCard
                                title="Total Bookings"
                                value={stats?.totalBookings || 0}
                                icon={Calendar}
                                color="bg-purple-500"
                            />
                            <StatCard
                                title="Total Revenue"
                                value={`${(stats?.totalRevenue || 0).toLocaleString()}`}
                                icon={DollarSign}
                                color="bg-yellow-500"
                            />
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-xl shadow-sm border">
                                <div className="p-6 border-b">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                                </div>
                                <div className="p-6">
                                    {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                                        <div className="space-y-4">
                                            {stats.recentBookings.map((booking) => (
                                                <div key={booking._id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{booking.property.title}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {typeof booking.user === 'object'
                                                                ? `${booking.user.firstName} ${booking.user.lastName}`
                                                                : 'User'
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">${booking.totalPrice}</p>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                    'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No recent bookings</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border">
                                <div className="p-6 border-b">
                                    <h2 className="text-lg font-semibold text-gray-900">Booking Status Distribution</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {['confirmed', 'pending', 'cancelled', 'completed'].map((status) => {
                                            const count = stats?.recentBookings?.filter(b => b.status === status).length || 0;
                                            const percentage = stats?.totalBookings ? (count / stats.totalBookings) * 100 : 0;

                                            return (
                                                <div key={status} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-3 h-3 rounded-full ${status === 'confirmed' ? 'bg-green-500' :
                                                            status === 'pending' ? 'bg-yellow-500' :
                                                                status === 'cancelled' ? 'bg-red-500' :
                                                                    'bg-blue-500'
                                                            }`} />
                                                        <span className="capitalize text-sm text-gray-700">{status}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-gray-900">{count}</span>
                                                        <span className="text-sm text-gray-500">({percentage.toFixed(1)}%)</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTab === 'bookings' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-sm border p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Filter className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
                                </div>
                            </div>
                        </div>

                        {/* Bookings List */}
                        {bookingsLoading ? (
                            <div className="flex justify-center py-8">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
                                <p className="text-gray-600">No bookings match the current filter criteria.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bookings.map((booking: Booking) => (
                                    <BookingCard key={booking._id} booking={booking} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {selectedTab === 'users' && (
                    <div className="space-y-6">
                        {/* Users List */}
                        <>
                            <div className="bg-white rounded-xl shadow-sm border p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        {users.length} user{users.length !== 1 ? 's' : ''} found
                                    </div>
                                </div>
                            </div>

                            {usersLoading ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner size="lg" />
                                </div>
                            ) : users.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
                                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                                    <p className="text-gray-600">No users are registered on the platform.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {users.map((user: User) => (
                                        <UserAdminCard
                                            key={user.id}
                                            user={user}
                                            onUpdateUser={handleUpdateUser}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    </div>
                )}

                {selectedTab === 'properties' && (
                    <div className="space-y-6">
                        {/* Properties List */}
                        <>
                            <div className="bg-white rounded-xl shadow-sm border p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} found
                                    </div>
                                </div>
                            </div>

                            {propertiesLoading ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner size="lg" />
                                </div>
                            ) : properties.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
                                    <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
                                    <p className="text-gray-600">No properties are listed on the platform.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {properties.map((property: Property) => (
                                        <PropertyAdminCard
                                            key={property._id}
                                            property={property}
                                            onUpdateProperty={handleUpdateProperty}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminPage() {
    return (
        <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
