"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AIController_1 = require("../controllers/AIController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const aiController = new AIController_1.AIController();
// Get service recommendations for authenticated user
router.get('/recommendations/services', auth_1.authenticate, aiController.getServiceRecommendations);
// Get staff recommendations for a service
router.get('/recommendations/staff/:serviceId', aiController.getStaffRecommendations);
// Chatbot query processing
router.post('/chatbot', aiController.processChatbotQuery);
// Get booking analytics (admin only)
router.get('/analytics/bookings', auth_1.authenticate, aiController.getBookingAnalytics);
exports.default = router;
//# sourceMappingURL=ai.js.map