const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
	title: String,
	date: Date,
	time: String,
	duration: String,
	price: Number,
	desc: String,
	link: String,
	image: String,
});

module.exports = mongoose.model("Tour", tourSchema);
