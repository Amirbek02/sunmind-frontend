'use client';

import { create } from 'zustand';
import { wsClient } from '@/lib/api/websocket';
import type {
  Device,
  DeviceTelemetry,
  TelemetryMessage,
  DeviceConnectionMessage,
  CommandAckMessage,
} from '@/lib/api/types';

interface DeviceState {
  devices: Map<string, Device>;
  deviceTelemetry: Map<string, DeviceTelemetry>;
  selectedDeviceId: string | null;
  
  // Действия
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  updateDevice: (deviceId: string, updates: Partial<Device>) => void;
  removeDevice: (deviceId: string) => void;
  setSelectedDevice: (deviceId: string | null) => void;
  updateTelemetry: (deviceId: string, telemetry: DeviceTelemetry) => void;
  
  // WebSocket обработчики
  initializeWebSocket: () => () => void; // Возвращает функцию очистки
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: new Map(),
  deviceTelemetry: new Map(),
  selectedDeviceId: null,

  setDevices: (devices: Device[]) => {
    const devicesMap = new Map(devices.map((d) => [d.id, d]));
    set({ devices: devicesMap });
  },

  addDevice: (device: Device) => {
    set((state) => {
      const newDevices = new Map(state.devices);
      newDevices.set(device.id, device);
      return { devices: newDevices };
    });
  },

  updateDevice: (deviceId: string, updates: Partial<Device>) => {
    set((state) => {
      const device = state.devices.get(deviceId);
      if (!device) return state;

      const newDevices = new Map(state.devices);
      newDevices.set(deviceId, { ...device, ...updates });
      return { devices: newDevices };
    });
  },

  removeDevice: (deviceId: string) => {
    set((state) => {
      const newDevices = new Map(state.devices);
      newDevices.delete(deviceId);
      
      const newTelemetry = new Map(state.deviceTelemetry);
      newTelemetry.delete(deviceId);
      
      return {
        devices: newDevices,
        deviceTelemetry: newTelemetry,
        selectedDeviceId: state.selectedDeviceId === deviceId ? null : state.selectedDeviceId,
      };
    });
  },

  setSelectedDevice: (deviceId: string | null) => {
    set({ selectedDeviceId: deviceId });
  },

  updateTelemetry: (deviceId: string, telemetry: DeviceTelemetry) => {
    set((state) => {
      const newTelemetry = new Map(state.deviceTelemetry);
      newTelemetry.set(deviceId, telemetry);
      return { deviceTelemetry: newTelemetry };
    });
  },

  initializeWebSocket: () => {
    const handleMessage = (message: TelemetryMessage | DeviceConnectionMessage | CommandAckMessage) => {
      if (message.type === 'telemetry') {
        const { device_id, data } = message;
        get().updateTelemetry(device_id, {
          ...data,
          timestamp: data.timestamp || new Date().toISOString(),
        });
        
        // Обновляем статус устройства как онлайн
        get().updateDevice(device_id, {
          is_online: true,
          last_seen: new Date().toISOString(),
        });
      } else if (message.type === 'device_connection') {
        const { device_id, connected, device_name } = message;
        const device = get().devices.get(device_id);
        
        if (device) {
          get().updateDevice(device_id, {
            is_online: connected,
            last_seen: connected ? new Date().toISOString() : device.last_seen,
          });
        } else if (connected) {
          // Если устройство не найдено, но подключилось, создаем его
          // В реальном приложении нужно будет получить полную информацию с сервера
          get().addDevice({
            id: device_id,
            name: device_name,
            api_key: '', // Будет получено с сервера
            user_id: '', // Будет получено с сервера
            is_online: true,
            last_seen: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        }
      } else if (message.type === 'command_ack') {
        // Можно добавить обработку подтверждений команд
        console.log('Команда выполнена:', message);
      }
    };

    // Подписываемся на сообщения
    const unsubscribe = wsClient.onMessage(handleMessage);

    // Возвращаем функцию очистки
    return unsubscribe;
  },
}));
