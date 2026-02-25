"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const database_1 = require("../utils/database");
const logger_advanced_1 = require("../utils/logger-advanced");
class AIService {
    // Simple recommendation engine based on user history and preferences
    async recommendServices(userId, limit = 5) {
        try {
            // Get user's booking history
            const userBookings = await (0, database_1.query)(`
        SELECT
          s.id, s.name, s.category, COUNT(*) as booking_count
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        WHERE b.user_id = $1
        GROUP BY s.id, s.name, s.category
        ORDER BY booking_count DESC
      `, [userId]);
            // Get popular services in user's preferred categories
            const preferredCategories = userBookings.map((b) => b.category);
            const categoryServices = await (0, database_1.query)(`
        SELECT
          s.id, s.name, s.category,
          COUNT(b.id) as total_bookings,
          AVG(COALESCE(r.rating, 0)) as avg_rating
        FROM services s
        LEFT JOIN bookings b ON s.id = b.service_id
        LEFT JOIN reviews r ON b.id = r.booking_id
        WHERE s.category = ANY($1) AND s.id NOT IN (
          SELECT service_id FROM bookings WHERE user_id = $2
        )
        GROUP BY s.id, s.name, s.category
        ORDER BY total_bookings DESC, avg_rating DESC
        LIMIT $3
      `, [preferredCategories, userId, limit]);
            // Calculate recommendation scores
            const recommendations = categoryServices.map((service) => {
                let score = 0;
                let reason = '';
                // Score based on popularity
                score += service.total_bookings * 0.3;
                // Score based on rating
                score += (service.avg_rating || 0) * 0.4;
                // Score based on category preference
                const categoryMatches = userBookings.filter((b) => b.category === service.category).length;
                score += categoryMatches * 0.3;
                if (categoryMatches > 0) {
                    reason = `Baseado em seus ${categoryMatches} agendamento(s) na categoria ${service.category}`;
                }
                else {
                    reason = `Serviço popular na categoria ${service.category}`;
                }
                return {
                    serviceId: service.id,
                    serviceName: service.name,
                    category: service.category,
                    score: Math.round(score * 100) / 100,
                    reason
                };
            });
            return recommendations.sort((a, b) => b.score - a.score);
        }
        catch (error) {
            logger_advanced_1.logger.error('Error generating service recommendations:', error);
            return [];
        }
    }
    // Recommend staff based on service, location, and ratings
    async recommendStaff(serviceId, userLat, userLng, limit = 3) {
        try {
            // Get staff that offer this service
            const availableStaff = await (0, database_1.query)(`
        SELECT
          s.id, s.full_name, s.rating, s.total_reviews,
          s.latitude, s.longitude, s.service_radius_km,
          ss.custom_price
        FROM staff s
        JOIN staff_services ss ON s.id = ss.staff_id
        WHERE ss.service_id = $1 AND s.is_available = true AND s.is_verified = true
        ORDER BY s.rating DESC, s.total_reviews DESC
      `, [serviceId]);
            const recommendations = availableStaff.map((staff) => {
                let score = 0;
                let reason = '';
                let distance;
                // Score based on rating
                score += staff.rating * 0.5;
                // Score based on total reviews (experience)
                score += Math.min(staff.total_reviews / 10, 1) * 0.3;
                // Distance calculation if user location provided
                if (userLat && userLng && staff.latitude && staff.longitude) {
                    distance = this.calculateDistance(userLat, userLng, staff.latitude, staff.longitude);
                    // Score based on distance (closer is better)
                    const distanceScore = Math.max(0, 1 - (distance / staff.service_radius_km));
                    score += distanceScore * 0.2;
                    if (distance <= staff.service_radius_km) {
                        reason = `Disponível na sua região (${distance.toFixed(1)}km)`;
                    }
                    else {
                        reason = `Fora da área de atuação (${distance.toFixed(1)}km)`;
                        score *= 0.5; // Penalty for being out of range
                    }
                }
                else {
                    reason = `Profissional experiente com ${staff.total_reviews} avaliações`;
                }
                return {
                    staffId: staff.id,
                    staffName: staff.full_name,
                    rating: staff.rating,
                    distance,
                    score: Math.round(score * 100) / 100,
                    reason
                };
            });
            return recommendations
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
        }
        catch (error) {
            logger_advanced_1.logger.error('Error generating staff recommendations:', error);
            return [];
        }
    }
    // Simple chatbot for common questions
    async processChatbotQuery(query) {
        const lowerQuery = query.toLowerCase();
        // Simple keyword matching (could be enhanced with NLP)
        if (lowerQuery.includes('preço') || lowerQuery.includes('valor') || lowerQuery.includes('custo')) {
            return 'Nossos preços variam por serviço. Você pode ver os valores detalhados na página de serviços. Todos os preços incluem materiais e deslocamento dentro da área de cobertura.';
        }
        if (lowerQuery.includes('horário') || lowerQuery.includes('hora') || lowerQuery.includes('funcionamento')) {
            return 'Atendemos de segunda a sábado, das 8h às 18h. Você pode agendar serviços fora desse horário mediante disponibilidade do profissional.';
        }
        if (lowerQuery.includes('pagamento') || lowerQuery.includes('pagar')) {
            return 'Aceitamos cartão de crédito, débito, PIX e dinheiro. O pagamento é realizado após a conclusão do serviço.';
        }
        if (lowerQuery.includes('cancelar') || lowerQuery.includes('cancelamento')) {
            return 'Você pode cancelar seu agendamento até 2 horas antes do horário marcado através do app ou site. Reembolsamos 100% do valor.';
        }
        if (lowerQuery.includes('avaliação') || lowerQuery.includes('nota') || lowerQuery.includes('review')) {
            return 'Após cada serviço, você pode avaliar o profissional. Sua avaliação nos ajuda a manter a qualidade dos nossos serviços.';
        }
        // Default response
        return 'Olá! Sou o assistente virtual da Leidy Cleaner. Posso ajudar com informações sobre serviços, preços, agendamentos e dúvidas gerais. O que você gostaria de saber?';
    }
    // Analyze booking patterns for insights
    async analyzeBookingPatterns() {
        try {
            // Get booking statistics
            const stats = await (0, database_1.query)(`
        SELECT
          COUNT(*) as total_bookings,
          COUNT(DISTINCT user_id) as unique_customers,
          AVG(total_price) as avg_booking_value,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings
        FROM bookings
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      `);
            // Get popular services
            const popularServices = await (0, database_1.query)(`
        SELECT
          s.name,
          COUNT(b.id) as booking_count,
          AVG(b.total_price) as avg_price
        FROM services s
        JOIN bookings b ON s.id = b.service_id
        WHERE b.created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY s.id, s.name
        ORDER BY booking_count DESC
        LIMIT 5
      `);
            // Get peak hours
            const peakHours = await (0, database_1.query)(`
        SELECT
          EXTRACT(HOUR FROM scheduled_date) as hour,
          COUNT(*) as booking_count
        FROM bookings
        WHERE scheduled_date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY EXTRACT(HOUR FROM scheduled_date)
        ORDER BY booking_count DESC
        LIMIT 3
      `);
            return {
                period: 'last_30_days',
                summary: stats[0],
                popularServices,
                peakHours,
                insights: this.generateInsights(stats[0], popularServices, peakHours)
            };
        }
        catch (error) {
            logger_advanced_1.logger.error('Error analyzing booking patterns:', error);
            return null;
        }
    }
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    generateInsights(stats, services, hours) {
        const insights = [];
        if (stats.completed_bookings / stats.total_bookings > 0.9) {
            insights.push('Excelente taxa de conclusão de serviços (>90%)');
        }
        if (services.length > 0) {
            insights.push(`Serviço mais popular: ${services[0].name} com ${services[0].booking_count} agendamentos`);
        }
        if (hours.length > 0) {
            insights.push(`Horário de pico: ${hours[0].hour}h com ${hours[0].booking_count} agendamentos`);
        }
        return insights;
    }
}
exports.AIService = AIService;
//# sourceMappingURL=AIService.js.map