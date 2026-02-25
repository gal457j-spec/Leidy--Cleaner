export interface CacheConfig {
    host: string;
    port: number;
    password?: string;
    db?: number;
    ttl: {
        services: number;
        userProfile: number;
        bookings: number;
        reviews: number;
        staff: number;
    };
}
export declare class CacheService {
    private client;
    private isConnected;
    private config;
    constructor(config?: Partial<CacheConfig>);
    /**
     * Conecta ao Redis
     */
    connect(): Promise<void>;
    /**
     * Desconecta do Redis
     */
    disconnect(): Promise<void>;
    /**
     * Verifica se o cache está disponível
     */
    isAvailable(): boolean;
    /**
     * Define um valor no cache
     */
    set(key: string, value: any, ttl?: number): Promise<void>;
    /**
     * Obtém um valor do cache
     */
    get<T = any>(key: string): Promise<T | null>;
    /**
     * Remove um valor do cache
     */
    del(key: string): Promise<void>;
    /**
     * Remove múltiplas chaves do cache
     */
    delPattern(pattern: string): Promise<void>;
    /**
     * Cache de serviços
     */
    getServices(): Promise<any[] | null>;
    setServices(services: any[]): Promise<void>;
    invalidateServices(): Promise<void>;
    /**
     * Cache de perfil do usuário
     */
    getUserProfile(userId: string): Promise<any | null>;
    setUserProfile(userId: string, profile: any): Promise<void>;
    invalidateUserProfile(userId: string): Promise<void>;
    /**
     * Cache de agendamentos
     */
    getUserBookings(userId: string): Promise<any[] | null>;
    setUserBookings(userId: string, bookings: any[]): Promise<void>;
    invalidateUserBookings(userId: string): Promise<void>;
    /**
     * Cache de avaliações
     */
    getPublicReviews(): Promise<any[] | null>;
    setPublicReviews(reviews: any[]): Promise<void>;
    invalidatePublicReviews(): Promise<void>;
    /**
     * Cache de funcionários
     */
    getStaffList(): Promise<any[] | null>;
    setStaffList(staff: any[]): Promise<void>;
    invalidateStaffList(): Promise<void>;
    /**
     * Invalidação em cascata
     */
    invalidateUserData(userId: string): Promise<void>;
    invalidateAllBookings(): Promise<void>;
    /**
     * Estatísticas do cache
     */
    getStats(): Promise<{
        connected: boolean;
        keys: number;
        memory: string;
    }>;
    /**
     * Limpa todo o cache
     */
    clearAll(): Promise<void>;
}
export declare const cacheService: CacheService;
//# sourceMappingURL=CacheService.d.ts.map