import mongoose, { HydratedDocument, Schema } from 'mongoose';
import { Property as IProperty } from '../types';

interface PropertyDocument extends HydratedDocument<IProperty> { }

const propertySchema = new Schema<PropertyDocument>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    amenities: [{
        type: String,
        trim: true
    }],
    type: {
        type: String,
        enum: ['apartment', 'house', 'villa', 'studio'],
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const Property = mongoose.model<PropertyDocument>('Property', propertySchema);