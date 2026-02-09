'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function MotionSensor() {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/light/status');
        const data = await response.json();

        if (data.status === 'success' && data.device) {
          setIsActive(data.device.motion_active);
        }
      } catch (error) {
        console.error('Ошибка получения статуса датчика:', error);
      }
    };

    // Меняем 1000 на 5000 (интервал в 5 секунд)
    const interval = setInterval(fetchStatus, 3000);

    // Вызываем один раз сразу при загрузке, чтобы не ждать первые 5 секунд
    fetchStatus();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-64 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
      {/* ... ваш текущий JSX код иконки ... */}
      <div
        className={`flex h-32 w-32 items-center justify-center rounded-full transition-all duration-500 ${
          isActive ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-300 dark:bg-gray-700'
        }`}>
        {/* Иконка молнии/движения */}
        <svg
          className={`h-16 w-16 ${isActive ? 'text-white' : 'text-gray-500'}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      {/* Волны анимации */}
      {isActive && (
        <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-20"></div>
      )}

      <div className="absolute bottom-4">
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {isActive ? '🏃 Движение обнаружено' : '🔘 Датчик спокоен'}
        </span>
      </div>
    </div>
  );
}
