import { NewReview, Review } from '@/types';
import { API_CONFIG, getAuthToken } from './config';
import type { LoginRequest, LoginResponse, RegisterRequest, UserResponse, ApiError } from './types';

class ApiClient {
  mode(deviceId: string | null, mode: string) {
    throw new Error('Method not implemented.');
  }
  private baseURL: string;

  constructor(baseURL: string = process.env.REACT_APP_BASE_URL || API_CONFIG.baseURL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers = new Headers(options.headers);

    headers.set('Content-Type', 'application/json');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }));

        throw new Error(
          errorData.detail || errorData.message || errorData.error || 'Ошибка запроса',
        );
      }

      // Если ответ пустой (например, для 204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Неизвестная ошибка при выполнении запроса');
    }
  }

  // Аутентификация
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(token?: string): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/me', {
      headers: {
        Authorization: token ? `Bearer ${token}` : `Bearer ${getAuthToken()}`,
      },
    });
  }

  async getReviews(): Promise<Review[]> {
    return this.request<Review[]>('/review', {
      method: 'GET',
    });
  }

  // Добавить отзыв
  async addReview(data: NewReview): Promise<Review> {
    return this.request<Review>('/review', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async toggle(): Promise<Review> {
    return this.request<Review>('/light/toggle', {
      method: 'POST',
    });
  }
  async setControlMode(mode: 'manual' | 'auto'): Promise<Review> {
    return this.request<Review>('/light/mode', {
      method: 'POST',
      body: JSON.stringify({ mode }),
    });
  }

  // Удалить отзыв (опционально)
  async deleteReview(id: string): Promise<void> {
    return this.request<void>(`/review/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiClient = new ApiClient();
