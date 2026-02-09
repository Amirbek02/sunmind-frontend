// Типы для API запросов и ответов

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  roles: string;
  created_at: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
  error?: string;
}

// WebSocket типы
export type WebSocketMessageType = 'telemetry' | 'device_connection' | 'command_ack' | 'error';

export interface TelemetryMessage {
  type: 'telemetry';
  device_id: string;
  data: {
    lux?: number;
    motion_detected: boolean;
    relay_state: 'ON' | 'OFF';
    battery_level?: number;
    solar_voltage?: number;
    power_source: 'solar' | 'battery' | 'grid';
    timestamp: string;
  };
}

export interface DeviceConnectionMessage {
  type: 'device_connection';
  device_id: string;
  device_name: string;
  connected: boolean;
}

export interface CommandAckMessage {
  type: 'command_ack';
  device_id: string;
  command_id: string;
  success: boolean;
  message?: string;
}

export interface ErrorMessage {
  type: 'error';
  error: string;
  code: string;
}

export type WebSocketMessage =
  | TelemetryMessage
  | DeviceConnectionMessage
  | CommandAckMessage
  | ErrorMessage;

export interface SendCommandMessage {
  type: 'send_command';
  device_id: string;
  command: 'set_relay' | 'set_brightness' | 'reboot';
  payload: Record<string, any>;
}

// Типы для устройств
export interface Device {
  id: string;
  name: string;
  api_key: string;
  user_id: string;
  is_online: boolean;
  last_seen?: string;
  created_at: string;
}

export interface DeviceTelemetry {
  lux?: number;
  motion_detected: boolean;
  relay_state: 'ON' | 'OFF';
  battery_level?: number;
  solar_voltage?: number;
  power_source: 'solar' | 'battery' | 'grid';
  timestamp: string;
}

export interface DeviceSettings {
  brightness_default: number;
  lux_threshold: number;
  occupancy_timeout: number;
  eco_mode_enabled: boolean;
  relay_type: 'normally_open' | 'normally_closed';
}
