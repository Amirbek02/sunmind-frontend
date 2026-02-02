import { API_CONFIG, getAuthToken } from './config';
import type {
  WebSocketMessage,
  SendCommandMessage,
  TelemetryMessage,
  DeviceConnectionMessage,
  CommandAckMessage,
  ErrorMessage,
} from './types';

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

type MessageHandler = (message: WebSocketMessage) => void;
type StatusHandler = (status: WebSocketStatus) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private status: WebSocketStatus = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Не подключаемся автоматически - подключение происходит через WebSocketProvider
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.warn('Токен не найден, WebSocket не подключен');
      this.setStatus('disconnected');
      return;
    }

    try {
      const wsURL = `${API_CONFIG.wsURL}/ws/user?token=${encodeURIComponent(token)}`;
      this.ws = new WebSocket(wsURL);
      this.setStatus('connecting');

      this.ws.onopen = () => {
        console.log('WebSocket подключен');
        this.setStatus('connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Ошибка при парсинге сообщения WebSocket:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('Ошибка WebSocket:', error);
        this.setStatus('error');
      };

      this.ws.onclose = () => {
        console.log('WebSocket отключен');
        this.setStatus('disconnected');
        this.stopHeartbeat();
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('Ошибка при создании WebSocket соединения:', error);
      this.setStatus('error');
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setStatus('disconnected');
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Достигнуто максимальное количество попыток переподключения');
      return;
    }

    if (this.reconnectTimer) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Попытка переподключения через ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    // Отправляем ping каждые 30 секунд для поддержания соединения
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private setStatus(status: WebSocketStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.statusHandlers.forEach((handler) => handler(status));
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  sendCommand(command: SendCommandMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(command));
    } else {
      console.error('WebSocket не подключен, команда не отправлена');
      throw new Error('WebSocket не подключен');
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    // Вызываем сразу текущий статус
    handler(this.status);
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  getStatus(): WebSocketStatus {
    return this.status;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton экземпляр
export const wsClient = new WebSocketClient();

// Экспорт типов для удобства
export type { WebSocketStatus };
