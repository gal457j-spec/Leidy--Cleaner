import { Response } from 'express';
import { AuthRequest, asyncHandler, ApiError } from '../middleware/errorHandler';
import AdminService from '../services/AdminService';

export class AdminController {
  static getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'admin') {
      throw ApiError('Only admins can access stats', 403);
    }

    const stats = await AdminService.getStats();
    res.status(200).json({ message: 'Stats retrieved', data: { stats } });
  });
}

export default AdminController;
