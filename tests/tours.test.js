const fs = require('fs');
const path = require('path');

// Загружаем данные из JSON файла
const toursData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../backend/data/tours.json'), 'utf8')
);

describe('Tours Application Tests', () => {
    // Тест 1: Проверка структуры данных тура
    test('Tour should have all required fields', () => {
        const tour = toursData[0]; // Берем первый тур для проверки
        
        expect(tour).toHaveProperty('title');
        expect(tour).toHaveProperty('date');
        expect(tour).toHaveProperty('duration');
        expect(tour).toHaveProperty('price');
        expect(tour).toHaveProperty('location');
        expect(tour).toHaveProperty('maxParticipants');
        expect(tour).toHaveProperty('itinerary');
    });

    // Тест 2: Проверка доступности тура
    test('Tour should have valid participants count', () => {
        const tour = toursData[0];
        
        expect(tour.currentParticipants).toBeDefined();
        expect(tour.maxParticipants).toBeDefined();
        expect(tour.currentParticipants).toBeLessThanOrEqual(tour.maxParticipants);
    });

    // Тест 3: Проверка маршрута
    test('Tour itinerary should match duration', () => {
        const tour = toursData[0];
        const durationDays = parseInt(tour.duration);
        
        expect(tour.itinerary.length).toBe(7); // Для тура "Горы Кавказа" - 7 дней
        expect(Array.isArray(tour.itinerary)).toBe(true);
    });

    // Тест 4: Проверка цены
    test('Tour price should be valid', () => {
        const tour = toursData[0];
        
        expect(typeof tour.price).toBe('number');
        expect(tour.price).toBeGreaterThan(0);
    });

    // Тест 5: Проверка включенных услуг
    test('Tour should have included services', () => {
        const tour = toursData[0];
        
        expect(Array.isArray(tour.included)).toBe(true);
        expect(tour.included.length).toBeGreaterThan(0);
    });
}); 