const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  guests: { type: Number, default: 1 },
  paid: { type: Boolean, default: false },
  cancelled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Индексы для улучшения производительности
bookingSchema.index({ user: 1, tour: 1 });
bookingSchema.index({ date: 1 });

module.exports = mongoose.model("Booking", bookingSchema);