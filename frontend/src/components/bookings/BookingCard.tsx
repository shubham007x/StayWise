import { Booking } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Image from 'next/image';

interface BookingCardProps {
    booking: Booking;
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
};

export default function BookingCard({ booking }: BookingCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
                <div className="md:w-48 h-48 md:h-auto relative">
                    <Image
                        src={booking.property.images[0]}
                        alt={booking.property.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {booking.property.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.property.location.city}, {booking.property.location.country}
                            </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[booking.status]}`}>
                            {booking.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <div>
                                <div>Check-in: {formatDate(booking.checkIn)}</div>
                                <div>Check-out: {formatDate(booking.checkOut)}</div>
                            </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Booked on {formatDate(booking.createdAt)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Booking ID: #{booking._id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                            {formatCurrency(booking.totalPrice)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}