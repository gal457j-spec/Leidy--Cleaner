import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'staff' | 'admin';
}

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  category: string;
  isActive: boolean;
}

interface ApiError {
  message: string;
  status: number;
}

class ApiClient {
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      const token = this.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest) {
          const refreshToken = this.getRefreshToken();
          if (refreshToken) {
            try {
              const response = await axios.post(
                `${API_BASE_URL}/auth/refresh-token`,
                { refreshToken }
              );

              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

              this.setTokens(newAccessToken, newRefreshToken);

              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              this.clearTokens();
              window.location.href = '/auth/login';
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Auth endpoints
  async register(
    email: string,
    password: string,
    name: string,
    phone?: string
  ): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await this.client.post('/auth/register', {
        email,
        password,
        name,
        phone,
      });
      const { user, tokens } = response.data.data;
      this.setTokens(tokens.accessToken, tokens.refreshToken);
      return { user, tokens };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await this.client.post('/auth/login', {
        email,
        password,
      });
      const { user, tokens } = response.data.data;
      this.setTokens(tokens.accessToken, tokens.refreshToken);
      return { user, tokens };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<{ tokens: AuthTokens }> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });

      const { tokens } = response.data.data;
      this.setTokens(tokens.accessToken, tokens.refreshToken);
      return { tokens };
    } catch (error) {
      this.clearTokens();
      throw this.handleError(error);
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.client.get('/auth/me');
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await this.client.put('/auth/me', data);
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    this.clearTokens();
  }

  // Service endpoints
  async getServices(options?: {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
  }): Promise<{ services: Service[]; pagination: any }> {
    try {
      const response = await this.client.get('/services', { params: options });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getServiceById(id: string): Promise<Service> {
    try {
      const response = await this.client.get(`/services/${id}`);
      return response.data.data.service;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getServiceCategories(): Promise<string[]> {
    try {
      const response = await this.client.get('/services/categories');
      return response.data.data.categories;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createService(data: {
    name: string;
    description: string;
    basePrice: number;
    durationMinutes: number;
    category: string;
  }): Promise<Service> {
    try {
      const response = await this.client.post('/services', data);
      return response.data.data.service;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    try {
      const response = await this.client.put(`/services/${id}`, data);
      return response.data.data.service;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      await this.client.delete(`/services/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.error?.message || error.message || 'Unknown error';
      return { message, status };
    }

    if (error instanceof Error) {
      return { message: error.message, status: 500 };
    }

    return { message: 'Unknown error', status: 500 };
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  getTokenUser(): { id: string; email: string; role: string } | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  }
}

export const apiClient = new ApiClient();
export type { User, Service, AuthTokens, ApiError };
