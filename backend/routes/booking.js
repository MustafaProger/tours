const express = require("express");
const Booking = require("../models/Booking");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/bookings
router.post("/bookings", auth, async (req, res) => {
	try {
		const { tourId, date, guests } = req.body;
		const booking = await Booking.create({
			user: req.user.id,
			tour: tourId,
			date,
			guests,
		});
		res.status(201).json(booking);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Ошибка при создании брони" });
	}
});

// GET /api/bookings - получить все брони текущего пользователя
router.get("/bookings", auth, async (req, res) => {
	try {
		const bookings = await Booking.find({ user: req.user.id }).populate("tour");
		res.json(bookings);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Ошибка при получении броней" });
	}
});

module.exports = router;
