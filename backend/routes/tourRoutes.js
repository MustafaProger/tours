const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

// Получить все туры
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить тур по ID
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Тур не найден' });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создать новый тур (для админов)
router.post('/', async (req, res) => {
  const tour = new Tour({
    title: req.body.title,
    date: req.body.date,
    time: req.body.time,
    duration: req.body.duration,
    price: req.body.price,
    desc: req.body.desc,
    link: req.body.link,
    image: req.body.image,
    location: req.body.location,
    maxParticipants: req.body.maxParticipants,
    included: req.body.included,
    excluded: req.body.excluded,
    highlights: req.body.highlights,
    itinerary: req.body.itinerary
  });

  try {
    const newTour = await tour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 