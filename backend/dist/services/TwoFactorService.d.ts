export interface TwoFactorSecret {
    secret: string;
    otpauthUrl: string;
    qrCode: string;
}
export interface TwoFactorVerification {
    verified: boolean;
    message: string;
}
export declare class TwoFactorService {
    /**
     * Gera um segredo TOTP para um usuário
     */
    static generateTOTPSecret(email: string): Promise<TwoFactorSecret>;
    /**
     * Verifica um código TOTP
     */
    static verifyTOTPCode(secret: string, token: string): boolean;
    /**
     * Ativa 2FA para um usuário
     */
    static enable2FA(userId: string, secret: string): Promise<void>;
    /**
     * Desativa 2FA para um usuário
     */
    static disable2FA(userId: string): Promise<void>;
    /**
     * Verifica se 2FA está ativado para um usuário
     */
    static is2FAEnabled(userId: string): Promise<boolean>;
    /**
     * Obtém o segredo 2FA de um usuário
     */
    static get2FASecret(userId: string): Promise<string | null>;
    /**
     * Valida um código 2FA durante o login
     */
    static validate2FACode(userId: string, token: string): Promise<TwoFactorVerification>;
    /**
     * Gera códigos de backup para recuperação
     */
    static generateBackupCodes(): string[];
    /**
     * Salva códigos de backup para um usuário
     */
    static saveBackupCodes(userId: string, codes: string[]): Promise<void>;
    /**
     * Valida um código de backup
     */
    static validateBackupCode(userId: string, code: string): Promise<boolean>;
    /**
     * Obtém estatísticas de 2FA
     */
    static getStats(): Promise<{
        totalUsers: number;
        usersWith2FA: number;
        recentVerifications: number;
    }>;
}
//# sourceMappingURL=TwoFactorService.d.ts.map