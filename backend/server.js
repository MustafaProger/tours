require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Tour = require("./models/Tour");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookingRoutes");
const tourRoutes = require("./routes/tourRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tours";

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tours", tourRoutes);

app.get("/", (req, res) => {
	res.send("API работает!");
});

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MongoDB подключена");
		app.listen(PORT, () => {
			console.log(`Сервер запущен на порту ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Ошибка подключения к MongoDB:", err);
	});
