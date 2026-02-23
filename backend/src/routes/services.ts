import { Router, Request, Response } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { authenticateToken } from '../middleware/auth';
import { calculatePriceBreakdown } from '../utils/priceCalculator';

const router = Router();

// Public routes
router.get('/', ServiceController.getAll);
router.get('/categories', ServiceController.getCategories);
router.get('/pricing/calculate', (req: Request, res: Response) => {
  // GET /api/v1/services/pricing/calculate?minutes=120
  const minutes = parseInt(req.query.minutes as string) || 60;
  const breakdown = calculatePriceBreakdown(minutes, false);
  res.json({
    message: 'Price calculated',
    data: {
      durationMinutes: minutes,
      durationHours: minutes / 60,
      ...breakdown,
    }
  });
});
router.get('/:id', ServiceController.getById);

// Protected routes (admin only)
router.post('/', authenticateToken, ServiceController.create);
router.put('/:id', authenticateToken, ServiceController.update);
router.delete('/:id', authenticateToken, ServiceController.delete);

export default router;
