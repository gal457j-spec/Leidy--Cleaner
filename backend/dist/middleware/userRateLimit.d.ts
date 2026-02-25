/**
 * Rate limiter por User ID
 * Protege contra bot abuse mesmo em rede compartilhada (NAT)
 *
 * Limits:
 * - Usuários autenticados: 100 req/15min
 * - IP anônimo: 50 req/15min
 */
export declare const userRateLimit: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiter específico para auth (mais restritivo)
 * 5 tentativas / 15 minutos por user/IP
 */
export declare const authRateLimit: import("express-rate-limit").RateLimitRequestHandler;
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
//# sourceMappingURL=userRateLimit.d.ts.map