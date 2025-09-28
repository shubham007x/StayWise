import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { Booking as IBooking } from '../types';

interface BookingDocument extends HydratedDocument<IBooking> { }

const bookingSchema = new Schema<BookingDocument>({
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Prevent overlapping bookings
bookingSchema.index({
    property: 1,
    checkIn: 1,
    checkOut: 1
});

export const Booking = mongoose.model<BookingDocument>('Booking', bookingSchema);