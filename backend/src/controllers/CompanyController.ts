import { Response } from 'express';
import { asyncHandler, ApiError, AuthRequest } from '../middleware/errorHandler';
import { query } from '../utils/database';

export class CompanyController {
  static getInfo = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const result = await query('SELECT * FROM company_info ORDER BY id DESC LIMIT 1');
    if (!result || result.length === 0) throw ApiError('Company info not found', 404);
    res.status(200).json({ message: 'Company info retrieved', data: { company: result[0] } });
  });
}

export default CompanyController;
