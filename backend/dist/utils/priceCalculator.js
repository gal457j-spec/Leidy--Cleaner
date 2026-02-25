"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateServicePrice = calculateServicePrice;
exports.calculatePriceBreakdown = calculatePriceBreakdown;
// Funções de cálculo de preços
function calculateServicePrice(durationHoursOrMinutes, isInHours = false) {
    // Converter minutos para horas se necessário
    const hours = isInHours ? durationHoursOrMinutes : durationHoursOrMinutes / 60;
    // Capping at 8 hours max
    const cappedHours = Math.min(hours, 8);
    // Cálculo: R$ 40 primeira hora + R$ 20 por hora adicional
    let basePrice = 0;
    if (cappedHours > 0) {
        basePrice = 40; // primeira hora
        if (cappedHours > 1) {
            basePrice += (cappedHours - 1) * 20; // horas adicionais
        }
    }
    // Aplicar taxa de 40%
    const fee = basePrice * 0.4;
    const totalPrice = basePrice + fee;
    return Math.round(totalPrice * 100) / 100; // arredondar para 2 casas decimais
}
function calculatePriceBreakdown(durationHoursOrMinutes, isInHours = false) {
    // Converter minutos para horas se necessário
    const hours = isInHours ? durationHoursOrMinutes : durationHoursOrMinutes / 60;
    // Capping at 8 hours max
    const cappedHours = Math.min(hours, 8);
    // Cálculo: R$ 40 primeira hora + R$ 20 por hora adicional
    let basePrice = 0;
    if (cappedHours > 0) {
        basePrice = 40; // primeira hora
        if (cappedHours > 1) {
            basePrice += (cappedHours - 1) * 20; // horas adicionais
        }
    }
    // Aplicar taxa de 40%
    const fee = Math.round(basePrice * 0.4 * 100) / 100;
    const total = Math.round((basePrice + fee) * 100) / 100;
    return {
        basePrice: Math.round(basePrice * 100) / 100,
        fee,
        total,
    };
}
//# sourceMappingURL=priceCalculator.js.map