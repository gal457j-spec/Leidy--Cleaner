import { Router } from 'express';
import BookingController from '../controllers/BookingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Create booking (authenticated users)
router.post('/', authenticateToken, BookingController.create);

// List bookings for current user (or all if admin query later)
router.get('/', authenticateToken, BookingController.listByUser);

// Admin: list all bookings
router.get('/all', authenticateToken, BookingController.listAll);

// Admin assign staff
router.post('/assign', authenticateToken, BookingController.assignStaff);

// Staff: list own bookings
router.get('/staff', authenticateToken, BookingController.listByStaff);

// Get specific booking
router.get('/:id', authenticateToken, BookingController.getById);

// Admin updates booking status
router.put('/:id/status', authenticateToken, BookingController.updateStatus);

// Delete booking (owner or admin)
router.delete('/:id', authenticateToken, BookingController.remove);

export default router;
