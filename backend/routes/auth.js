const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/User");

const router = express.Router();

// Настройка nodemailer (пример с Gmail)
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "todzievdier@gmail.com",
		pass: "ussd jqwf vyed jzfs",
	},
});

// POST /api/register
router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Проверка на пустые поля
		if (!name || !email || !password) {
			return res.status(400).json({ message: "Все поля обязательны" });
		}

		// Проверяем, есть ли уже пользователь
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Пользователь с таким email уже существует" });
		}

		// Хэшируем пароль
		const hashedPassword = await bcrypt.hash(password, 10);

		// Генерируем код подтверждения (6 цифр)
		const confirmationCode = crypto.randomInt(100000, 999999).toString();

		// Создаем пользователя в базе
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			confirmationCode,
			isConfirmed: false,
		});

		await newUser.save();

		// Отправляем email с кодом
		const mailOptions = {
			from: "todzievdier@gmail.com",
			to: email,
			subject: "Код подтверждения регистрации",
			text: `Ваш код подтверждения: ${confirmationCode}`,
		};

		await transporter.sendMail(mailOptions);

		res
			.status(201)
			.json({ message: "Пользователь создан, код отправлен на email" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Ошибка регистрации" });
	}
});

// POST /api/confirm
router.post("/confirm", async (req, res) => {
	try {
		const { email, code } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден" });
		}

		if (user.isConfirmed) {
			return res.status(400).json({ message: "Пользователь уже подтвержден" });
		}

		if (user.confirmationCode !== code) {
			return res.status(400).json({ message: "Неверный код подтверждения" });
		}

		user.isConfirmed = true;
		user.confirmationCode = null; // очищаем код
		await user.save();

		res.json({ message: "Пользователь подтвержден" });
	} catch (error) {
		console.error("Ошибка регистрации:", error);
		console.error(error);
		res.status(500).json({ message: "Ошибка подтверждения" });
	}
});

module.exports = router;
