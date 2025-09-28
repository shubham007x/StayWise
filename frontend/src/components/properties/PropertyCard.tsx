'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Users, Star } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {property.type}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>{property.location.city}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-yellow-500">
            <Star className="h-3 w-3 fill-current" />
            <span>4.8</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>Up to {property.capacity} guests</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-primary-600">
              {formatCurrency(property.price)}
            </div>
            <div className="text-xs text-gray-500">night</div>
          </div>
        </div>
        
        <Link
          href={`/properties/${property._id}`}
          className="block w-full text-center py-2 px-4 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
