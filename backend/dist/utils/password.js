import bcrypt from 'bcryptjs';
import { logger } from './logger';
const SALT_ROUNDS = 12;
export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }
    catch (error) {
        logger.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
};
export const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    }
    catch (error) {
        logger.error('Error comparing password:', error);
        throw new Error('Failed to compare password');
    }
};
//# sourceMappingURL=password.js.map