"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRoutes = exports.analyticsRoutes = exports.twoFactorRoutes = exports.chatRoutes = exports.aiRoutes = exports.staffRoutes = exports.reviewsRoutes = exports.adminRoutes = exports.companyRoutes = exports.paymentsRoutes = exports.bookingsRoutes = exports.serviceRoutes = exports.authRoutes = void 0;
const auth_1 = __importDefault(require("./auth"));
exports.authRoutes = auth_1.default;
const services_1 = __importDefault(require("./services"));
exports.serviceRoutes = services_1.default;
const bookings_1 = __importDefault(require("./bookings"));
exports.bookingsRoutes = bookings_1.default;
const payments_1 = __importDefault(require("./payments"));
exports.paymentsRoutes = payments_1.default;
const company_1 = __importDefault(require("./company"));
exports.companyRoutes = company_1.default;
const admin_1 = __importDefault(require("./admin"));
exports.adminRoutes = admin_1.default;
const reviews_1 = __importDefault(require("./reviews"));
exports.reviewsRoutes = reviews_1.default;
const staff_1 = __importDefault(require("./staff"));
exports.staffRoutes = staff_1.default;
const ai_1 = __importDefault(require("./ai"));
exports.aiRoutes = ai_1.default;
const chat_1 = __importDefault(require("./chat"));
exports.chatRoutes = chat_1.default;
const twofactor_1 = __importDefault(require("./twofactor"));
exports.twoFactorRoutes = twofactor_1.default;
const analytics_1 = __importDefault(require("./analytics"));
exports.analyticsRoutes = analytics_1.default;
// testing only...
const test_1 = __importDefault(require("./test"));
exports.testRoutes = test_1.default;
//# sourceMappingURL=index.js.map