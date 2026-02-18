import { Router } from 'express';
import BookingController from '../controllers/BookingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Create booking (authenticated users)
router.post('/', authenticateToken, BookingController.create);

// List bookings for current user
router.get('/', authenticateToken, BookingController.listByUser);

// Get specific booking
router.get('/:id', authenticateToken, BookingController.getById);

// Admin updates booking status
router.put('/:id/status', authenticateToken, BookingController.updateStatus);

// Delete booking (owner or admin)
router.delete('/:id', authenticateToken, BookingController.remove);

export default router;
