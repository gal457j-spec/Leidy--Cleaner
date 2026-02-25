"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const ServiceService_1 = require("../services/ServiceService");
const schemas_1 = require("../utils/schemas");
const CacheService_1 = require("../services/CacheService");
const transformers_1 = require("../utils/transformers");
const constants_1 = require("../utils/constants");
class ServiceController {
}
exports.ServiceController = ServiceController;
_a = ServiceController;
ServiceController.getAll = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { limit, offset, category, search } = req.query;
    // Tentar obter do cache Redis
    const cachedResult = await CacheService_1.cacheService.getServices();
    if (cachedResult) {
        return res.status(200).json({
            message: 'Services retrieved (cached)',
            data: { services: cachedResult, cached: true },
        });
    }
    const result = await ServiceService_1.ServiceService.getAll({
        limit: limit ? parseInt(limit) : 10,
        offset: offset ? parseInt(offset) : 0,
        category: category,
        search: search,
    });
    const responseData = {
        services: (0, transformers_1.camelize)(result.services),
        pagination: {
            total: result.total,
            limit: limit ? parseInt(limit) : 10,
            offset: offset ? parseInt(offset) : 0,
        },
    };
    // Cache no Redis por 1 hora
    await CacheService_1.cacheService.setServices(result.services);
    return res.status(200).json({
        message: 'Services retrieved',
        data: responseData,
    });
});
ServiceController.getById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const service = await ServiceService_1.ServiceService.getById(id);
    if (!service) {
        throw (0, errorHandler_1.ApiError)('Service not found', 404);
    }
    res.status(200).json({
        message: 'Service retrieved',
        data: { service: (0, transformers_1.camelize)(service) },
    });
});
ServiceController.create = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    // Validate payload first
    const { error, value } = schemas_1.serviceSchema.validate(req.body);
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    // Then check admin role
    if (req.user?.role !== constants_1.UserRole.ADMIN) {
        throw (0, errorHandler_1.ApiError)('Only admins can create services', 403);
    }
    const service = await ServiceService_1.ServiceService.create({
        name: value.name,
        description: value.description,
        basePrice: value.basePrice,
        durationMinutes: value.durationMinutes,
        category: value.category,
    });
    // Invalidar cache de serviços
    CacheService_1.cacheService.clearAll();
    res.status(201).json({
        message: 'Service created successfully',
        data: { service: (0, transformers_1.camelize)(service) },
    });
});
ServiceController.update = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    // Validate payload first (partial updates allowed)
    const { error, value } = schemas_1.serviceUpdateSchema.validate(req.body, {
        allowUnknown: true,
    });
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    // Then check admin role
    if (req.user?.role !== constants_1.UserRole.ADMIN) {
        throw (0, errorHandler_1.ApiError)('Only admins can update services', 403);
    }
    const service = await ServiceService_1.ServiceService.update(id, value);
    if (!service) {
        throw (0, errorHandler_1.ApiError)('Service not found', 404);
    }
    res.status(200).json({
        message: 'Service updated successfully',
        data: { service: (0, transformers_1.camelize)(service) },
    });
});
ServiceController.delete = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    // Check admin role
    if (req.user?.role !== constants_1.UserRole.ADMIN) {
        throw (0, errorHandler_1.ApiError)('Only admins can delete services', 403);
    }
    const { id } = req.params;
    const service = await ServiceService_1.ServiceService.getById(id);
    if (!service) {
        throw (0, errorHandler_1.ApiError)('Service not found', 404);
    }
    await ServiceService_1.ServiceService.delete(id);
    res.status(200).json({
        message: 'Service deleted successfully',
    });
});
ServiceController.getCategories = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const categories = await ServiceService_1.ServiceService.getCategories();
    res.status(200).json({
        message: 'Categories retrieved',
        data: { categories },
    });
});
//# sourceMappingURL=ServiceController.js.map