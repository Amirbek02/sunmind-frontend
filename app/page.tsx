'use client';

import Link from 'next/link';
import { MotionSensor } from '@/components/motion-sensor';
import { LightnessChart } from '@/components/lightness-chart';
import { ReviewsSection } from '@/components/reviews-section';

// Mock данные для графика освещенности
const lightnessData = [
  { time: '00:00', lux: 0 },
  { time: '06:00', lux: 50 },
  { time: '12:00', lux: 800 },
  { time: '18:00', lux: 400 },
  { time: '24:00', lux: 0 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 py-20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              SunMind
            </h1>
            <p className="mb-8 text-xl text-gray-700 dark:text-gray-300">
              Автономные интеллектуальные светильники нового поколения
            </p>
            <Link
              href="/dashboard/control"
              className="inline-block rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90"
            >
              Подробнее
            </Link>
          </div>
        </div>
      </section>

      {/* О продукте */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              О продукте SunMind
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                  <svg
                    className="h-6 w-6 text-white"
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
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Автономность
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Полностью автономная работа благодаря солнечным панелям и
                  интеллектуальному управлению энергопотреблением.
                </p>
              </div>

              <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-500">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Экономия энергии
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  До 80% экономии электроэнергии благодаря умному управлению и
                  датчикам движения.
                </p>
              </div>

              <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Качество света
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Оптимальное качество освещения с регулируемой яркостью и
                  цветовой температурой.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Датчик движения */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Датчик движения
            </h2>
            <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
              Интеллектуальный датчик движения автоматически включает освещение
              при обнаружении активности
            </p>
            <MotionSensor />
          </div>
        </div>
      </section>

      {/* Аварийное отключение */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Аварийное отключение
            </h2>
            <div className="rounded-lg border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <svg
                    className="h-10 w-10 text-red-600 dark:text-red-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  В случае аварийной ситуации светильник может быть немедленно
                  отключен через систему управления
                </p>
                <button
                  disabled
                  className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white opacity-50"
                >
                  Аварийное отключение (UI-заглушка)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Статистика освещенности */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Статистика освещённости
            </h2>
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Текущее значение
                </span>
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  450 люкс
                </span>
              </div>
              <LightnessChart data={lightnessData} />
            </div>
          </div>
        </div>
      </section>

      {/* О нас */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              О нас
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  SunMind — это инновационная компания, специализирующаяся на
                  разработке и производстве интеллектуальных светильников нового
                  поколения. Наша миссия — сделать освещение более эффективным,
                  экологичным и удобным.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Мы используем передовые технологии для создания продуктов,
                  которые не только обеспечивают качественное освещение, но и
                  способствуют сохранению окружающей среды.
                </p>
              </div>
              <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-700">
                <div className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                    <span className="text-4xl font-bold text-white">S</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Команда SunMind
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Отзывы
            </h2>
            <ReviewsSection />
          </div>
        </div>
      </section>
    </div>
  );
}
