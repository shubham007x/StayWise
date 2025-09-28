export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: string;
}

export interface Property {
    _id: string;
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
    owner: {
        firstName: string;
        lastName: string;
        email?: string;
    };
    isActive: boolean;
    isApproved: boolean;
    createdAt: string;
}

export interface Booking {
    _id: string;
    property: Property;
    user: User;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}