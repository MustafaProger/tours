const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// Создать новое бронирование
router.post('/', protect, async (req, res) => {
  try {
    const { tourId } = req.body;

    // Найти тур
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ 
        status: 'fail',
        message: 'Тур не найден' 
      });
    }

    // Проверить, нет ли уже бронирования
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      tour: tourId,
      // Добавляем проверку, что бронирование не отменено
      cancelled: { $ne: true }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'Вы уже забронировали этот тур',
        booking: existingBooking
      });
    }

    // Проверить доступность мест
    if (tour.currentParticipants >= tour.maxParticipants) {
      return res.status(400).json({
        status: 'fail',
        message: 'К сожалению, все места на этот тур уже заняты'
      });
    }

    // Создать бронирование
    const booking = await Booking.create({
      tour: tourId,
      user: req.user.id,
      date: tour.date,
      price: tour.price
    });

    // Увеличить количество участников
    await Tour.findByIdAndUpdate(tourId, {
      $inc: { currentParticipants: 1 }
    });

    // Получить полные данные бронирования с информацией о туре
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'tour',
        select: 'title name price image imageCover date duration location description'
      });

    res.status(201).json({
      status: 'success',
      data: populatedBooking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

// Получить все бронирования пользователя
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      user: req.user.id,
      cancelled: { $ne: true },
      paid: false
    })
    .populate({
      path: 'tour',
      select: 'title name price image imageCover date duration location description'
    })
    .sort({ createdAt: -1 }); // Сортировка по дате создания (новые первыми)

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

// Отменить бронирование
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Бронирование не найдено'
      });
    }

    // Уменьшить количество участников в туре
    await Tour.findByIdAndUpdate(booking.tour, {
      $inc: { currentParticipants: -1 }
    });

    // Помечаем бронирование как отмененное вместо удаления
    booking.cancelled = true;
    await booking.save();

    res.status(200).json({
      status: 'success',
      message: 'Бронирование успешно отменено'
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

// Оплатить бронирование
router.post('/:id/pay', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      cancelled: { $ne: true }
    }).populate({
      path: 'tour',
      select: 'title name price image imageCover date duration location description'
    });

    if (!booking) {
      console.log('PAYMENT DEBUG:', {
        bookingId: req.params.id,
        userFromToken: req.user.id,
        bookingFound: !!booking,
        bookingUser: null,
        bookingUserId: null
      });
      return res.status(404).json({
        status: 'error',
        error: 'Бронирование не найдено'
      });
    }

    // Корректное сравнение user
    const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
    console.log('PAYMENT DEBUG:', {
      bookingId: req.params.id,
      userFromToken: req.user.id,
      bookingFound: !!booking,
      bookingUser: booking.user,
      bookingUserId
    });
    if (bookingUserId !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        error: 'Нет доступа к этому бронированию'
      });
    }

    // Здесь можно добавить интеграцию с реальной платежной системой
    booking.paid = true;
    await booking.save();

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error: error.message
    });
  }
});

module.exports = router; 