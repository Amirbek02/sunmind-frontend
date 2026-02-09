'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api/client';
import { setAuthToken, removeAuthToken } from '@/lib/api/config';
import { wsClient } from '@/lib/api/websocket';
import type { User, Role } from '@/types';

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

// Дефолтная роль, если с бэка вдруг не пришли роли
const defaultUserRole: Role = {
  id: 0,
  role_name: 'USER',
  description: 'Default user role',
};

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
          const user = await apiClient.getCurrentUser(response.access_token);

          set({
            user: {
              ...user,
              roles:
                Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : [defaultUserRole],
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
              roles:
                Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : [defaultUserRole],
            },
            token: loginResponse.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

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
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await apiClient.getCurrentUser();

          set({
            user: {
              ...user,
              roles:
                Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : [defaultUserRole],
            },
            isAuthenticated: true,
            isLoading: false,
          });

          if (!wsClient.isConnected()) {
            wsClient.connect();
          }
        } catch (error) {
          console.error('Ошибка при получении пользователя:', error);
          get().logout();
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token && typeof window !== 'undefined') {
          setTimeout(() => {
            state.fetchCurrentUser();
          }, 100);
        }
      },
    },
  ),
);
