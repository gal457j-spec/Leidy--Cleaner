/**
 * Service Model
 * Schema de serviços disponíveis
 */

class Service {
  constructor(data) {
    this.id = data.id || Math.random().toString(36).substr(2, 9);
    this.name = data.name;
    this.description = data.description;
    this.basePrice = data.basePrice;
    this.icon = data.icon;
    this.duration = data.duration; // em minutos
    this.category = data.category; // 'standard', 'deep', 'specialized'
    this.isActive = data.isActive !== false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

module.exports = Service;
