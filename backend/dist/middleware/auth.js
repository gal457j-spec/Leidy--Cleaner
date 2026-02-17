import { verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { ApiError } from './errorHandler';
export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw ApiError('No token provided', 401);
        }
        const user = verifyToken(token);
        req.user = user;
        next();
    }
    catch (error) {
        logger.warn('Authentication failed:', error);
        const err = error;
        res.status(err.status || 401).json({
            error: {
                message: err.message || 'Authentication failed',
                status: err.status || 401,
            },
        });
    }
};
export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
            });
        }
        return next();
    };
};
//# sourceMappingURL=auth.js.map