export interface Booking {
    id: string;
    userId: string;
    staffId?: string;
    serviceId: string;
    bookingDate: Date;
    address: string;
    notes?: string;
    metragem?: number;
    frequency: 'once' | 'weekly' | 'biweekly' | 'monthly';
    urgency: 'low' | 'normal' | 'high';
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    paymentStatus: 'unpaid' | 'paid' | 'refunded';
    createdAt: Date;
    updatedAt: Date;
}
export interface Service {
    id: string;
    name: string;
    description?: string;
    basePrice: number;
    durationMinutes: number;
    category: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Review {
    id: string;
    bookingId: string;
    userId: string;
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string;
    images?: string[];
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=models.d.ts.map