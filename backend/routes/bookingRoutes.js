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
    console.log('DEBUG: Getting bookings for user:', {
      userId: req.user.id,
      userObject: req.user
    });
    
    // Сначала проверим, есть ли вообще бронирования без фильтров
    const allBookings = await Booking.find({
      user: req.user.id
    });
    
    console.log('DEBUG: All bookings before filtering:', {
      count: allBookings.length,
      bookings: allBookings.map(b => ({
        _id: b._id,
        paid: b.paid,
        cancelled: b.cancelled,
        userId: b.user
      }))
    });

    // Теперь делаем основной запрос с фильтрами
    const bookings = await Booking.find({ 
      user: req.user.id,
      cancelled: { $ne: true }
    })
    .populate({
      path: 'tour',
      select: 'title name price image imageCover date duration location description'
    })
    .sort({ createdAt: -1 });

    console.log('DEBUG: Filtered bookings:', {
      count: bookings.length,
      bookings: bookings.map(b => ({
        _id: b._id,
        paid: b.paid,
        cancelled: b.cancelled,
        tourId: b.tour?._id,
        tourTitle: b.tour?.title
      }))
    });

    // Подготовка ответа
    const responseData = bookings;

    console.log('DEBUG: Response data:', {
      count: responseData.length,
      paidCount: responseData.filter(b => b.paid === true).length,
      unpaidCount: responseData.filter(b => b.paid === false).length,
      firstBooking: responseData[0] ? {
        _id: responseData[0]._id,
        paid: responseData[0].paid,
        tourTitle: responseData[0].tour?.title
      } : null
    });

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: responseData
    });
  } catch (error) {
    console.error('DEBUG: Error in /my-bookings:', error);
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
    console.log('Payment request received for booking:', req.params.id);
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      cancelled: { $ne: true }
    }).populate({
      path: 'tour',
      select: 'title name price image imageCover date duration location description'
    });

    if (!booking) {
      console.log('PAYMENT DEBUG: Booking not found', {
        bookingId: req.params.id,
        userFromToken: req.user.id
      });
      return res.status(404).json({
        status: 'error',
        error: 'Бронирование не найдено'
      });
    }

    // Корректное сравнение user
    const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
    console.log('PAYMENT DEBUG: Access check', {
      bookingId: req.params.id,
      userFromToken: req.user.id,
      bookingFound: !!booking,
      bookingUser: booking.user,
      bookingUserId,
      currentPaidStatus: booking.paid
    });

    if (bookingUserId !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        error: 'Нет доступа к этому бронированию'
      });
    }

    // Устанавливаем статус оплаты
    booking.paid = true;
    console.log('PAYMENT DEBUG: Setting paid status to true');
    
    const savedBooking = await booking.save();
    console.log('PAYMENT DEBUG: Booking saved with new paid status:', savedBooking.paid);

    res.status(200).json({
      status: 'success',
      data: savedBooking
    });
  } catch (error) {
    console.error('PAYMENT ERROR:', error);
    res.status(400).json({
      status: 'error',
      error: error.message
    });
  }
});

module.exports = router; 