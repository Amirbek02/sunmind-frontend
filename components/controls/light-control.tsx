'use client';

import { useState } from 'react';
import { useLightStore } from '@/store/light-store';
import { toast } from 'react-hot-toast';
import type { LightMode } from '@/types';

export function LightControl() {
  const { settings, togglePower, setBrightness, setMode, setControlMode, resetToDefault } =
    useLightStore();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleTogglePower = () => {
    if (settings.isOn) {
      setIsConfirming(true);
      setTimeout(() => {
        togglePower();
        toast.success('Светильник выключен');
        setIsConfirming(false);
      }, 500);
    } else {
      togglePower();
      toast.success('Светильник включен');
    }
  };

  const handleBrightnessChange = async (value: number) => {
    setBrightness(value);

    try {
      const response = await fetch(`https://sunmind-backend.vercel.app/light/brightness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: value, turn_on_if_off: true }),
      });

      if (response.ok) {
        toast.success(`Яркость: ${Math.round((value / 255) * 100)}%`);
      }
    } catch (error) {
      toast.error('Не удалось изменить яркость');
    }
  };

  const MODE_BRIGHTNESS: Record<LightMode, number> = {
    economy: 64,
    maximum: 255,
    default: 128,
    custom: 128,
  };

  const handleModeChange = async (mode: LightMode) => {
    setMode(mode);
    const newBrightness = MODE_BRIGHTNESS[mode];
    setBrightness(newBrightness);

    toast.success(`Режим: ${getModeLabel(mode)}`);

    try {
      await fetch(`https://sunmind-backend.vercel.app/light/brightness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newBrightness }),
      });
    } catch (error) {
      toast.error('Не удалось синхронизировать режим с ESP32');
    }
  };

  const handleReset = () => {
    resetToDefault();
    toast.success('Настройки сброшены');
  };

  const getModeLabel = (mode: LightMode): string => {
    const labels: Record<LightMode, string> = {
      economy: 'Эконом',
      maximum: 'Максимум света',
      default: 'По умолчанию',
      custom: 'Пользовательский',
    };
    return labels[mode];
  };

  // Новый функционал: режим управления (ручной/авто)
  const handleControlModeChange = (mode: 'manual' | 'auto') => {
    setControlMode(mode);
    toast.success(`Режим управления: ${mode === 'manual' ? 'Ручной' : 'Автоматический'}`);
  };

  return (
    <div className="space-y-6">
      {/* Включение/выключение */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Управление питанием
        </h3>
        <div className="flex items-center justify-center">
          <button
            onClick={handleTogglePower}
            disabled={isConfirming || settings.controlMode === 'auto'} // нельзя включать вручную в авто
            className={`relative flex h-32 w-32 items-center justify-center rounded-full transition-all duration-300 ${
              settings.isOn
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/50'
                : 'bg-gray-300 dark:bg-gray-700'
            } ${isConfirming ? 'animate-pulse' : ''}`}>
            <svg
              className={`h-16 w-16 transition-colors ${
                settings.isOn ? 'text-white' : 'text-gray-500'
              }`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor">
              {settings.isOn ? (
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              ) : (
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              )}
            </svg>
            {settings.isOn && (
              <>
                <div className="absolute inset-0 animate-ping rounded-full bg-orange-400 opacity-75"></div>
                <div className="absolute inset-0 animate-ping rounded-full bg-orange-400 opacity-50 delay-150"></div>
              </>
            )}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {settings.isOn ? 'Светильник включен' : 'Светильник выключен'}
        </p>
      </div>

      {/* Режим управления */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Режим управления
        </h3>
        <div className="flex gap-4">
          {['manual', 'auto'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleControlModeChange(mode as 'manual' | 'auto')}
              className={`flex-1 rounded-lg border p-3 text-center font-medium transition-colors ${
                settings.controlMode === mode
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
              }`}>
              {mode === 'manual' ? 'Ручной' : 'Автоматический'}
            </button>
          ))}
        </div>
      </div>

      {/* Яркость */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Яркость</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="255"
            value={settings.brightness}
            onChange={(e) => handleBrightnessChange(Number(e.target.value))}
            disabled={settings.controlMode === 'auto'} // отключаем в авто
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${Math.round(
                (settings.brightness / 255) * 100,
              )}%, #e5e7eb ${settings.brightness}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">0%</span>
            <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
              {Math.round((settings.brightness / 255) * 100)}%
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">100%</span>
          </div>
        </div>
      </div>

      {/* Режимы работы */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Режимы работы</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(['economy', 'maximum', 'default', 'custom'] as LightMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                settings.mode === mode
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
              }`}>
              <div
                className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                  settings.mode === mode
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                <svg
                  className={`h-6 w-6 ${settings.mode === mode ? 'text-white' : 'text-gray-500'}`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span
                className={`text-sm font-medium ${
                  settings.mode === mode
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                {getModeLabel(mode)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Сброс настроек */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Дополнительные действия
        </h3>
        <button
          onClick={handleReset}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          Сбросить настройки по умолчанию
        </button>
      </div>
    </div>
  );
}
