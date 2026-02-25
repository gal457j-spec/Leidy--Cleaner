"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ServiceController_1 = require("../controllers/ServiceController");
const auth_1 = require("../middleware/auth");
const priceCalculator_1 = require("../utils/priceCalculator");
const router = (0, express_1.Router)();
// Public routes
router.get('/', ServiceController_1.ServiceController.getAll);
router.get('/categories', ServiceController_1.ServiceController.getCategories);
router.get('/pricing/calculate', (req, res) => {
    // GET /api/v1/services/pricing/calculate?minutes=120
    const minutes = parseInt(req.query.minutes) || 60;
    const breakdown = (0, priceCalculator_1.calculatePriceBreakdown)(minutes, false);
    res.json({
        message: 'Price calculated',
        data: {
            durationMinutes: minutes,
            durationHours: minutes / 60,
            ...breakdown,
        }
    });
});
router.get('/:id', ServiceController_1.ServiceController.getById);
// Protected routes (admin only)
router.post('/', auth_1.authenticateToken, ServiceController_1.ServiceController.create);
router.put('/:id', auth_1.authenticateToken, ServiceController_1.ServiceController.update);
router.delete('/:id', auth_1.authenticateToken, ServiceController_1.ServiceController.delete);
exports.default = router;
//# sourceMappingURL=services.js.map