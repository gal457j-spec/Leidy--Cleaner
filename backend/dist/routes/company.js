import { Router } from 'express';
import CompanyController from '../controllers/CompanyController';
const router = Router();
// Public endpoint for company info
router.get('/', CompanyController.getInfo);
export default router;
//# sourceMappingURL=company.js.map