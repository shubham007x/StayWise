import { Request } from 'express';
import { Types } from 'mongoose';

export interface User {
    _id: Types.ObjectId | string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: Date;
}

export interface Property {
    _id: Types.ObjectId | string;
    title: string;
    description: string;
    images: string[];
    location: {
        address: string;
        city: string;
        country: string;
        coordinates: [number, number];
    };
    price: number;
    capacity: number;
    amenities: string[];
    type: 'apartment' | 'house' | 'villa' | 'studio';
    owner: Types.ObjectId | string;
    isActive: boolean;
    isApproved: boolean;
    createdAt: Date;
}

export interface Booking {
    _id: Types.ObjectId | string;
    property: Types.ObjectId | string | Property;
    user: Types.ObjectId | string | User;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: Date;
}

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}
