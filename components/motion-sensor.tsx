'use client';

import { useState, useEffect } from 'react';

export function MotionSensor() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Симуляция работы датчика движения
    const interval = setInterval(() => {
      setIsActive((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-64 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="relative">
        {/* Иконка датчика */}
        <div
          className={`flex h-32 w-32 items-center justify-center rounded-full transition-all duration-500 ${
            isActive
              ? 'bg-green-500 shadow-lg shadow-green-500/50'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        >
          <svg
            className={`h-16 w-16 transition-colors ${
              isActive ? 'text-white' : 'text-gray-500'
            }`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Волны при активации */}
        {isActive && (
          <>
            <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75"></div>
            <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-50 delay-150"></div>
          </>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
        <span
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {isActive ? 'Движение обнаружено' : 'Ожидание'}
        </span>
      </div>
    </div>
  );
}
