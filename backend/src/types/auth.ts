export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'staff' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export type UserResponse = Omit<User, 'createdAt' | 'updatedAt'>;

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}
