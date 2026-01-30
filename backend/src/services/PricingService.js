/**
 * Pricing Service
 * Cálculo dinâmico de preços
 */

class PricingService {
  /**
   * Calcular preço baseado em múltiplos fatores
   */
  calculatePrice(data) {
    let basePrice = 0;

    // 1. Preço base do serviço
    data.services.forEach(service => {
      basePrice += service.basePrice;
    });

    // 2. Multiplicador por metragem
    if (data.metragem) {
      basePrice += data.metragem * this.getPricePerSquareMeter();
    }

    // 3. Multiplicador de tipo de limpeza
    basePrice *= this.getCleaningTypeMultiplier(data.cleaningType);

    // 4. Multiplicador de frequência
    basePrice *= this.getFrequencyMultiplier(data.frequency);

    // 5. Multiplicador de urgência
    basePrice *= this.getUrgencyMultiplier(data.urgency);

    // 6. Descontos aplicáveis
    const discount = this.calculateDiscount(data);
    basePrice -= discount;

    // 7. Adicionar taxa de serviço
    const serviceFee = basePrice * 0.05; // 5% de taxa
    basePrice += serviceFee;

    return Math.max(basePrice, this.getMinimumPrice());
  }

  /**
   * Preço por metro quadrado
   */
  getPricePerSquareMeter() {
    return 0.5; // R$ 0.50 por m²
  }

  /**
   * Multiplicador por tipo de limpeza
   */
  getCleaningTypeMultiplier(type) {
    const multipliers = {
      standard: 1.0,
      deep: 1.5,
      moveInOut: 1.8,
      commercial: 2.0,
    };
    return multipliers[type] || 1.0;
  }

  /**
   * Multiplicador por frequência
   */
  getFrequencyMultiplier(frequency) {
    const multipliers = {
      once: 1.0,
      weekly: 0.8,
      biweekly: 0.9,
      monthly: 0.95,
    };
    return multipliers[frequency] || 1.0;
  }

  /**
   * Multiplicador por urgência
   */
  getUrgencyMultiplier(urgency) {
    const multipliers = {
      normal: 1.0,
      express: 1.3,
      emergency: 1.5,
    };
    return multipliers[urgency] || 1.0;
  }

  /**
   * Calcular descontos
   */
  calculateDiscount(data) {
    let discount = 0;

    // Desconto por cliente novo
    if (data.isNewCustomer) {
      discount += data.subtotal * 0.1; // 10% desconto
    }

    // Desconto por agendamento futuro
    if (data.daysUntilService > 7) {
      discount += data.subtotal * 0.05; // 5% desconto
    }

    // Desconto por múltiplos serviços
    if (data.services.length > 3) {
      discount += data.subtotal * 0.1; // 10% desconto
    }

    return discount;
  }

  /**
   * Preço mínimo do serviço
   */
  getMinimumPrice() {
    return 80; // R$ 80,00
  }

  /**
   * Simular múltiplas opções de preço
   */
  simulatePriceOptions(data) {
    return {
      standard: this.calculatePrice({ ...data, urgency: 'normal', frequency: 'once' }),
      express: this.calculatePrice({ ...data, urgency: 'express', frequency: 'once' }),
      emergency: this.calculatePrice({ ...data, urgency: 'emergency', frequency: 'once' }),
      weekly: this.calculatePrice({ ...data, frequency: 'weekly' }),
      monthly: this.calculatePrice({ ...data, frequency: 'monthly' }),
    };
  }
}

module.exports = new PricingService();
