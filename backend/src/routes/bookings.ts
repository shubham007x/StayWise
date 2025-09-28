import express from 'express';
import { createBooking, getUserBookings, getAllBookings } from '../controllers/bookingController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateBooking } from '../middleware/validation';

const router = express.Router();

router.post('/', authenticateToken, validateBooking, createBooking);
router.get('/my-bookings', authenticateToken, getUserBookings);
router.get('/', authenticateToken, requireAdmin, getAllBookings);

export { router as bookingRoutes };
