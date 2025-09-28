'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Booking } from '@/types';
import BookingCard from '@/components/bookings/BookingCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

export default function BookingsPage() {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const endpoint = isAdmin ? '/bookings' : '/bookings/my-bookings';

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings', isAdmin],
    queryFn: async () => {
      const response = await api.get(endpoint);
      return response.data;
    },
    enabled: !!user
  });

  const bookings = bookingsData?.data?.bookings || [];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your bookings.</p>
          <a href="/login">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Sign In
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{isAdmin ? 'All Bookings' : 'My Bookings'}</h1>
          <p className="text-lg text-gray-600">
            {isAdmin ? 'Manage all bookings in the system' : 'Manage your upcoming and past stays'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{isAdmin ? 'No bookings found' : 'No bookings yet'}</h3>
            <p className="text-gray-600">{isAdmin ? 'There are no bookings in the system.' : 'Start exploring properties and make your first booking!'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking: Booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
