/**
 * Application constants and enums
 */
/**
 * User roles in the system
 */
export declare enum UserRole {
    ADMIN = "admin",
    CUSTOMER = "customer",
    STAFF = "staff"
}
/**
 * Booking status values
 */
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Payment status values
 */
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded"
}
/**
 * Service categories
 */
export declare enum ServiceCategory {
    RESIDENTIAL = "residential",
    COMMERCIAL = "commercial",
    SPECIALIZED = "specialized",
    MAINTENANCE = "maintenance"
}
/**
 * Booking frequency options
 */
export declare enum BookingFrequency {
    ONCE = "once",
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    MONTHLY = "monthly"
}
/**
 * Booking urgency levels
 */
export declare enum BookingUrgency {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high"
}
/**
 * Days of the week (for staff availability)
 */
export declare enum DayOfWeek {
    MONDAY = "Monday",
    TUESDAY = "Tuesday",
    WEDNESDAY = "Wednesday",
    THURSDAY = "Thursday",
    FRIDAY = "Friday",
    SATURDAY = "Saturday",
    SUNDAY = "Sunday"
}
/**
 * Application configuration constants
 */
export declare const APP_CONFIG: {
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_EXPIRES: string;
    BASE_PRICE_BRL: number;
    HOURLY_RATE_BRL: number;
    BOOKING_FEE_PERCENT: number;
    AUTH_RATE_LIMIT_MAX: number;
    AUTH_RATE_LIMIT_WINDOW_MS: number;
    USER_RATE_LIMIT_MAX: number;
    USER_RATE_LIMIT_WINDOW_MS: number;
    API_RATE_LIMIT_MAX: number;
    API_RATE_LIMIT_WINDOW_MS: number;
    DEFAULT_PAGE_SIZE: number;
    MAX_PAGE_SIZE: number;
    MAX_FILE_SIZE_MB: number;
    ALLOWED_IMAGE_TYPES: string[];
    MAX_IMAGES_PER_REVIEW: number;
    SERVICE_CACHE_TTL_MS: number;
};
/**
 * Get human-readable label for enum value
 */
export declare function getEnumLabel(value: string, enumType: any): string;
/**
 * Validate if a value is a valid UserRole
 */
export declare function isValidRole(role: any): role is UserRole;
/**
 * Validate if a value is a valid BookingStatus
 */
export declare function isValidBookingStatus(status: any): status is BookingStatus;
//# sourceMappingURL=constants.d.ts.map