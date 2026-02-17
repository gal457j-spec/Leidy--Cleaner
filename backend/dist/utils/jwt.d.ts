import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/auth';
export declare const generateTokens: (payload: JWTPayload) => {
    accessToken: string;
    refreshToken: string;
};
export declare const verifyToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => JWTPayload;
export declare const decodeToken: (token: string) => string | jwt.JwtPayload | null;
//# sourceMappingURL=jwt.d.ts.map