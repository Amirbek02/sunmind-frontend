'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api/client';
import { setAuthToken, removeAuthToken } from '@/lib/api/config';
import { wsClient } from '@/lib/api/websocket';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.login({ email, password });

          // Получаем информацию о пользователе
          console.log('token: ', response.access_token);
          const user = await apiClient.getCurrentUser(response.access_token);
          console.log('user', user);

          set({
            user: {
              ...user,
              role: (user.role as User['role']) || 'user',
            },
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Подключаем WebSocket после успешного входа
          if (typeof window !== 'undefined') {
            wsClient.connect();
          }

          return true;
        } catch (error) {
          console.error('Ошибка при входе:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const user = await apiClient.register({ name, email, password });

          // После регистрации автоматически входим
          const loginResponse = await apiClient.login({ email, password });

          set({
            user: {
              ...user,
              role: (user.role as User['role']) || 'user',
            },
            token: loginResponse.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Подключаем WebSocket после успешной регистрации
          if (typeof window !== 'undefined') {
            wsClient.connect();
          }

          return true;
        } catch (error) {
          console.error('Ошибка при регистрации:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        removeAuthToken();
        if (typeof window !== 'undefined') {
          wsClient.disconnect();
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      fetchCurrentUser: async () => {
        const { token } = get();
        if (!token) {
          return;
        }

        set({ isLoading: true });
        try {
          const user = await apiClient.getCurrentUser();
          set({
            user: {
              ...user,
              role: (user.role as User['role']) || 'user',
            },
            isAuthenticated: true,
            isLoading: false,
          });

          // Подключаем WebSocket если еще не подключен
          if (!wsClient.isConnected()) {
            wsClient.connect();
          }
        } catch (error) {
          console.error('Ошибка при получении пользователя:', error);
          // Если токен невалидный, выходим
          get().logout();
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      // Восстанавливаем токен при загрузке
      onRehydrateStorage: () => (state) => {
        // Пытаемся получить актуальную информацию о пользователе при загрузке
        if (state?.token && typeof window !== 'undefined') {
          // Используем setTimeout чтобы дать время Zustand восстановить состояние
          setTimeout(() => {
            state.fetchCurrentUser();
          }, 100);
        }
      },
    },
  ),
);
