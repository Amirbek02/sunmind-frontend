'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wsClient } from '@/lib/api/websocket';
import { useDeviceStore } from './device-store';
import type { LightSettings, LightMode } from '@/types';
import { apiClient } from '@/lib/api/client';

interface LightState {
  settings: LightSettings;
  deviceId: string | null;
  updateSettings: (updates: Partial<LightSettings>) => void;
  setBrightness: (brightness: number) => void;
  setMode: (mode: LightMode) => void;
  togglePower: () => void;
  resetToDefault: () => void;
  setDeviceId: (deviceId: string | null) => void;
  syncWithDevice: (deviceId: string) => void;
}

const defaultSettings: LightSettings = {
  isOn: false,
  brightness: 50,
  mode: 'default',
};

export const useLightStore = create<LightState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      deviceId: null,

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      setBrightness: (brightness: number) => {
        const { deviceId } = get();
        set((state) => ({
          settings: { ...state.settings, brightness },
        }));

        // Отправляем команду устройству через WebSocket
        if (deviceId && wsClient.isConnected()) {
          try {
            wsClient.sendCommand({
              type: 'send_command',
              device_id: deviceId,
              command: 'set_brightness',
              payload: { brightness },
            });
          } catch (error) {
            console.error('Ошибка при отправке команды изменения яркости:', error);
          }
        }
      },

      setMode: (mode: LightMode) => {
        const { deviceId, settings } = get();
        const modeSettings: Partial<LightSettings> = {
          mode,
        };

        switch (mode) {
          case 'economy':
            modeSettings.brightness = 30;
            break;
          case 'maximum':
            modeSettings.brightness = 100;
            break;
          case 'default':
            modeSettings.brightness = 50;
            break;
        }

        set((state) => ({
          settings: { ...state.settings, ...modeSettings },
        }));

        // Отправляем команду устройствам
        if (deviceId && wsClient.isConnected()) {
          try {
            const brightness = modeSettings.brightness || settings.brightness;
            wsClient.sendCommand({
              type: 'send_command',
              device_id: deviceId,
              command: 'set_brightness',
              payload: { brightness },
            });
          } catch (error) {
            console.error('Ошибка при отправке команды изменения режима:', error);
          }
        }
      },

      togglePower: async () => {
        const { deviceId, settings } = get();
        const newState = !settings.isOn;

        set((state) => ({
          settings: { ...state.settings, isOn: newState },
        }));

        try {
          const response = await apiClient.toggle();
          console.log('response', response);
        } catch (error) {
          console.error('Ошибка при отправке команды переключения питания:', error);
          // Откатываем изменение при ошибке
          set((state) => ({
            settings: { ...state.settings, isOn: !newState },
          }));
        }
      },

      resetToDefault: () => {
        set({
          settings: defaultSettings,
        });
      },

      setDeviceId: (deviceId: string | null) => {
        set({ deviceId });
      },

      syncWithDevice: (deviceId: string) => {
        const deviceStore = useDeviceStore.getState();
        const telemetry = deviceStore.deviceTelemetry.get(deviceId);

        if (telemetry) {
          set((state) => ({
            settings: {
              ...state.settings,
              isOn: telemetry.relay_state === 'ON',
              brightness: telemetry.lux
                ? Math.min(100, Math.max(0, telemetry.lux / 10))
                : state.settings.brightness,
            },
            deviceId,
          }));
        }
      },
    }),
    {
      name: 'light-storage',
    },
  ),
);
