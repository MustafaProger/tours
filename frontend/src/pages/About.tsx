import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Phone, Mail, Clock, Award, ThumbsUp } from 'lucide-react';

const About = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-blue-700">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg" 
            alt="About us hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-white mb-4">О нашей компании</h1>
            <p className="text-blue-100 text-lg">
              Мы создаем незабываемые путешествия с 2008 года, помогая тысячам туристов открывать для себя удивительные места России и мира
            </p>
          </div>
        </div>
      </section>
      
      {/* Company History */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6">Наша история</h2>
              <p className="text-gray-700 mb-4">
                История компании «ТурПро» началась в 2008 году, когда группа энтузиастов-путешественников решила превратить свою страсть к исследованию мира в профессию. Изначально небольшое турагентство с тремя сотрудниками, сегодня мы выросли в крупную туристическую компанию с офисами в нескольких городах России.
              </p>
              <p className="text-gray-700 mb-4">
                Мы начинали с организации небольших групповых туров по Золотому кольцу, но постепенно расширяли географию своих маршрутов. К 2015 году мы уже предлагали широкий спектр внутренних туров по всей России – от Калининграда до Камчатки.
              </p>
              <p className="text-gray-700">
                Сегодня «ТурПро» – это признанный эксперт в области внутреннего туризма, компания с безупречной репутацией и тысячами довольных клиентов, которые возвращаются к нам снова и снова.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-xl overflow-hidden shadow-xl"
            >
              <img 
                src="https://images.pexels.com/photos/5764100/pexels-photo-5764100.jpeg" 
                alt="Our team" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Mission & Values */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Наша миссия и ценности</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Мы стремимся не просто организовывать поездки, а создавать уникальные путешествия, 
              которые расширяют кругозор, дарят яркие эмоции и остаются в памяти на долгие годы
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Award className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Качество</h3>
              <p className="text-gray-600">
                Мы не идем на компромиссы, когда речь идет о качестве наших услуг. Тщательно подбираем партнеров, 
                отели и транспортные компании, чтобы обеспечить максимальный комфорт нашим клиентам.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ThumbsUp className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Надежность</h3>
              <p className="text-gray-600">
                Клиенты доверяют нам самое ценное – свое время и впечатления. Мы дорожим этим доверием 
                и делаем все возможное, чтобы оправдать и превзойти ожидания каждого путешественника.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Индивидуальный подход</h3>
              <p className="text-gray-600">
                Мы понимаем, что каждый путешественник уникален. Поэтому предлагаем гибкие 
                программы туров и всегда готовы адаптировать маршрут под пожелания конкретного клиента.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Наша команда</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              За каждым успешным путешествием стоит команда профессионалов, влюбленных в свое дело
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                <img 
                  src="https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg" 
                  alt="Анна Смирнова" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Анна Смирнова</h3>
              <p className="text-blue-600 mb-2">Генеральный директор</p>
              <p className="text-gray-600 text-sm">
                Основатель компании с более чем 15-летним опытом в туристической индустрии
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" 
                  alt="Михаил Петров" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Михаил Петров</h3>
              <p className="text-blue-600 mb-2">Руководитель направления</p>
              <p className="text-gray-600 text-sm">
                Эксперт по внутреннему туризму и активному отдыху в России
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" 
                  alt="Елена Иванова" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Елена Иванова</h3>
              <p className="text-blue-600 mb-2">Главный менеджер</p>
              <p className="text-gray-600 text-sm">
                Специалист по VIP-турам и индивидуальным маршрутам
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                <img 
                  src="https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg" 
                  alt="Алексей Козлов" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Алексей Козлов</h3>
              <p className="text-blue-600 mb-2">Ведущий гид</p>
              <p className="text-gray-600 text-sm">
                Профессиональный гид с опытом работы более 10 лет
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Contact Info */}
      <section className="section bg-blue-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Свяжитесь с нами</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Наши менеджеры всегда готовы ответить на ваши вопросы и помочь с выбором подходящего тура
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <MapPin className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Адрес</h3>
                      <p className="text-gray-600">г. Москва, ул. Туристическая, д. 123</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Phone className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Телефон</h3>
                      <p className="text-gray-600">+7 (495) 123-45-67</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Mail className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">info@tourpro.ru</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <Clock className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Часы работы</h3>
                      <p className="text-gray-600">Пн-Пт: 9:00 - 20:00</p>
                      <p className="text-gray-600">Сб: 10:00 - 18:00</p>
                      <p className="text-gray-600">Вс: выходной</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-6">Напишите нам</h3>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ваше имя
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="ivan@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Сообщение
                    </label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                      placeholder="Ваш вопрос или комментарий..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full"
                  >
                    Отправить
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;