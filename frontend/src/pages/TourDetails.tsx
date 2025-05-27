import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, DollarSign, Camera, Utensils, Home, Check, Loader, Star } from 'lucide-react';
import { Tour } from '../types/tour';
import { toursApi } from '../services/api';
import { bookingService } from '../services/bookingService';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const TourDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [hasBooking, setHasBooking] = useState(false);
  const [hasAlreadyPurchased, setHasAlreadyPurchased] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) {
        setError('Некорректный id тура');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await toursApi.getTourById(id);
        setTour(data);
        setError(null);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  useEffect(() => {
    const checkBooking = async () => {
      if (!id || !isAuthenticated) return;
      try {
        const bookings = await bookingService.getMyBookings();
        const hasUnpaidBooking = bookings.some(b => b.tour?._id === id && !b.paid);
        const hasAlreadyPurchased = bookings.some(b => b.tour?._id === id && b.paid);
        setHasBooking(hasUnpaidBooking);
        setHasAlreadyPurchased(hasAlreadyPurchased);
      } catch (e) {
        setHasBooking(false);
        setHasAlreadyPurchased(false);
      }
    };
    checkBooking();
  }, [id, isAuthenticated]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/tours/${id}`);
      return;
    }
    try {
      setIsBooking(true);
      await bookingService.createBooking(id!);
      alert('Тур успешно забронирован!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Ошибка при бронировании');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader className="animate-spin mr-2 text-blue-600" size={24} />
        <span>Загрузка информации о туре...</span>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="container-custom py-32">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Ошибка при загрузке тура</p>
          <p className="text-sm">{error || 'Тур не найден'}</p>
          <div className="mt-4">
            <Link to="/tours" className="text-blue-600 hover:underline">
              Вернуться к списку туров
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fade-in"
    >
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <div className="absolute inset-0">
          <img 
            src={tour.image} 
            alt={tour.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="container-custom relative z-10 h-full flex flex-col justify-end pb-16"
        >
          <div className="text-white max-w-3xl">
            <h1 className="text-shadow-lg mb-4 text-white">{tour.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm md:text-base">
              <div className="flex items-center">
                <Calendar size={20} className="mr-2 text-blue-300" />
                <span>{new Date(tour.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <Clock size={20} className="mr-2 text-blue-300" />
                <span>{tour.duration}</span>
              </div>
              {tour.location && (
                <div className="flex items-center">
                  <MapPin size={20} className="mr-2 text-blue-300" />
                  <span>{tour.location}</span>
                </div>
              )}
              <div className="flex items-center">
                <DollarSign size={20} className="mr-2 text-blue-300" />
                <span>{tour.price.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Content Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tour Details */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-semibold mb-4">Описание тура</h2>
                <p className="text-gray-700 mb-6">{tour.desc}</p>

                {tour.highlights && tour.highlights.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-medium mb-3">Основные моменты:</h3>
                    <ul className="space-y-2">
                      {tour.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <Check size={16} className="mr-2 text-green-500 mt-1" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>

              {tour.itinerary && tour.itinerary.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="card p-6"
                >
                  <h2 className="text-2xl font-semibold mb-6">Программа тура</h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((day, index) => (
                      <div key={index} className="border-l-2 border-blue-500 pl-4">
                        <h3 className="text-lg font-medium mb-2">День {day.day}: {day.title}</h3>
                        <p className="text-gray-700">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card p-6 sticky top-24"
              >
                <h3 className="text-xl font-semibold mb-4">Забронировать тур</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-1">Стоимость:</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {tour.price.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>

                  {tour.maxParticipants && (
                    <div>
                      <p className="text-gray-600 mb-1">Осталось мест:</p>
                      <div className="flex items-center text-green-600">
                        <Users size={20} className="mr-2" />
                        <span>{tour.maxParticipants}</span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleBooking}
                    disabled={isBooking || hasBooking || hasAlreadyPurchased}
                    className={`btn btn-primary w-full ${(isBooking || hasBooking || hasAlreadyPurchased) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {hasAlreadyPurchased 
                      ? 'Тур уже куплен' 
                      : hasBooking 
                        ? 'Забронировано' 
                        : isBooking 
                          ? 'Бронирование...' 
                          : 'Забронировать'
                    }
                  </button>

                  {!isAuthenticated && (
                    <p className="text-sm text-gray-500 text-center">
                      Необходимо <Link to={`/login?redirect=/tours/${id}`} className="text-blue-600 hover:underline">войти</Link> для бронирования
                    </p>
                  )}

                  {hasAlreadyPurchased && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded text-center">
                      <Check size={16} className="inline mr-1" />
                      Этот тур уже куплен. Вы можете посмотреть его в <Link to="/dashboard" className="underline">личном кабинете</Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default TourDetails;