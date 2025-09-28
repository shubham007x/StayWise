import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

export const validateSignup = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().isLength({ min: 1 }),
    body('lastName').trim().isLength({ min: 1 }),
    handleValidationErrors
];

export const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    body('password').exists(),
    handleValidationErrors
];

export const validateBooking = [
    body('propertyId').isMongoId(),
    body('checkIn').isISO8601(),
    body('checkOut').isISO8601(),
    body('guests').isInt({ min: 1 }),
    handleValidationErrors
];