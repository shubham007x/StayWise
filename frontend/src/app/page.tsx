'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Property } from '@/types';
import PropertyCard from '@/components/layout/PropertyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['properties', { limit: 6 }],
    queryFn: async () => {
      const response = await api.get('/properties?limit=6');
      return response.data;
    }
  });

  const featuredProperties = propertiesData?.data?.properties || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-up">
              Discover amazing properties around the world. Book unique accommodations
              and create unforgettable memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/properties">
                <Button size="lg" variant="secondary" className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Browse Properties</span>
                </Button>
              </Link>
              <Link href={user ? (user.role === 'admin' ? '/admin' : '/') : '/login'}>
                <Button size="lg" variant="outline" className="flex items-center space-x-2 border-white text-black hover:bg-white hover:text-primary-600">
                  <Calendar className="h-5 w-5" />
                  <span>{user ? 'Start Booking' : 'Sign In to Book'}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose StayWise?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find and book the perfect accommodation for your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Search</h3>
              <p className="text-gray-600">
                Find properties quickly with our advanced search and filtering options.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Great Locations</h3>
              <p className="text-gray-600">
                Properties in prime locations worldwide, from city centers to scenic retreats.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Community</h3>
              <p className="text-gray-600">
                Join thousands of travelers who trust StayWise for their accommodation needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Properties
              </h2>
              <p className="text-lg text-gray-600">
                Discover our most popular and highly-rated properties
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline">View All Properties</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property: Property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have found their perfect stay with StayWise.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}