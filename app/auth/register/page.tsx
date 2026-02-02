'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (password.length < 8) {
      toast.error('Пароль должен содержать минимум 8 символов');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      toast.success('Регистрация успешна!');
      router.push('/dashboard/control');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при регистрации';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Регистрация
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Или{' '}
            <Link
              href="/auth/login"
              className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400"
            >
              войдите в существующий аккаунт
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Имя
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="Ваше имя"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Подтверждение пароля
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
