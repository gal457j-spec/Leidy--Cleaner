"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimit = exports.userRateLimit = void 0;
const express_rate_limit_1 = __importStar(require("express-rate-limit"));
/**
 * Rate limiter por User ID
 * Protege contra bot abuse mesmo em rede compartilhada (NAT)
 *
 * Limits:
 * - Usuários autenticados: 100 req/15min
 * - IP anônimo: 50 req/15min
 */
exports.userRateLimit = (0, express_rate_limit_1.default)({
    keyGenerator: (req, _res) => {
        // Prioriza user_id se autenticado
        if (req.user?.id) {
            return `user:${req.user.id}`;
        }
        // Fallback para IP usando helper oficial que trata IPv6 corretamente
        return (0, express_rate_limit_1.ipKeyGenerator)(req.ip);
    },
    max: (req) => {
        // Usuários autenticados: mais tolerantes
        if (req.user?.id) {
            return 100;
        }
        // Anônimos: mais restritivo
        return 50;
    },
    windowMs: 15 * 60 * 1000, // 15 minutos
    message: 'Too many requests from this user, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    // Skip health checks
    // disable rate limiting entirely in test environment so E2E and unit
    // tests can flood endpoints without being throttled.  this mirrors other
    // middleware which often no-op during tests.
    skip: () => {
        // completely disable in test env
        if (require('../config').NODE_ENV === 'test')
            return true;
        return false; // health checks handled by other logic
    },
    // Custom handler para error
    handler: (req, res) => {
        const rateLimit = req.rateLimit;
        const retryAfter = rateLimit?.resetTime
            ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
            : 900; // 15 min default
        res.status(429).json({
            error: {
                message: 'Too many requests',
                status: 429,
                retryAfter,
            }
        });
    },
    // Store opciona: usar Redis em produção
    store: undefined, // MemoryStore padrão (trocar por Redis em prod)
});
/**
 * Rate limiter específico para auth (mais restritivo)
 * 5 tentativas / 15 minutos por user/IP
 */
exports.authRateLimit = (0, express_rate_limit_1.default)({
    keyGenerator: (req, _res) => {
        // Se enviar email, usar como key
        const email = req.body?.email || '';
        if (email) {
            return `auth:email:${email}`;
        }
        // Fallback para IP usando helper IPv6-safe
        return `auth:${(0, express_rate_limit_1.ipKeyGenerator)(req.ip)}`;
    },
    max: 5, // Muito restritivo para auth
    windowMs: 15 * 60 * 1000, // 15 minutos
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    // bypass auth throttling during end-to-end tests
    skip: () => require('../config').NODE_ENV === 'test',
    handler: (req, res) => {
        const rateLimit = req.rateLimit;
        const retryAfter = rateLimit?.resetTime
            ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
            : 900;
        res.status(429).json({
            error: {
                message: 'Too many authentication attempts',
                status: 429,
                retryAfter,
            }
        });
    },
});
/**
 * Para usar em produção com Redis (muito melhor para distribuído):
 *
 * import RedisStore from 'rate-limit-redis';
 * import redis from 'redis';
 *
 * const redisClient = redis.createClient();
 *
 * export const userRateLimit = rateLimit({
 *   store: new RedisStore({
 *     client: redisClient,
 *     prefix: 'rl:user:',
 *   }),
 *   keyGenerator: (req: any) => req.user?.id || req.ip,
 *   max: 100,
 *   windowMs: 15 * 60 * 1000,
 * });
 */
//# sourceMappingURL=userRateLimit.js.map