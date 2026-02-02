'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import type { Review } from '@/types';
import { useReviewStore } from '@/store/review-store';

export function ReviewsSection() {
  const { addReview, reviews, fetchReviews } = useReviewStore();
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем отзывы при монтировании компонента
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      await fetchReviews();
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
      toast.error('Не удалось загрузить отзывы');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error('Пожалуйста, введите текст отзыва');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview: Review = {
        id: Date.now().toString(), // Можно убрать, если сервер сам генерирует ID
        author: author || 'Анонимный пользователь',
        text,
        rating,
        date: new Date().toISOString(),
      };

      // Сохраняем отзыв на сервере
      await addReview(newReview);

      // Сбрасываем форму
      setAuthor('');
      setText('');
      setRating(5);

      toast.success('Отзыв успешно добавлен!');
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error);
      toast.error('Не удалось сохранить отзыв. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Форма отзыва */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Оставить отзыв</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Имя (необязательно)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Ваше имя"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Оценка
            </label>
            <div className="mt-1 flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  disabled={isSubmitting}
                  className="focus:outline-none disabled:opacity-50">
                  <svg
                    className={`h-6 w-6 ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Отзыв
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Ваш отзыв..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
            {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
          </button>
        </form>
      </div>

      {/* Список отзывов */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Отзывы пользователей
          </h3>
          <button
            onClick={loadReviews}
            disabled={isLoading}
            className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            {isLoading ? 'Загрузка...' : 'Обновить'}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-500">Загрузка отзывов...</p>
          </div>
        ) : Array.from(reviews.values()).length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-gray-500">Пока нет отзывов. Будьте первым!</p>
          </div>
        ) : (
          Array.from(reviews.values()).map((review) => (
            <div
              key={review.id}
              className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">{review.author}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(review.date).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
