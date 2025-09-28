'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';
import BookingForm from '@/components/bookings/BookingForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { MapPin, Users, Star, Wifi, Car, Utensils, Waves, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

  const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Kitchen': Utensils,
    'Pool': Waves,
    'Beach Access': Waves,
    'Ocean View': Waves,
    'Lake Access': Waves,
  };

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  const { data: propertyData, isLoading, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}`);
      return response.data;
    },
    enabled: !!propertyId
  });

  const property = propertyData?.data?.property;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h1>
          <Link href="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/properties" className="flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location.address}, {property.location.city}, {property.location.country}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (124 reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">
                {formatCurrency(property.price)}
              </div>
              <div className="text-sm text-gray-600">per night</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative h-96 rounded-xl overflow-hidden">
                <Image
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />

                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {property.images.map((_: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {property.images.slice(0, 4).map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden ${index === currentImageIndex ? 'ring-2 ring-primary-600' : ''
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <div className="font-semibold">Up to {property.capacity} guests</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold capitalize">{property.type}</div>
                  <div className="text-sm text-gray-600">Property type</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{property.amenities.length}+ amenities</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity: string) => {
                  const IconComponent = amenityIcons[amenity] || Wifi;
                  return (
                    <div key={amenity} className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-primary-600" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Host Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Meet your host</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">
                    {property.owner.firstName.charAt(0)}{property.owner.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">
                    {property.owner.firstName} {property.owner.lastName}
                  </div>
                  <div className="text-sm text-gray-600">Property host</div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {user ? (
                <BookingForm
                  property={property}
                  onSuccess={() => setShowBookingSuccess(true)}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to book?</h3>
                  <p className="text-gray-600 mb-6">Sign in to start your booking</p>
                  <div className="space-y-3">
                    <Link href="/login" className="block">
                      <Button className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/signup" className="block">
                      <Button variant="outline" className="w-full">Create Account</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showBookingSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your booking request has been submitted successfully.</p>
              <div className="space-y-3">
                <Link href="/bookings">
                  <Button className="w-full">View My Bookings</Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowBookingSuccess(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}