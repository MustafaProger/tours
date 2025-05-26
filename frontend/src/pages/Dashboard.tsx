import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Tour } from '../types/tour';
import { User, MapPin, Calendar, Trash2, Loader } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { Booking } from '../services/bookingService';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getMyBookings();
        setBookings(response.data);
        setError('');
      } catch (err) {
        setError('Не удалось загрузить бронирования');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    try {
      await bookingService.cancelBooking(id);
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (err) {
      setError('Не удалось отменить бронирование');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fade-in">
      {/* Dashboard Header */}
      <section className="bg-blue-700 py-12 pt-32">
        <div className="container-custom">
          <h1 className="text-white mb-2">Личный кабинет</h1>
          <p className="text-blue-100">Добро пожаловать, {user.name}!</p>
        </div>
      </section>
      
      {/* Dashboard Content */}
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="card p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <button 
                    className={`w-full text-left py-2 px-3 rounded-md mb-1 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <User size={18} className="inline mr-2" />
                    Профиль
                  </button>
                  <button 
                    className={`w-full text-left py-2 px-3 rounded-md mb-1 ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Calendar size={18} className="inline mr-2" />
                    Мои бронирования
                  </button>
                </div>
              </div>
              
              <div className="card p-6 bg-blue-50">
                <h3 className="text-lg font-medium mb-2">Нужна помощь?</h3>
                <p className="text-gray-600 mb-4">
                  Свяжитесь с нами, если у вас возникли вопросы по бронированию или вы хотите изменить детали вашего тура.
                </p>
                <a href="tel:+74951234567" className="text-blue-600 font-medium hover:text-blue-700">
                  +7 (495) 123-45-67
                </a>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              {activeTab === 'profile' && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-6">Личная информация</h2>
                  
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Имя
                        </label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Сохранить изменения
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Мои бронирования</h2>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader className="animate-spin mr-2 text-blue-600" size={24} />
                      <span>Загрузка бронирований...</span>
                    </div>
                  ) : error ? (
                    <div className="card p-8 text-center text-red-600">
                      <p>{error}</p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="card p-8 text-center">
                      <p className="text-gray-600 mb-4">У вас пока нет забронированных туров</p>
                      <a href="/tours" className="btn btn-primary inline-block">
                        Найти тур
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map(booking => (
                        <div key={booking._id} className="card p-4 md:p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/4">
                              <img 
                                src={booking.tour?.imageCover || booking.tour?.image || '/placeholder.jpg'} 
                                alt={booking.tour?.title || 'Изображение тура'} 
                                className="w-full h-32 object-cover rounded-md" 
                              />
                            </div>
                            <div className="md:w-3/4">
                              <div className="flex flex-col md:flex-row justify-between mb-4">
                                <h3 className="text-lg font-semibold">{booking.tour?.title || 'Без названия'}</h3>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  booking.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {booking.paid ? 'Оплачено' : 'Ожидает оплаты'}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-500">Дата бронирования:</p>
                                  <p className="font-medium">
                                    {new Date(booking.createdAt).toLocaleDateString('ru-RU')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Стоимость:</p>
                                  <p className="font-medium">{booking.price?.toLocaleString('ru-RU') || '0'} ₽</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Дата тура:</p>
                                  <p className="font-medium">
                                    {booking.tour?.date ? new Date(booking.tour.date).toLocaleDateString('ru-RU') : '—'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Место проведения:</p>
                                  <p className="font-medium">{booking.tour?.location || '—'}</p>
                                </div>
                              </div>
                              <div className="flex justify-end space-x-3">
                                {!booking.paid && (
                                  <button className="btn btn-primary">
                                    Оплатить
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleCancelBooking(booking._id)}
                                  className="btn btn-outline-danger flex items-center"
                                >
                                  <Trash2 size={16} className="mr-1" />
                                  Отменить
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;