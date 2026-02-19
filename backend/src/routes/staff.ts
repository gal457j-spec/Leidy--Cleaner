import { Router } from 'express';
import { StaffController } from '../controllers/StaffController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// public listing
router.get('/', StaffController.list);
router.get('/:id', StaffController.getById);

// protected profile updates and availability
router.put('/:id', authMiddleware, StaffController.updateProfile);
router.get('/:id/availability', authMiddleware, StaffController.getAvailability);
router.put('/:id/availability', authMiddleware, StaffController.setAvailability);

// reviews & rating (public)
router.get('/:id/reviews', StaffController.getReviews);
router.get('/:id/rating', StaffController.getRating);

export default router;
