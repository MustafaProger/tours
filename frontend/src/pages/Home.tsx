import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import { Tour } from '../types/tour';

const Home = () => {
  const [popularTours, setPopularTours] = useState<Tour[]>([]);

  useEffect(() => {
    // In production, fetch from API
    const fetchPopularTours = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tours');
        const data = await response.json();
        // Take just the first 3 tours for display
        setPopularTours(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching popular tours:', error);
      }
    };

    fetchPopularTours();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.redd.it/3tryscspzon51.jpg" 
            alt="Scenic mountain landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="mb-4 text-shadow-lg text-white">
              Откройте для себя мир удивительных путешествий
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200 text-shadow">
              Уникальные маршруты, незабываемые впечатления и комфортный отдых с нашей туристической компанией
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/tours" className="btn btn-primary text-center">
                Найти тур
              </Link>
              <Link to="/about" className="btn btn-outline bg-white/10 backdrop-blur-sm text-white border-white/50 hover:bg-white/20 text-center">
                О компании
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Почему выбирают нас</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Мы предлагаем не просто туры, а целый мир впечатлений, созданный с заботой о каждой детали вашего путешествия
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-blue-50 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">15+ лет опыта</h3>
              <p className="text-gray-600">Мы помогаем путешественникам открывать мир с 2008 года</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Уникальные маршруты</h3>
              <p className="text-gray-600">Авторские программы путешествий по самым интересным местам</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Профессиональные гиды</h3>
              <p className="text-gray-600">Опытные гиды, влюбленные в свое дело и знающие все секреты</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Гибкие даты</h3>
              <p className="text-gray-600">Большой выбор дат для каждого тура и возможность индивидуального планирования</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Tours Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="mb-2">Популярные направления</h2>
              <p className="text-gray-600 max-w-2xl">
                Самые востребованные туры этого сезона
              </p>
            </div>
            <Link to="/tours" className="mt-4 md:mt-0 flex items-center text-blue-600 font-medium hover:text-blue-700">
              Все туры <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularTours.map((tour, index) => (
              <div key={index} className="card tour-card overflow-hidden">
                <div className="relative h-48">
                  <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-semibold">{tour.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4 line-clamp-2">{tour.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">{tour.price.toLocaleString('ru-RU')} ₽</span>
                    <Link 
                      to={`/tours/${tour._id}`}
                      className="btn btn-primary text-sm"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Отзывы наших клиентов</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Мы гордимся тем, что наши путешественники возвращаются к нам снова и снова
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center text-yellow-400 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-gray-700 mb-4">
                "Удивительное путешествие на Алтай! Все было организовано на высшем уровне, от транспорта до проживания. Гид Михаил - настоящий профессионал, знающий каждый уголок этих мест."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                  АК
                </div>
                <div>
                  <p className="font-medium">Анна Ковалева</p>
                  <p className="text-sm text-gray-500">Тур по Алтаю, июль 2023</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center text-yellow-400 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-gray-700 mb-4">
                "Второй раз путешествую с этой компанией и снова в восторге! В этот раз был тур по Байкалу - незабываемые виды, комфортное размещение и отличная компания единомышленников."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                  ИС
                </div>
                <div>
                  <p className="font-medium">Игорь Семенов</p>
                  <p className="text-sm text-gray-500">Байкал, август 2023</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center text-yellow-400 mb-4">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="text-gray-700 mb-4">
                "Поездка в горы Кавказа превзошла все ожидания! Прекрасные виды, интересная программа и внимательный персонал. Особенно понравилась кухня и уютные гостевые дома."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                  ЕН
                </div>
                <div>
                  <p className="font-medium">Елена Новикова</p>
                  <p className="text-sm text-gray-500">Кавказ, сентябрь 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1480497490787-505ec076689f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW4lMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D" 
            alt="Mountains landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-white mb-4">Готовы отправиться в путешествие?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Забронируйте тур прямо сейчас и получите скидку 10% на следующее путешествие
          </p>
          <Link to="/tours" className="btn btn-primary bg-white text-blue-700 hover:bg-gray-100">
            Выбрать тур
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;