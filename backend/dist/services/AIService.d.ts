interface ServiceRecommendation {
    serviceId: number;
    serviceName: string;
    category: string;
    score: number;
    reason: string;
}
interface StaffRecommendation {
    staffId: number;
    staffName: string;
    rating: number;
    distance?: number;
    score: number;
    reason: string;
}
export declare class AIService {
    recommendServices(userId: string, limit?: number): Promise<ServiceRecommendation[]>;
    recommendStaff(serviceId: number, userLat?: number, userLng?: number, limit?: number): Promise<StaffRecommendation[]>;
    processChatbotQuery(query: string): Promise<string>;
    analyzeBookingPatterns(): Promise<any>;
    private calculateDistance;
    private toRadians;
    private generateInsights;
}
export {};
//# sourceMappingURL=AIService.d.ts.map