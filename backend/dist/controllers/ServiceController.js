var _a;
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import { ServiceService } from '../services/ServiceService';
import { serviceSchema } from '../utils/schemas';
export class ServiceController {
}
_a = ServiceController;
ServiceController.getAll = asyncHandler(async (req, res) => {
    const { limit, offset, category, search } = req.query;
    const result = await ServiceService.getAll({
        limit: limit ? parseInt(limit) : 10,
        offset: offset ? parseInt(offset) : 0,
        category: category,
        search: search,
    });
    res.status(200).json({
        message: 'Services retrieved',
        data: {
            services: result.services,
            pagination: {
                total: result.total,
                limit: limit ? parseInt(limit) : 10,
                offset: offset ? parseInt(offset) : 0,
            },
        },
    });
});
ServiceController.getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = await ServiceService.getById(id);
    if (!service) {
        throw ApiError('Service not found', 404);
    }
    res.status(200).json({
        message: 'Service retrieved',
        data: { service },
    });
});
ServiceController.create = asyncHandler(async (req, res) => {
    // Check admin role
    if (req.user?.role !== 'admin') {
        throw ApiError('Only admins can create services', 403);
    }
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
        throw ApiError(error.details[0].message, 400);
    }
    const service = await ServiceService.create({
        name: value.name,
        description: value.description,
        basePrice: value.basePrice,
        durationMinutes: value.durationMinutes,
        category: value.category,
    });
    res.status(201).json({
        message: 'Service created successfully',
        data: { service },
    });
});
ServiceController.update = asyncHandler(async (req, res) => {
    // Check admin role
    if (req.user?.role !== 'admin') {
        throw ApiError('Only admins can update services', 403);
    }
    const { id } = req.params;
    const { error, value } = serviceSchema.validate(req.body, {
        allowUnknown: true,
    });
    if (error) {
        throw ApiError(error.details[0].message, 400);
    }
    const service = await ServiceService.update(id, value);
    if (!service) {
        throw ApiError('Service not found', 404);
    }
    res.status(200).json({
        message: 'Service updated successfully',
        data: { service },
    });
});
ServiceController.delete = asyncHandler(async (req, res) => {
    // Check admin role
    if (req.user?.role !== 'admin') {
        throw ApiError('Only admins can delete services', 403);
    }
    const { id } = req.params;
    const service = await ServiceService.getById(id);
    if (!service) {
        throw ApiError('Service not found', 404);
    }
    await ServiceService.delete(id);
    res.status(200).json({
        message: 'Service deleted successfully',
    });
});
ServiceController.getCategories = asyncHandler(async (_req, res) => {
    const categories = await ServiceService.getCategories();
    res.status(200).json({
        message: 'Categories retrieved',
        data: { categories },
    });
});
//# sourceMappingURL=ServiceController.js.map