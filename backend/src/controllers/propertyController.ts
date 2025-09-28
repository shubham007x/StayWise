import { Request, Response } from 'express';
import { Property } from '../models/Property';

export const getProperties = async (req: Request, res: Response) => {
    try {
        const {
            search,
            type,
            minPrice,
            maxPrice,
            capacity,
            city,
            page = 1,
            limit = 10
        } = req.query;

        const filter: any = { isActive: true };

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (type) filter.type = type;
        if (city) filter['location.city'] = { $regex: city, $options: 'i' };
        if (capacity) filter.capacity = { $gte: parseInt(capacity as string) };

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const properties = await Property.find(filter)
            .populate('owner', 'firstName lastName')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Property.countDocuments(filter);

        res.json({
            success: true,
            data: {
                properties,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    totalProperties: total,
                    hasNext: pageNum < Math.ceil(total / limitNum),
                    hasPrev: pageNum > 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching properties'
        });
    }
};

export const getProperty = async (req: Request, res: Response) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('owner', 'firstName lastName email');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        res.json({
            success: true,
            data: { property }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching property'
        });
    }
};

export const getAllProperties = async (req: Request, res: Response) => {
    try {
        const properties = await Property.find()
            .populate('owner', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { properties }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching all properties'
        });
    }
};

export const updateProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isApproved, isActive } = req.body;

        const updateData: any = {};
        if (isApproved !== undefined) updateData.isApproved = isApproved;
        if (isActive !== undefined) updateData.isActive = isActive;

        const property = await Property.findByIdAndUpdate(id, updateData, { new: true })
            .populate('owner', 'firstName lastName email');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        res.json({
            success: true,
            message: 'Property updated successfully',
            data: { property }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating property'
        });
    }
};
