'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useDeviceStore } from '@/store/device-store';
import { wsClient } from '@/lib/api/websocket';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuthStore();
  const initializeWebSocket = useDeviceStore((state) => state.initializeWebSocket);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // Отключаем WebSocket если пользователь не авторизован
      wsClient.disconnect();
      return;
    }

    // Подключаем WebSocket
    wsClient.connect();

    // Инициализируем обработчики сообщений
    const cleanup = initializeWebSocket();

    // Очистка при размонтировании
    return () => {
      cleanup();
    };
  }, [isAuthenticated, token, initializeWebSocket]);

  return <>{children}</>;
}
