// Конфигурация API

// export const API_CONFIG = {
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
//   wsURL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000',
//   timeout: 30000, // 30 секунд
// };

const TOKEN_KEY = 'auth-token';

// Сохраняем токен в localStorage
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// Получаем токен
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Удаляем токен
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Настройки API
export const API_CONFIG = {
  baseURL: 'https://sunmind-backend.vercel.app',
  wsURL: 'https://sunmind-backend.vercel.app',
  timeout: 30000, // 30 секунд
};
