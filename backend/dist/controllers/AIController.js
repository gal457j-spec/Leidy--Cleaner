"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const AIService_1 = require("../services/AIService");
const logger_advanced_1 = require("../utils/logger-advanced");
const aiService = new AIService_1.AIService();
class AIController {
    // Get service recommendations for a user
    async getServiceRecommendations(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw (0, errorHandler_1.ApiError)('Authentication required', 401);
            }
            const limit = parseInt(req.query.limit) || 5;
            const recommendations = await aiService.recommendServices(userId, limit);
            res.json({
                message: 'Service recommendations retrieved successfully',
                data: { recommendations }
            });
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting service recommendations:', error);
            throw (0, errorHandler_1.ApiError)('Failed to get recommendations', 500);
        }
    }
    // Get staff recommendations for a service
    async getStaffRecommendations(req, res) {
        try {
            const { serviceId } = req.params;
            const { latitude, longitude, limit } = req.query;
            const recommendations = await aiService.recommendStaff(parseInt(serviceId), latitude ? parseFloat(latitude) : undefined, longitude ? parseFloat(longitude) : undefined, parseInt(limit) || 3);
            res.json({
                message: 'Staff recommendations retrieved successfully',
                data: { recommendations }
            });
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting staff recommendations:', error);
            throw (0, errorHandler_1.ApiError)('Failed to get staff recommendations', 500);
        }
    }
    // Chatbot query processing
    async processChatbotQuery(req, res) {
        try {
            const { query } = req.body;
            if (!query || typeof query !== 'string') {
                throw (0, errorHandler_1.ApiError)('Query is required', 400);
            }
            const response = await aiService.processChatbotQuery(query);
            res.json({
                message: 'Chatbot response generated',
                data: { response }
            });
        }
        catch (error) {
            logger_advanced_1.logger.error('Error processing chatbot query:', error);
            throw (0, errorHandler_1.ApiError)('Failed to process query', 500);
        }
    }
    // Get booking analytics
    async getBookingAnalytics(req, res) {
        try {
            // Only allow admin access
            if (req.user?.role !== 'admin') {
                throw (0, errorHandler_1.ApiError)('Admin access required', 403);
            }
            const analytics = await aiService.analyzeBookingPatterns();
            if (!analytics) {
                throw (0, errorHandler_1.ApiError)('Failed to generate analytics', 500);
            }
            res.json({
                message: 'Booking analytics retrieved successfully',
                data: analytics
            });
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting booking analytics:', error);
            throw (0, errorHandler_1.ApiError)('Failed to get analytics', 500);
        }
    }
}
exports.AIController = AIController;
//# sourceMappingURL=AIController.js.map