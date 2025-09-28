import express from 'express';
import { getProperties, getProperty, getAllProperties, updateProperty } from '../controllers/propertyController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', getProperties);
router.get('/:id', getProperty);

// Admin routes
router.get('/admin', authenticateToken, requireAdmin, getAllProperties);
router.put('/:id', authenticateToken, requireAdmin, updateProperty);

export { router as propertyRoutes };
