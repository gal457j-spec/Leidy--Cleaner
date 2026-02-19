import { Router } from 'express';
import PaymentController from '../controllers/PaymentController';
import { authenticateToken } from '../middleware/auth';
import express from 'express';

const router = Router();

// regular authenticated endpoints
router.post('/', authenticateToken, PaymentController.payBooking);
router.post('/checkout', authenticateToken, PaymentController.checkoutSession);

// stripe webhook (raw body required)
router.post('/webhook', express.raw({ type: 'application/json' }), PaymentController.webhook);

export default router;
