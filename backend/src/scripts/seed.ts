// src/scripts/seed.ts
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { Booking } from '../models/Booking';

dotenv.config();

const sampleProperties = [
    {
        title: "Luxury Beachfront Villa",
        description: "Stunning oceanfront villa with private beach access, infinity pool, and panoramic sea views. Perfect for families and groups seeking luxury.",
        images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
        ],
        location: {
            address: "123 Ocean Drive",
            city: "Malibu",
            country: "USA",
            coordinates: [-118.7798, 34.0259]
        },
        price: 450,
        capacity: 8,
        amenities: ["WiFi", "Pool", "Beach Access", "Kitchen", "Parking", "Air Conditioning", "Ocean View"],
        type: "villa" as const
    },
    {
        title: "Modern Downtown Apartment",
        description: "Stylish apartment in the heart of the city with modern amenities, rooftop terrace, and walking distance to major attractions.",
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
        ],
        location: {
            address: "456 Urban Street",
            city: "New York",
            country: "USA",
            coordinates: [-74.0060, 40.7128]
        },
        price: 180,
        capacity: 4,
        amenities: ["WiFi", "Kitchen", "Gym", "Rooftop Terrace", "Air Conditioning", "City View"],
        type: "apartment" as const
    },
    {
        title: "Cozy Mountain Cabin",
        description: "Rustic cabin nestled in the mountains, perfect for a peaceful retreat with hiking trails, fireplace, and stunning mountain views.",
        images: [
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800"
        ],
        location: {
            address: "789 Mountain Trail",
            city: "Aspen",
            country: "USA",
            coordinates: [-106.8175, 39.1911]
        },
        price: 220,
        capacity: 6,
        amenities: ["WiFi", "Fireplace", "Kitchen", "Hiking Trails", "Mountain View", "Hot Tub"],
        type: "house" as const
    },
    {
        title: "Urban Studio Loft",
        description: "Trendy studio loft in artistic district with exposed brick, high ceilings, and close to galleries, cafes, and nightlife.",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
            "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800",
            "https://images.unsplash.com/photo-1581404917879-264e7e4ecf9c?w=800"
        ],
        location: {
            address: "101 Art District Ave",
            city: "Portland",
            country: "USA",
            coordinates: [-122.6587, 45.5152]
        },
        price: 95,
        capacity: 2,
        amenities: ["WiFi", "Kitchen", "Exposed Brick", "High Ceilings", "Art District Location"],
        type: "studio" as const
    },
    {
        title: "Lakeside Family House",
        description: "Spacious family home on a serene lake with private dock, kayaks, fishing equipment, and beautiful sunset views.",
        images: [
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
        ],
        location: {
            address: "555 Lake View Road",
            city: "Lake Tahoe",
            country: "USA",
            coordinates: [-120.0324, 39.0968]
        },
        price: 320,
        capacity: 10,
        amenities: ["WiFi", "Lake Access", "Kayaks", "Fishing", "BBQ Grill", "Fireplace", "Large Kitchen"],
        type: "house" as const
    },
    {
        title: "Historic Townhouse",
        description: "Charming historic townhouse in cobblestone district with period features, modern updates, and walking tours nearby.",
        images: [
            "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800"
        ],
        location: {
            address: "777 Historic Lane",
            city: "Boston",
            country: "USA",
            coordinates: [-71.0589, 42.3601]
        },
        price: 275,
        capacity: 6,
        amenities: ["WiFi", "Historic Features", "Modern Kitchen", "Fireplace", "Garden", "Central Location"],
        type: "house" as const
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Property.deleteMany({});
        await Booking.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const admin = new User({
            email: 'admin@staywise.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
        });
        await admin.save();
        console.log('Created admin user');

        // Create sample users
        const users = [];
        for (let i = 1; i <= 3; i++) {
            const user = new User({
                email: `user${i}@example.com`,
                password: 'password123',
                firstName: `User${i}`,
                lastName: `Test`,
                role: 'user'
            });
            await user.save();
            users.push(user);
        }
        console.log('Created sample users');

        // Create properties
        const properties = [];
        for (const propertyData of sampleProperties) {
            const property = new Property({
                ...propertyData,
                owner: admin._id
            });
            await property.save();
            properties.push(property);
        }
        console.log('Created sample properties');

        // Create sample bookings
        const bookings = [
            {
                property: properties[0]._id,
                user: users[0]._id,
                checkIn: new Date('2024-12-15'),
                checkOut: new Date('2024-12-20'),
                guests: 4,
                totalPrice: properties[0].price * 5,
                status: 'confirmed'
            },
            {
                property: properties[1]._id,
                user: users[1]._id,
                checkIn: new Date('2024-12-22'),
                checkOut: new Date('2024-12-25'),
                guests: 2,
                totalPrice: properties[1].price * 3,
                status: 'pending'
            },
            {
                property: properties[2]._id,
                user: users[2]._id,
                checkIn: new Date('2025-01-05'),
                checkOut: new Date('2025-01-12'),
                guests: 6,
                totalPrice: properties[2].price * 7,
                status: 'confirmed'
            }
        ];

        for (const bookingData of bookings) {
            const booking = new Booking(bookingData);
            await booking.save();
        }
        console.log('Created sample bookings');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Sample Data Created:');
        console.log('Admin User: admin@staywise.com / admin123');
        console.log('Test Users: user1@example.com, user2@example.com, user3@example.com / password123');
        console.log(`Properties: ${properties.length} sample properties`);
        console.log(`Bookings: ${bookings.length} sample bookings`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();