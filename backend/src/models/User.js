/**
 * User Model
 * Schema de usuários
 */

class User {
  constructor(data) {
    this.id = data.id || Math.random().toString(36).substr(2, 9);
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password; // Hash em produção
    this.address = data.address;
    this.profileImage = data.profileImage;
    this.role = data.role || 'customer'; // 'customer', 'admin', 'team'
    this.isActive = data.isActive !== false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}

module.exports = User;
