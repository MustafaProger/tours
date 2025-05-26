import React, { useEffect, useState } from 'react';
import { Booking, bookingService } from '../services/bookingService';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CardMedia,
  CardActions,
  Divider,
  Stack
} from '@mui/material';
import { 
  CalendarToday, 
  AccessTime, 
  LocationOn, 
  Payment, 
  Cancel,
  CheckCircle,
  Warning,
  Info,
  CurrencyRuble
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PaymentForm from './PaymentForm';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose, booking }) => {
  const handlePayment = async () => {
    // TODO: Интеграция с платежной системой
    alert('Функция оплаты будет доступна в ближайшее время');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Payment color="primary" />
          <Typography variant="h6">Оплата бронирования</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Info color="info" />
            <Typography><strong>Тур:</strong> {booking.tour?.title || 'Без названия'}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CurrencyRuble color="primary" />
            <Typography><strong>Сумма к оплате:</strong> {typeof booking.price === 'number' ? `${booking.price.toLocaleString('ru-RU')} ₽` : '—'}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarToday color="action" />
            <Typography><strong>Дата тура:</strong> {booking.date ? new Date(booking.date).toLocaleDateString('ru-RU') : '—'}</Typography>
          </Box>
          <Alert severity="info" icon={<Info />}>
            После оплаты вам будет отправлено подтверждение на email
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" startIcon={<Cancel />}>
          Отмена
        </Button>
        <Button onClick={handlePayment} variant="contained" color="primary" startIcon={<Payment />}>
          Оплатить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      console.log('Bookings data:', response.data); // Для отладки
      setBookings(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err); // Для отладки
      setError('Не удалось загрузить бронирования');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      return;
    }
    try {
      await bookingService.cancelBooking(bookingId);
      await fetchBookings(); // обязательно обновить список!
    } catch (err) {
      setError('Не удалось отменить бронирование');
    }
  };

  const handlePaymentSuccess = async () => {
    await fetchBookings(); // обязательно обновить список!
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Загрузка бронирований...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }} icon={<Warning />}>{error}</Alert>
        <Button variant="outlined" onClick={fetchBookings} startIcon={<Info />}>
          Попробовать снова
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pt: 14 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 4 }}>
        <CalendarToday color="primary" />
        <Typography variant="h4" gutterBottom>
          Мои бронирования
        </Typography>
      </Box>
      
      {!bookings || bookings.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Info color="info" sx={{ fontSize: 40, mb: 2 }} />
          <Typography sx={{ mb: 2 }}>У вас пока нет забронированных туров</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            href="/tours"
            startIcon={<CalendarToday />}
          >
            Найти тур
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card 
              key={booking._id}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              sx={{ p: 4 }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/4">
                  <img 
                    src={booking.tour?.image || booking.tour?.imageCover || '/placeholder.jpg'} 
                    alt={booking.tour?.title || 'Изображение тура'} 
                    className="w-full h-32 object-cover rounded-md" 
                  />
                </div>
                <div className="md:w-3/4">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <Typography variant="h6">{booking.tour?.title || 'Без названия'}</Typography>
                    <Chip 
                      icon={booking.paid ? <CheckCircle /> : <Warning />}
                      label={booking.paid ? 'Оплачено' : 'Ожидает оплаты'}
                      color={booking.paid ? 'success' : 'warning'}
                      size="small"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Typography variant="body2" color="text.secondary">Дата бронирования:</Typography>
                      <Typography variant="body1">
                        {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('ru-RU') : '—'}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" color="text.secondary">Стоимость:</Typography>
                      <Typography variant="body1">
                        {typeof booking.price === 'number' ? `${booking.price.toLocaleString('ru-RU')} ₽` : '—'}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" color="text.secondary">Дата тура:</Typography>
                      <Typography variant="body1">
                        {booking.date ? new Date(booking.date).toLocaleDateString('ru-RU') : '—'}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2" color="text.secondary">Место проведения:</Typography>
                      <Typography variant="body1">
                        {booking.tour?.location || '—'}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    {!booking.paid && (
                      <Button 
                        variant="contained" 
                        color="primary"
                        startIcon={<Payment />}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        Оплатить
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Отменить бронирование
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedBooking && (
        <PaymentForm
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </Box>
  );
};

export default MyBookings; 