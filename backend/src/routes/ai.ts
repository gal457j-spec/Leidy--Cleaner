import { Router } from 'express';
import { AIController } from '../controllers/AIController';
import { authenticate } from '../middleware/auth';

const router = Router();
const aiController = new AIController();

// Get service recommendations for authenticated user
router.get('/recommendations/services', authenticate, aiController.getServiceRecommendations);

// Get staff recommendations for a service
router.get('/recommendations/staff/:serviceId', aiController.getStaffRecommendations);

// Chatbot query processing
router.post('/chatbot', aiController.processChatbotQuery);

// Get booking analytics (admin only)
router.get('/analytics/bookings', authenticate, aiController.getBookingAnalytics);

export default router;