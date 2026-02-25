import { Response } from 'express';
import { AuthRequest, ApiError } from '../middleware/errorHandler';
import { AIService } from '../services/AIService';
import { logger } from '../utils/logger-advanced';

const aiService = new AIService();

export class AIController {
  // Get service recommendations for a user
  async getServiceRecommendations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw ApiError('Authentication required', 401);
      }

      const limit = parseInt(req.query.limit as string) || 5;
      const recommendations = await aiService.recommendServices(userId, limit);

      res.json({
        message: 'Service recommendations retrieved successfully',
        data: { recommendations }
      });
    } catch (error) {
      logger.error('Error getting service recommendations:', error);
      throw ApiError('Failed to get recommendations', 500);
    }
  }

  // Get staff recommendations for a service
  async getStaffRecommendations(req: AuthRequest, res: Response) {
    try {
      const { serviceId } = req.params;
      const { latitude, longitude, limit } = req.query;

      const recommendations = await aiService.recommendStaff(
        parseInt(serviceId as string),
        latitude ? parseFloat(latitude as string) : undefined,
        longitude ? parseFloat(longitude as string) : undefined,
        parseInt(limit as string) || 3
      );

      res.json({
        message: 'Staff recommendations retrieved successfully',
        data: { recommendations }
      });
    } catch (error) {
      logger.error('Error getting staff recommendations:', error);
      throw ApiError('Failed to get staff recommendations', 500);
    }
  }

  // Chatbot query processing
  async processChatbotQuery(req: AuthRequest, res: Response) {
    try {
      const { query } = req.body;

      if (!query || typeof query !== 'string') {
        throw ApiError('Query is required', 400);
      }

      const response = await aiService.processChatbotQuery(query);

      res.json({
        message: 'Chatbot response generated',
        data: { response }
      });
    } catch (error) {
      logger.error('Error processing chatbot query:', error);
      throw ApiError('Failed to process query', 500);
    }
  }

  // Get booking analytics
  async getBookingAnalytics(req: AuthRequest, res: Response) {
    try {
      // Only allow admin access
      if (req.user?.role !== 'admin') {
        throw ApiError('Admin access required', 403);
      }

      const analytics = await aiService.analyzeBookingPatterns();

      if (!analytics) {
        throw ApiError('Failed to generate analytics', 500);
      }

      res.json({
        message: 'Booking analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      logger.error('Error getting booking analytics:', error);
      throw ApiError('Failed to get analytics', 500);
    }
  }
}