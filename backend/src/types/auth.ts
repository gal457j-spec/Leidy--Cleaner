export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'staff' | 'admin';
  bio?: string | null;
  photoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Availability {
  id: string;
  staffId: string;
  day: string;
  startTime: string;
  endTime: string;
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
