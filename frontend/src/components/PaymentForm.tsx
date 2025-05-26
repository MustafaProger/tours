import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Divider,
  Stack,
  InputAdornment
} from '@mui/material';
import {
  Payment,
  CreditCard,
  CalendarToday,
  Lock,
  Person,
  Email,
  Phone,
  Info,
  Cancel,
  CheckCircle,
  LocationOn,
  CurrencyRuble
} from '@mui/icons-material';
import { Booking, bookingService, PaymentData } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

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

  return (
    <Dialog 
      open={open} 
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Payment color="primary" />
          <Typography variant="h6">Оплата бронирования</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} className="space-y-6">
          {/* Информация о туре */}
          <div className="card p-4">
            <Typography variant="subtitle1" gutterBottom color="primary" className="font-semibold">
              Информация о бронировании
            </Typography>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Typography variant="body2" color="text.secondary">Тур:</Typography>
                <Typography variant="body2" className="font-medium">
                  {booking.tour?.title || 'Не указан'}
                </Typography>
              </div>
              <div className="flex items-center justify-between">
                <Typography variant="body2" color="text.secondary">Дата:</Typography>
                <Typography variant="body2" className="font-medium">
                  {booking.date ? new Date(booking.date).toLocaleDateString('ru-RU') : 'Не указана'}
                </Typography>
              </div>
              <div className="flex items-center justify-between">
                <Typography variant="body2" color="text.secondary">ID бронирования:</Typography>
                <Typography variant="body2" className="font-medium">
                  {booking._id}
                </Typography>
              </div>
              <div className="flex items-center justify-between">
                <Typography variant="body2" color="text.secondary">Ваш user._id:</Typography>
                <Typography variant="body2" className="font-medium">
                  {user?.id}
                </Typography>
              </div>
              <div className="flex items-center justify-between">
                <Typography variant="body2" color="text.secondary">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <LocationOn fontSize="small" />
                    Место проведения:
                  </Box>
                </Typography>
                <Typography 
                  variant="body2" 
                  className="font-medium"
                  color={location === 'Не указано' ? 'error' : 'inherit'}
                >
                  {location}
                </Typography>
              </div>
              <div className="flex items-center justify-between">
                <Typography variant="body2" color="text.secondary">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CurrencyRuble fontSize="small" />
                    Сумма к оплате:
                  </Box>
                </Typography>
                <Typography 
                  variant="body2" 
                  className="font-medium"
                  color={price ? 'primary' : 'error'}
                >
                  {typeof price === 'number' 
                    ? `${price.toLocaleString('ru-RU')} ₽` 
                    : 'Не указана'}
                </Typography>
              </div>
            </div>
          </div>

          {!success ? (
            <>
              {/* Данные карты */}
              <div className="card p-4">
                <Typography variant="subtitle1" color="primary" className="font-semibold mb-4">
                  Данные карты
                </Typography>
                <div className="space-y-4">
                  <TextField
                    fullWidth
                    label="Номер карты"
                    value={formData.cardNumber}
                    onChange={handleInputChange('cardNumber')}
                    placeholder="0000 0000 0000 0000"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCard />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                      label="Срок действия"
                      value={formData.expiryDate}
                      onChange={handleInputChange('expiryDate')}
                      placeholder="ММ/ГГ"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday />
                          </InputAdornment>
                        ),
                      }}
                      disabled={loading}
                    />
                    <TextField
                      label="CVV"
                      value={formData.cvv}
                      onChange={handleInputChange('cvv')}
                      type="password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock />
                          </InputAdornment>
                        ),
                      }}
                      disabled={loading}
                    />
                  </div>

                  <TextField
                    fullWidth
                    label="Имя держателя карты"
                    value={formData.cardHolder}
                    onChange={handleInputChange('cardHolder')}
                    placeholder="IVAN IVANOV"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Контактные данные */}
              <div className="card p-4">
                <Typography variant="subtitle1" color="primary" className="font-semibold mb-4">
                  Контактные данные
                </Typography>
                <div className="space-y-4">
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="example@email.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                  />

                  <TextField
                    fullWidth
                    label="Телефон"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    placeholder="+7 (___) ___-__-__"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <Alert severity="error" icon={<Info />} className="rounded">
                  {error}
                </Alert>
              )}

              <Alert severity="info" icon={<Info />} className="rounded">
                Платеж безопасен. Мы не храним данные вашей карты.
              </Alert>
            </>
          ) : (
            <div className="card p-8 text-center">
              <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom color="success.main">
                Оплата прошла успешно!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Подтверждение отправлено на ваш email
              </Typography>
            </div>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        {!success && (
          <div className="flex justify-end gap-3 w-full">
            <Button
              onClick={onClose}
              color="inherit"
              startIcon={<Cancel />}
              disabled={loading}
              className="btn btn-outline"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              startIcon={<Payment />}
              disabled={loading || !price || !location || location === 'Не указано'}
              className="btn btn-primary"
            >
              {loading 
                ? 'Обработка...' 
                : !price 
                  ? 'Сумма не указана'
                  : !location || location === 'Не указано'
                    ? 'Место не указано'
                    : `Оплатить ${price.toLocaleString('ru-RU')} ₽`}
            </Button>
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentForm; 