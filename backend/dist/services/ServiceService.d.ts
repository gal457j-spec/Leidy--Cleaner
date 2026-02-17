import { Service } from '../types/models';
export declare class ServiceService {
    static getAll(filters?: {
        limit?: number;
        offset?: number;
        category?: string;
        search?: string;
    }): Promise<{
        services: Service[];
        total: number;
    }>;
    static getById(id: string): Promise<Service | null>;
    static create(serviceData: {
        name: string;
        description?: string;
        basePrice: number;
        durationMinutes: number;
        category: string;
    }): Promise<Service>;
    static update(id: string, serviceData: Partial<Service>): Promise<Service | null>;
    static delete(id: string): Promise<void>;
    static getCategories(): Promise<string[]>;
}
//# sourceMappingURL=ServiceService.d.ts.map