const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Tour = require("./models/Tour");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Тестовый маршрут
app.get("/", (req, res) => {
	res.send("API работает!");
});

// Основной маршрут с турами
app.get("/api/tours", async (req, res) => {
	try {
		const tours = await Tour.find();
		res.json(tours);
	} catch (error) {
		res.status(500).json({ error: "Ошибка при получении туров" });
	}
});

mongoose
	.connect("mongodb://localhost:27017/tours")
	.then(() => {
		console.log("MongoDB подключена");
		app.listen(PORT, () => {
			console.log(`Сервер запущен на порту ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Ошибка подключения к MongoDB:", err);
	});