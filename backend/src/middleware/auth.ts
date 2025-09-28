import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        (req as AuthRequest).user = user;
        next();
    });
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if ((req as AuthRequest).user?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};
