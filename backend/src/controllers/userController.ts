import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../types';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { users }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { role, isActive } = req.body;

        const updateData: any = {};
        if (role !== undefined) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;

        const user = await User.findByIdAndUpdate(id, updateData, { new: true })
            .select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user'
        });
    }
};
