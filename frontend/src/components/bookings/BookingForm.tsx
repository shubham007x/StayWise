'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { api } from '@/lib/api';
import { Property } from '@/types';
import { formatCurrency, calculateNights } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Calendar, Users, CreditCard } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface BookingFormProps {
    property: Property;
    onSuccess?: () => void;
}

interface BookingFormData {
    checkIn: Date | null;
    checkOut: Date | null;
    guests: number;
}

export default function BookingForm({ property, onSuccess }: BookingFormProps) {
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const queryClient = useQueryClient();

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<BookingFormData>({
        defaultValues: {
            guests: 1
        }
    });

    const guests = watch('guests');
    const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
    const totalPrice = nights * property.price;

    const bookingMutation = useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: async (data: any) => {
            const response = await api.post('/bookings', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            onSuccess?.();
        }
    });

    const onSubmit = (data: BookingFormData) => {
        if (!checkIn || !checkOut) {
            return;
        }

        bookingMutation.mutate({
            propertyId: property._id,
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
            guests: data.guests
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Book Your Stay</h3>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                        {formatCurrency(property.price)}
                    </div>
                    <div className="text-sm text-gray-600">per night</div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-in
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <DatePicker
                                selected={checkIn}
                                onChange={(date) => setCheckIn(date)}
                                selectsStart
                                startDate={checkIn}
                                endDate={checkOut}
                                minDate={new Date()}
                                placeholderText="Select date"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-out
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <DatePicker
                                selected={checkOut}
                                onChange={(date) => setCheckOut(date)}
                                selectsEnd
                                startDate={checkIn}
                                endDate={checkOut}
                                minDate={checkIn || new Date()}
                                placeholderText="Select date"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guests
                    </label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                            {...register('guests', {
                                required: 'Number of guests is required',
                                min: { value: 1, message: 'At least 1 guest required' },
                                max: { value: property.capacity, message: `Maximum ${property.capacity} guests allowed` }
                            })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        >
                            {Array.from({ length: property.capacity }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'guest' : 'guests'}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.guests && (
                        <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p>
                    )}
                </div>

                {checkIn && checkOut && nights > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{formatCurrency(property.price)} × {nights} nights</span>
                            <span>{formatCurrency(property.price * nights)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2"
                    loading={bookingMutation.isPending}
                    disabled={!checkIn || !checkOut || nights <= 0}
                >
                    <CreditCard className="h-4 w-4" />
                    <span>Book Now</span>
                </Button>

                {bookingMutation.isError && (
                    <div className="text-red-600 text-sm text-center">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(bookingMutation.error as any)?.response?.data?.message || 'Booking failed. Please try again.'}
                    </div>
                )}

                {bookingMutation.isSuccess && (
                    <div className="text-green-600 text-sm text-center">
                        Booking created successfully! Check your bookings page.
                    </div>
                )}
            </form>
        </div>
    );
}
