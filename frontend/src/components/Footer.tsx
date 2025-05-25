import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">ТурПро</h3>
            <p className="text-gray-400 mb-4">
              Мы помогаем нашим клиентам исследовать мир уже более 15 лет, 
              предлагая незабываемые путешествия и профессиональное сопровождение.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-gray-400 hover:text-white transition-colors">
                  Туры
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Tours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Популярные туры</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tours/kavkaz" className="text-gray-400 hover:text-white transition-colors">
                  Горы Кавказа
                </Link>
              </li>
              <li>
                <Link to="/tours/baikal" className="text-gray-400 hover:text-white transition-colors">
                  Байкал
                </Link>
              </li>
              <li>
                <Link to="/tours/altai" className="text-gray-400 hover:text-white transition-colors">
                  Алтай
                </Link>
              </li>
              <li>
                <Link to="/tours/golden-ring" className="text-gray-400 hover:text-white transition-colors">
                  Золотое кольцо
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">г. Москва, ул. Туристическая, д. 123</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">+7 (495) 123-45-67</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">info@tourpro.ru</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} ТурПро. Все права защищены.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-500 hover:text-white text-sm">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-white text-sm">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;