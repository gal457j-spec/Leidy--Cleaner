"use strict";
/**
 * Application constants and enums
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_CONFIG = exports.DayOfWeek = exports.BookingUrgency = exports.BookingFrequency = exports.ServiceCategory = exports.PaymentStatus = exports.BookingStatus = exports.UserRole = void 0;
exports.getEnumLabel = getEnumLabel;
exports.isValidRole = isValidRole;
exports.isValidBookingStatus = isValidBookingStatus;
/**
 * User roles in the system
 */
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["CUSTOMER"] = "customer";
    UserRole["STAFF"] = "staff";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * Booking status values
 */
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["IN_PROGRESS"] = "in_progress";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["CANCELLED"] = "cancelled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
/**
 * Payment status values
 */
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
/**
 * Service categories
 */
var ServiceCategory;
(function (ServiceCategory) {
    ServiceCategory["RESIDENTIAL"] = "residential";
    ServiceCategory["COMMERCIAL"] = "commercial";
    ServiceCategory["SPECIALIZED"] = "specialized";
    ServiceCategory["MAINTENANCE"] = "maintenance";
})(ServiceCategory || (exports.ServiceCategory = ServiceCategory = {}));
/**
 * Booking frequency options
 */
var BookingFrequency;
(function (BookingFrequency) {
    BookingFrequency["ONCE"] = "once";
    BookingFrequency["WEEKLY"] = "weekly";
    BookingFrequency["BIWEEKLY"] = "biweekly";
    BookingFrequency["MONTHLY"] = "monthly";
})(BookingFrequency || (exports.BookingFrequency = BookingFrequency = {}));
/**
 * Booking urgency levels
 */
var BookingUrgency;
(function (BookingUrgency) {
    BookingUrgency["LOW"] = "low";
    BookingUrgency["NORMAL"] = "normal";
    BookingUrgency["HIGH"] = "high";
})(BookingUrgency || (exports.BookingUrgency = BookingUrgency = {}));
/**
 * Days of the week (for staff availability)
 */
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek["MONDAY"] = "Monday";
    DayOfWeek["TUESDAY"] = "Tuesday";
    DayOfWeek["WEDNESDAY"] = "Wednesday";
    DayOfWeek["THURSDAY"] = "Thursday";
    DayOfWeek["FRIDAY"] = "Friday";
    DayOfWeek["SATURDAY"] = "Saturday";
    DayOfWeek["SUNDAY"] = "Sunday";
})(DayOfWeek || (exports.DayOfWeek = DayOfWeek = {}));
/**
 * Application configuration constants
 */
exports.APP_CONFIG = {
    // JWT
    JWT_ACCESS_EXPIRES: '24h',
    JWT_REFRESH_EXPIRES: '7d',
    // Pricing
    BASE_PRICE_BRL: 40,
    HOURLY_RATE_BRL: 20,
    BOOKING_FEE_PERCENT: 40,
    // Rate limiting (in requests)
    AUTH_RATE_LIMIT_MAX: 5,
    AUTH_RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 min
    USER_RATE_LIMIT_MAX: 100,
    USER_RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 min
    API_RATE_LIMIT_MAX: 200,
    API_RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 min
    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    // File uploads
    MAX_FILE_SIZE_MB: 10,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_IMAGES_PER_REVIEW: 5,
    // Cache
    SERVICE_CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
};
/**
 * Get human-readable label for enum value
 */
function getEnumLabel(value, enumType) {
    const keys = Object.keys(enumType);
    const key = keys.find(k => enumType[k] === value);
    return key ? key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() : value;
}
/**
 * Validate if a value is a valid UserRole
 */
function isValidRole(role) {
    return Object.values(UserRole).includes(role);
}
/**
 * Validate if a value is a valid BookingStatus
 */
function isValidBookingStatus(status) {
    return Object.values(BookingStatus).includes(status);
}
//# sourceMappingURL=constants.js.map