/**
 * Hour Pricing Service
 * Sistema de preçagem por HORAS com extras
 * 
 * Regra:
 * - Base: R$ 40
 * - Por hora: +R$ 20 até 8h
 * - Após 8h: +40% sobre valor de 8h
 * - Extras com 40% de taxa (exceto Levar Produtos que é fixo)
 */

class HourPricingService {
  /**
   * Constantes de preçagem
   */
  static BASE_PRICE = 40; // R$ 40 iniciais
  static PRICE_PER_HOUR = 20; // R$ 20 por hora
  static HOURS_THRESHHOLD = 8; // Até 8 horas normal
  static SURGE_TAX = 0.40; // 40% de taxa após 8h
  static EXTRAS_TAX = 0.40; // 40% de taxa nos extras

  /**
   * Extras disponíveis
   */
  static EXTRAS = {
    organizacao: {
      name: 'Organização',
      type: 'percentage', // 10% do valor base
      value: 0.10,
      withTax: true
    },
    pos_obra: {
      name: 'Pós-Obra',
      type: 'percentage', // 30% do valor base
      value: 0.30,
      withTax: true
    },
    levar_produtos: {
      name: 'Levar os Produtos',
      type: 'fixed', // R$ 30 fixo
      value: 30,
      withTax: false // Sem taxa
    }
  };

  /**
   * Calcular preço para um agendamento
   * @param {number} hours - Quantidade de horas
   * @param {array} extras - Array de extras selecionados
   * @returns {object} Breakdown do preço
   */
  static calculatePrice(hours, extras = []) {
    if (hours <= 0) throw new Error('Hours must be greater than 0');

    // ============ CÁLCULO DO PREÇO BASE (HORAS) ============
    let basePrice = this.BASE_PRICE;

    if (hours <= this.HOURS_THRESHHOLD) {
      // Até 8 horas: R$ 40 + (horas - 1) * R$ 20
      basePrice = this.BASE_PRICE + (hours - 1) * this.PRICE_PER_HOUR;
    } else {
      // Após 8 horas: R$ 40 + 7*20 = R$ 180, depois * 1.4
      const eightHourPrice = this.BASE_PRICE + (this.HOURS_THRESHHOLD - 1) * this.PRICE_PER_HOUR;
      const extraHours = hours - this.HOURS_THRESHHOLD;
      basePrice = eightHourPrice * (1 + this.SURGE_TAX) + extraHours * this.PRICE_PER_HOUR;
    }

    // ============ CÁLCULO DOS EXTRAS PERCENTUAIS ============
    let percentualExtrasTotal = 0;
    let fixedExtrasTotal = 0;
    const extrasBreakdown = [];

    if (extras && Array.isArray(extras)) {
      for (const extraId of extras) {
        const extra = this.EXTRAS[extraId];
        if (!extra) continue;

        if (extra.type === 'percentage') {
          // Calcular percentual sobre a base (sem taxa ainda)
          const percentualValue = basePrice * extra.value;
          percentualExtrasTotal += percentualValue;
          extrasBreakdown.push({
            name: extra.name,
            type: 'percentage',
            baseValue: percentualValue,
            isPercentual: true
          });
        } else if (extra.type === 'fixed') {
          // Valor fixo (sem taxa)
          fixedExtrasTotal += extra.value;
          extrasBreakdown.push({
            name: extra.name,
            type: 'fixed',
            baseValue: extra.value,
            isPercentual: false
          });
        }
      }
    }

    // ============ APLICAR TAXA DE 40% ============
    // A taxa é aplicada em cima de (horas + extras percentuais)
    // Os extras fixos (levar produtos) não recebem taxa
    const subtotalComTaxa = basePrice + percentualExtrasTotal;
    const taxValue = subtotalComTaxa * this.EXTRAS_TAX;
    
    // Atualizar breakdown com tax
    extrasBreakdown.forEach((extra, idx) => {
      if (extra.isPercentual) {
        const taxOnThisExtra = extra.baseValue * this.EXTRAS_TAX;
        extrasBreakdown[idx].tax = taxOnThisExtra;
        extrasBreakdown[idx].total = extra.baseValue + taxOnThisExtra;
      } else {
        extrasBreakdown[idx].tax = 0;
        extrasBreakdown[idx].total = extra.baseValue;
      }
    });

    // ============ CÁLCULO FINAL ============
    const finalPrice = basePrice + percentualExtrasTotal + taxValue + fixedExtrasTotal;

    return {
      hours,
      basePrice: Math.round(basePrice * 100) / 100,
      percentualExtrasTotal: Math.round(percentualExtrasTotal * 100) / 100,
      taxValue: Math.round(taxValue * 100) / 100,
      fixedExtrasTotal: Math.round(fixedExtrasTotal * 100) / 100,
      extrasBreakdown,
      finalPrice: Math.round(finalPrice * 100) / 100,
      breakdown: {
        basePriceCalculation: `R$ ${this.BASE_PRICE} + (${hours - 1} × R$ ${this.PRICE_PER_HOUR})`,
        withPercentualExtras: `R$ ${Math.round(basePrice * 100) / 100} + R$ ${Math.round(percentualExtrasTotal * 100) / 100}`,
        taxApplied: `${this.EXTRAS_TAX * 100}% = R$ ${Math.round(taxValue * 100) / 100}`,
        withFixedExtras: `+ R$ ${Math.round(fixedExtrasTotal * 100) / 100} (fixos)`,
        summary: `R$ ${Math.round(finalPrice * 100) / 100}`
      }
    };
  }

  /**
   * Calcular múltiplos agendamentos (para vários locais)
   * @param {array} bookings - Array com {hours, extras, location}
   * @returns {object} Breakdown com opções de pagamento
   */
  static calculateMultipleBookings(bookings) {
    const results = [];
    let totalPrice = 0;

    for (const booking of bookings) {
      const priceData = this.calculatePrice(booking.hours, booking.extras);
      results.push({
        location: booking.location || `Local ${results.length + 1}`,
        ...priceData
      });
      totalPrice += priceData.finalPrice;
    }

    return {
      bookings: results,
      totalPrice: Math.round(totalPrice * 100) / 100,
      paymentOptions: {
        individual: {
          description: 'Pagamento separado para cada local',
          totalPrice: Math.round(totalPrice * 100) / 100,
          payments: results.map(b => ({
            location: b.location,
            amount: b.finalPrice
          }))
        },
        combined: {
          description: 'Pagamento único para todos os locais',
          totalPrice: Math.round(totalPrice * 100) / 100,
          discount: 0 // Pode aplicar desconto se quiser
        }
      }
    };
  }

  /**
   * Listar extras disponíveis
   */
  static getAvailableExtras() {
    return Object.entries(this.EXTRAS).map(([key, value]) => ({
      id: key,
      name: value.name,
      type: value.type,
      value: value.value,
      withTax: value.withTax,
      formattedValue: value.type === 'percentage' 
        ? `${value.value * 100}% da base`
        : `R$ ${value.value}`
    }));
  }
}

module.exports = HourPricingService;
