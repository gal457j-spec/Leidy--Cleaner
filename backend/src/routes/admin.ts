import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// protected admin stats endpoint
router.get('/stats', authenticateToken, AdminController.getStats);

export default router;
