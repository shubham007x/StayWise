import { Response } from 'express';
import { Booking } from '../models/Booking';
import { Property } from '../models/Property';
import { AuthRequest } from '../types';

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId, checkIn, checkOut, guests } = req.body;
        const userId = req.user!.userId;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        if (guests > property.capacity) {
            return res.status(400).json({
                success: false,
                message: `Property capacity is ${property.capacity} guests`
            });
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkInDate >= checkOutDate) {
            return res.status(400).json({
                success: false,
                message: 'Check-out date must be after check-in date'
            });
        }

        // Check for booking conflicts
        const conflictingBooking = await Booking.findOne({
            property: propertyId,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({
                success: false,
                message: 'Property is not available for selected dates'
            });
        }

        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * property.price;

        const booking = new Booking({
            property: propertyId,
            user: userId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests,
            totalPrice
        });

        await booking.save();
        await booking.populate(['property', 'user']);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking'
        });
    }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
    try {
        const bookings = await Booking.find({ user: req.user!.userId })
            .populate('property')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { bookings }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
    try {
        const bookings = await Booking.find()
            .populate('property')
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { bookings }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching all bookings'
        });
    }
};