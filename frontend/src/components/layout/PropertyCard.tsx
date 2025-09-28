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
        <Link href={`/properties/${property._id}`} className="group">
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={property._id === 'featured' ? true : false} // Add priority for LCP if needed, adjust based on data
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-900">
                            {formatCurrency(property.price)}/night
                        </span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {property.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>4.8</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{property.location.city}, {property.location.country}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                        <Users className="h-4 w-4" />
                        <span>Up to {property.capacity} guests</span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {property.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                        {property.amenities.slice(0, 3).map((amenity) => (
                            <span
                                key={amenity}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                                {amenity}
                            </span>
                        ))}
                        {property.amenities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                +{property.amenities.length - 3} more
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}