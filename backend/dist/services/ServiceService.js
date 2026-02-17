import { query } from '../utils/database';
import { logger } from '../utils/logger';
export class ServiceService {
    static async getAll(filters) {
        let whereClause = 'WHERE is_active = true';
        const params = [];
        let paramCount = 1;
        if (filters?.category) {
            whereClause += ` AND category = $${paramCount++}`;
            params.push(filters.category);
        }
        if (filters?.search) {
            whereClause += ` AND (name ILIKE $${paramCount++} OR description ILIKE $${paramCount})`;
            params.push(`%${filters.search}%`);
            params.push(`%${filters.search}%`);
            paramCount += 2;
        }
        // Get total count
        const countResult = await query(`SELECT COUNT(*) as total FROM services ${whereClause}`, params);
        // Get paginated results
        const limit = filters?.limit || 10;
        const offset = filters?.offset || 0;
        const services = await query(`SELECT id, name, description, base_price, duration_minutes, category, is_active, created_at
       FROM services ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`, [...params, limit, offset]);
        return {
            services,
            total: parseInt(countResult[0].total),
        };
    }
    static async getById(id) {
        const result = await query(`SELECT id, name, description, base_price, duration_minutes, category, is_active, created_at
       FROM services WHERE id = $1 AND is_active = true`, [id]);
        return result.length > 0 ? result[0] : null;
    }
    static async create(serviceData) {
        const result = await query(`INSERT INTO services (name, description, base_price, duration_minutes, category, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
       RETURNING id, name, description, base_price, duration_minutes, category, is_active, created_at`, [
            serviceData.name,
            serviceData.description || null,
            serviceData.basePrice,
            serviceData.durationMinutes,
            serviceData.category,
        ]);
        logger.info(`✅ Service created: ${serviceData.name}`);
        return result[0];
    }
    static async update(id, serviceData) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (serviceData.name) {
            fields.push(`name = $${paramCount++}`);
            values.push(serviceData.name);
        }
        if (serviceData.description) {
            fields.push(`description = $${paramCount++}`);
            values.push(serviceData.description);
        }
        if (serviceData.basePrice !== undefined) {
            fields.push(`base_price = $${paramCount++}`);
            values.push(serviceData.basePrice);
        }
        if (serviceData.durationMinutes !== undefined) {
            fields.push(`duration_minutes = $${paramCount++}`);
            values.push(serviceData.durationMinutes);
        }
        if (serviceData.category) {
            fields.push(`category = $${paramCount++}`);
            values.push(serviceData.category);
        }
        if (fields.length === 0) {
            return this.getById(id);
        }
        fields.push(`updated_at = NOW()`);
        values.push(id);
        const queryStr = `UPDATE services SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await query(queryStr, values);
        return result.length > 0 ? result[0] : null;
    }
    static async delete(id) {
        await query('UPDATE services SET is_active = false WHERE id = $1', [id]);
        logger.info(`✅ Service deleted: ${id}`);
    }
    static async getCategories() {
        const result = await query('SELECT DISTINCT category FROM services WHERE is_active = true ORDER BY category');
        return result.map((row) => row.category);
    }
}
//# sourceMappingURL=ServiceService.js.map