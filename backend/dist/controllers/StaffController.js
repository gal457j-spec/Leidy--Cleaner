"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const StaffService_1 = require("../services/StaffService");
const schemas_1 = require("../utils/schemas");
const transformers_1 = require("../utils/transformers");
class StaffController {
}
exports.StaffController = StaffController;
_a = StaffController;
StaffController.list = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const staff = await StaffService_1.StaffService.listStaff();
    res.status(200).json({ message: 'Staff retrieved', data: { staff: (0, transformers_1.camelize)(staff) } });
});
StaffController.getById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const staff = await StaffService_1.StaffService.getById(id);
    if (!staff) {
        throw (0, errorHandler_1.ApiError)('Staff not found', 404);
    }
    res.status(200).json({ message: 'Staff retrieved', data: { staff: (0, transformers_1.camelize)(staff) } });
});
StaffController.updateProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    // only the staff themselves or admin may update
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
        throw (0, errorHandler_1.ApiError)('Not authorized to update this profile', 403);
    }
    const { error, value } = schemas_1.profileUpdateSchema.validate(req.body, { allowUnknown: true });
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    const updated = await StaffService_1.StaffService.updateProfile(id, value);
    if (!updated) {
        throw (0, errorHandler_1.ApiError)('Staff not found', 404);
    }
    res.status(200).json({ message: 'Profile updated', data: { staff: (0, transformers_1.camelize)(updated) } });
});
StaffController.getAvailability = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const slots = await StaffService_1.StaffService.getAvailability(id);
    res.status(200).json({ message: 'Availability fetched', data: { availability: (0, transformers_1.camelize)(slots) } });
});
StaffController.setAvailability = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
        throw (0, errorHandler_1.ApiError)('Not authorized', 403);
    }
    const { error, value } = schemas_1.availabilityArraySchema.validate(req.body);
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    const slots = await StaffService_1.StaffService.setAvailability(id, value);
    res.status(200).json({ message: 'Availability updated', data: { availability: (0, transformers_1.camelize)(slots) } });
});
StaffController.getReviews = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const reviews = await StaffService_1.StaffService.getReviewsForStaff(id);
    res.status(200).json({ message: 'Reviews retrieved', data: { reviews: (0, transformers_1.camelize)(reviews) } });
});
StaffController.getRating = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const avg = await StaffService_1.StaffService.getAverageRating(id);
    res.status(200).json({ message: 'Rating retrieved', data: { rating: avg } });
});
//# sourceMappingURL=StaffController.js.map