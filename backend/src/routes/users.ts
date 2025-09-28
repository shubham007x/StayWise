import express from 'express';
import { getAllUsers, updateUser } from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.put('/:id', authenticateToken, requireAdmin, updateUser);

export { router as userRoutes };
