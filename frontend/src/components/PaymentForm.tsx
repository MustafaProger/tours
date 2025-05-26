import React, { useState, useEffect } from 'react';
import { Booking, bookingService, PaymentData } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ open, onClose, booking, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    email: user?.email || '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Получаем актуальные данные о цене и местоположении
  const price = booking.tour?.price || booking.price;
  const location = booking.tour?.location || 'Не указано';

  // Загружаем сохраненные данные пользователя при открытии формы
  useEffect(() => {
    if (open && user) {
      const savedCardData = localStorage.getItem('savedCardData');
      if (savedCardData) {
        const parsedData = JSON.parse(savedCardData);
        setFormData(prev => ({
          ...prev,
          cardNumber: parsedData.cardNumber || '',
          cardHolder: parsedData.cardHolder || '',
          email: user.email || '',
          phone: parsedData.phone || ''
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
          phone: ''
        }));
      }
    }
  }, [open, user]);

  const handleInputChange = (field: keyof PaymentData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;

    // Форматирование номера карты
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    // Форматирование срока действия
    if (field === 'expiryDate') {
      value = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .slice(0, 5);
    }

    // Форматирование CVV
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    // Форматирование телефона
    if (field === 'phone') {
      value = value
        .replace(/\D/g, '')
        .replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5')
        .slice(0, 18);
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!price || typeof price !== 'number') {
      setError('Ошибка: не указана сумма к оплате');
      return false;
    }

    if (!location || location === 'Не указано') {
      setError('Ошибка: не указано место проведения тура');
      return false;
    }

    if (!validateCardNumber(formData.cardNumber)) {
      setError('Введите корректный номер карты');
      return false;
    }

    if (!validateExpiryDate(formData.expiryDate)) {
      setError('Срок действия карты истек или указан неверно');
      return false;
    }

    if (formData.cvv.length !== 3) {
      setError('Введите корректный CVV код (3 цифры)');
      return false;
    }

    if (!/^[A-Z\s]{2,}$/i.test(formData.cardHolder)) {
      setError('Имя держателя карты должно содержать только буквы');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Введите корректный email');
      return false;
    }

    if (!/^\+[0-9]\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(formData.phone)) {
      setError('Введите корректный номер телефона');
      return false;
    }

    return true;
  };

  const validateCardNumber = (number: string): boolean => {
    const digits = number.replace(/\s/g, '');
    if (digits.length !== 16) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const validateExpiryDate = (date: string): boolean => {
    if (date.length !== 5) return false;
    
    const [month, year] = date.split('/').map(num => parseInt(num));
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!booking._id) {
      setError('Ошибка: не найдено бронирование для оплаты');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Сохраняем данные карты (кроме CVV)
      const savedCardData = {
        cardNumber: formData.cardNumber,
        cardHolder: formData.cardHolder,
        phone: formData.phone
      };
      localStorage.setItem('savedCardData', JSON.stringify(savedCardData));

      const response = await bookingService.processPayment(booking._id, formData);
      
      if (!response || response.status === 'error') {
        throw new Error(response?.error || 'Ошибка при обработке платежа');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Произошла ошибка при обработке платежа');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={!loading ? onClose : undefined}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg sm:align-middle sm:max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">
                Оплата бронирования
              </h3>
            </div>
            {!loading && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Информация о бронировании */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-blue-600 mb-3">
                Информация о бронировании
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Тур:</span>
                  <p className="font-medium">{booking.tour?.title || 'Не указан'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Дата:</span>
                  <p className="font-medium">
                    {booking.date ? new Date(booking.date).toLocaleDateString('ru-RU') : 'Не указана'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">ID бронирования:</span>
                  <p className="font-medium text-gray-600">{booking._id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Место проведения:</span>
                  <p className={`font-medium ${location === 'Не указано' ? 'text-red-600' : ''}`}>
                    {location}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Сумма к оплате:</span>
                  <p className={`font-medium text-lg ${price ? 'text-blue-600' : 'text-red-600'}`}>
                    {typeof price === 'number' 
                      ? `${price.toLocaleString('ru-RU')} ₽` 
                      : 'Не указана'}
                  </p>
                </div>
              </div>
            </div>

            {!success ? (
              <>
                {/* Данные карты */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-blue-600">
                    Данные карты
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Номер карты
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={handleInputChange('cardNumber')}
                          placeholder="0000 0000 0000 0000"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Срок действия
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={handleInputChange('expiryDate')}
                            placeholder="ММ/ГГ"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <input
                            type="password"
                            value={formData.cvv}
                            onChange={handleInputChange('cvv')}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Имя держателя карты
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={formData.cardHolder}
                          onChange={handleInputChange('cardHolder')}
                          placeholder="IVAN IVANOV"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 uppercase"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Контактные данные */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-blue-600">
                    Контактные данные
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          placeholder="example@email.com"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange('phone')}
                          placeholder="+7 (___) ___-__-__"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Платеж безопасен. Мы не храним данные вашей карты.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-3 text-lg font-medium text-green-600">
                  Оплата прошла успешно!
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Подтверждение отправлено на ваш email
                </p>
              </div>
            )}

            {!success && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading || !price || !location || location === 'Не указано'}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    (loading || !price || !location || location === 'Не указано') ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Обработка...
                    </>
                  ) : !price ? (
                    'Сумма не указана'
                  ) : !location || location === 'Не указано' ? (
                    'Место не указано'
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      {`Оплатить ${price.toLocaleString('ru-RU')} ₽`}
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 