import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, DollarSign, Camera, Utensils, Home, Check, Loader, Star } from 'lucide-react';
import { Tour } from '../types/tour';
import { toursApi } from '../services/api';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const TourDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          if (id) {
            const data = await toursApi.getTourById(id);
            setTour(data);
            setSelectedDate(data.date);
          }
        } catch (apiError) {
          console.error('API error, falling back to local data:', apiError);
          
          // Fallback to local data if API fails
          const response = await fetch('/data/tours.json');
          if (!response.ok) {
            throw new Error('Не удалось загрузить данные');
          }
          
          const data = await response.json();
          // Find the tour matching the ID from the URL
          const foundTour = data.find((t: Tour) => t.link.split('/').pop() === id);
          
          if (foundTour) {
            setTour(foundTour);
            setSelectedDate(foundTour.date);
          } else {
            setError('Тур не найден');
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
        setLoading(false);
      }
    };
    
    fetchTour();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      window.location.href = `/login?redirect=/tours/${id}`;
      return;
    }
    
    // In a real app, this would call the booking API
    // For demo purposes, we'll just simulate a successful booking
    setBookingSubmitted(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setBookingSubmitted(false);
    }, 5000);
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

  const totalPrice = tour.price * quantity;

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
            <h1 className="text-shadow-lg mb-4">{tour.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm md:text-base">
              <div className="flex items-center">
                <Calendar size={20} className="mr-2 text-blue-300" />
                <span>{new Date(tour.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <Clock size={20} className="mr-2 text-blue-300" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={20} className="mr-2 text-blue-300" />
                <span>{tour.location || 'Россия'}</span>
              </div>
              <div className="flex items-center">
                <DollarSign size={20} className="mr-2 text-blue-300" />
                <span>{tour.price.toLocaleString('ru-RU')} ₽ / человека</span>
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
                <p className="text-gray-700">
                  Вас ждет увлекательное путешествие, полное ярких впечатлений и новых открытий. 
                  Вы увидите красивейшие природные ландшафты, познакомитесь с местной культурой и традициями. 
                  Профессиональные гиды расскажут вам все самое интересное об этих удивительных местах.
                </p>

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
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-semibold mb-4">Программа тура</h2>
                <div className="space-y-6">
                  {tour.itinerary ? (
                    tour.itinerary.map((day, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-medium mb-2">День {day.day}: {day.title}</h3>
                        <p className="text-gray-700">{day.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-medium mb-2">День 1: Прибытие и знакомство</h3>
                        <p className="text-gray-700">
                          Встреча в аэропорту, трансфер до отеля. Размещение, отдых. 
                          Вечером - приветственный ужин и знакомство с программой тура.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">День 2-3: Исследование окрестностей</h3>
                        <p className="text-gray-700">
                          Экскурсии по основным достопримечательностям региона. 
                          Посещение живописных мест, подъем на смотровые площадки, фотосессия.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">День 4-5: Погружение в культуру</h3>
                        <p className="text-gray-700">
                          Знакомство с местными традициями, кухней и ремеслами. 
                          Посещение мастер-классов, дегустация национальных блюд.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">День 6-7: Активный отдых</h3>
                        <p className="text-gray-700">
                          Пешие прогулки по живописным маршрутам, возможность попробовать различные 
                          активности на свежем воздухе. Прощальный ужин и подведение итогов путешествия.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-semibold mb-4">Что включено</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Home className="mr-2 text-blue-500" size={20} />
                      Проживание
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Комфортные отели 3-4*</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Двухместное размещение</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Все удобства в номере</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Utensils className="mr-2 text-blue-500" size={20} />
                      Питание
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Завтраки в отеле</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Приветственный и прощальный ужины</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Обеды во время экскурсий</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Users className="mr-2 text-blue-500" size={20} />
                      Сопровождение
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Профессиональный гид</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Групповой трансфер</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Медицинская страховка</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Camera className="mr-2 text-blue-500" size={20} />
                      Активности
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Все экскурсии по программе</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Входные билеты</span>
                      </li>
                      <li className="flex items-start">
                        <Check size={16} className="mr-2 text-green-500 mt-1" />
                        <span>Мастер-классы</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {tour.reviews && tour.reviews.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="card p-6"
                >
                  <h2 className="text-2xl font-semibold mb-4">Отзывы</h2>
                  <div className="space-y-4">
                    {tour.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={16} 
                                fill={i < review.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.user}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(review.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Booking Form */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold mb-4">Забронировать тур</h2>
                
                {bookingSubmitted ? (
                  <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4">
                    <p className="font-medium mb-2">Бронирование отправлено!</p>
                    <p className="text-sm">Мы свяжемся с вами в ближайшее время для подтверждения деталей.</p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleBooking}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Количество человек
                      </label>
                      <select 
                        value={quantity} 
                        onChange={handleQuantityChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'человек' : num >= 2 && num <= 4 ? 'человека' : 'человек'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата начала
                      </label>
                      <input 
                        type="date" 
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Стоимость за 1 человека</span>
                        <span className="font-medium">{tour.price.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Количество человек</span>
                        <span className="font-medium">{quantity}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold mt-2 pt-2 border-t border-gray-200">
                        <span>Итого</span>
                        <span className="text-blue-700">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full btn btn-primary text-center"
                    >
                      {isAuthenticated ? 'Забронировать' : 'Войти и забронировать'}
                    </button>
                    
                    <p className="text-sm text-gray-500 text-center">
                      Бронирование без предоплаты. Оплата производится после подтверждения заявки.
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Tours Section */}
      <section className="bg-gray-50 py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-semibold mb-8">Похожие туры</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="card tour-card"
            >
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg" 
                  alt="Алтай" 
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Алтайские горы</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Путешествие по живописным местам Алтайского края
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">42 000 ₽</span>
                  <Link to="/tours/altai" className="text-blue-600 font-medium text-sm hover:text-blue-700">
                    Подробнее
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="card tour-card"
            >
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg" 
                  alt="Байкал" 
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Озеро Байкал</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Незабываемое путешествие к самому глубокому озеру планеты
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">49 000 ₽</span>
                  <Link to="/tours/baikal" className="text-blue-600 font-medium text-sm hover:text-blue-700">
                    Подробнее
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="card tour-card"
            >
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg" 
                  alt="Золотое кольцо" 
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Золотое кольцо</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Культурно-исторический тур по древним городам России
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">38 000 ₽</span>
                  <Link to="/tours/golden-ring" className="text-blue-600 font-medium text-sm hover:text-blue-700">
                    Подробнее
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default TourDetails;