"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const chat_1 = __importDefault(require("../chat"));
const auth_1 = __importDefault(require("../auth"));
const bookings_1 = __importDefault(require("../bookings"));
const services_1 = __importDefault(require("../services"));
const errorHandler_1 = require("../../middleware/errorHandler");
const database_1 = require("../../utils/database");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/chat', chat_1.default);
app.use('/api/v1/bookings', bookings_1.default);
app.use('/api/v1/services', services_1.default);
app.use(errorHandler_1.errorHandler);
describe('Chat API', () => {
    let authToken;
    let customerId;
    let bookingId;
    let staffToken;
    let staffId;
    beforeAll(async () => {
        // Criar usuário de teste
        const customerResponse = await (0, supertest_1.default)(app)
            .post('/api/v1/auth/register')
            .send({
            email: 'chat-customer@test.com',
            password: 'password123',
            name: 'Chat Customer'
        });
        authToken = customerResponse.body.data.token;
        customerId = customerResponse.body.data.user.id;
        // Criar staff de teste
        const staffResponse = await (0, supertest_1.default)(app)
            .post('/api/v1/auth/register')
            .send({
            email: 'chat-staff@test.com',
            password: 'password123',
            name: 'Chat Staff'
        });
        staffToken = staffResponse.body.data.token;
        staffId = staffResponse.body.data.user.id;
        // Atualizar role do staff
        await (0, database_1.query)('UPDATE users SET role = $1 WHERE id = $2', ['staff', staffId]);
        // Criar um serviço de teste
        const serviceResult = await (0, database_1.query)('INSERT INTO services (name, description, base_price, duration_minutes, category) VALUES ($1, $2, $3, $4, $5) RETURNING id', ['Chat Test Service', 'Service for chat testing', 100, 60, 'residential']);
        // Criar um booking de teste
        const bookingResult = await (0, database_1.query)('INSERT INTO bookings (user_id, service_id, scheduled_date, status, total_price, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [customerId, serviceResult[0].id, '2026-03-01 10:00:00', 'confirmed', 100, 'Test Address']);
        bookingId = bookingResult[0].id;
    });
    describe('POST /api/v1/chat/room/:bookingId', () => {
        it('should create or get chat room for booking', async () => {
            const response = await (0, supertest_1.default)(app)
                .get(`/api/v1/chat/room/${bookingId}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Chat room retrieved');
            expect(response.body.data.room).toHaveProperty('bookingId', bookingId);
            expect(response.body.data.room).toHaveProperty('customerId', customerId);
        });
        it('should not allow access to other user booking', async () => {
            // Criar outro usuário
            const otherUserResponse = await (0, supertest_1.default)(app)
                .post('/api/v1/auth/register')
                .send({
                email: 'other-user@test.com',
                password: 'password123',
                name: 'Other User'
            });
            const otherToken = otherUserResponse.body.data.token;
            const response = await (0, supertest_1.default)(app)
                .get(`/api/v1/chat/room/${bookingId}`)
                .set('Authorization', `Bearer ${otherToken}`);
            expect(response.status).toBe(403);
            expect(response.body.message).toContain('Not authorized');
        });
    });
    describe('POST /api/v1/chat/room/:bookingId/messages', () => {
        it('should send a message', async () => {
            const response = await (0, supertest_1.default)(app)
                .post(`/api/v1/chat/room/${bookingId}/messages`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                message: 'Hello, this is a test message',
                messageType: 'text'
            });
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Message sent');
            expect(response.body.data.message).toHaveProperty('message', 'Hello, this is a test message');
            expect(response.body.data.message).toHaveProperty('senderRole', 'customer');
        });
        it('should allow staff to send messages', async () => {
            // Atribuir staff ao booking
            await (0, database_1.query)('UPDATE bookings SET team_member_id = $1 WHERE id = $2', [staffId, bookingId]);
            const response = await (0, supertest_1.default)(app)
                .post(`/api/v1/chat/room/${bookingId}/messages`)
                .set('Authorization', `Bearer ${staffToken}`)
                .send({
                message: 'Hello from staff!',
                messageType: 'text'
            });
            expect(response.status).toBe(201);
            expect(response.body.data.message).toHaveProperty('senderRole', 'staff');
        });
    });
    describe('GET /api/v1/chat/room/:bookingId/messages', () => {
        it('should get messages from chat', async () => {
            const response = await (0, supertest_1.default)(app)
                .get(`/api/v1/chat/room/${bookingId}/messages`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Messages retrieved');
            expect(Array.isArray(response.body.data.messages)).toBe(true);
            expect(response.body.data.messages.length).toBeGreaterThan(0);
        });
    });
    describe('PUT /api/v1/chat/room/:bookingId/read', () => {
        it('should mark messages as read', async () => {
            const response = await (0, supertest_1.default)(app)
                .put(`/api/v1/chat/room/${bookingId}/read`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Messages marked as read');
        });
    });
    describe('GET /api/v1/chat/rooms', () => {
        it('should get user chat rooms', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/v1/chat/rooms')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Chat rooms retrieved');
            expect(Array.isArray(response.body.data.rooms)).toBe(true);
        });
    });
    afterAll(async () => {
        // Limpar dados de teste
        await (0, database_1.query)('DELETE FROM chat_messages WHERE booking_id = $1', [bookingId]);
        await (0, database_1.query)('DELETE FROM chat_rooms WHERE booking_id = $1', [bookingId]);
        await (0, database_1.query)('DELETE FROM bookings WHERE id = $1', [bookingId]);
        await (0, database_1.query)('DELETE FROM users WHERE email LIKE $1', ['chat-%@test.com']);
        await (0, database_1.query)('DELETE FROM users WHERE email = $1', ['other-user@test.com']);
    });
});
//# sourceMappingURL=chat.test.js.map