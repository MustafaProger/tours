const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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

		if (!name || !email || !password) {
			return res.status(400).json({ message: "Все поля обязательны" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Пользователь с таким email уже существует" });
		}

		const user = new User({ name, email, isConfirmed: false });
		await user.setPassword(password);
		user.confirmationCode = crypto.randomInt(100000, 999999).toString();

		await user.save();

		const mailOptions = {
			from: "todzievdier@gmail.com",
			to: email,
			subject: "Код подтверждения регистрации",
			text: `Ваш код подтверждения: ${user.confirmationCode}`,
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
		user.confirmationCode = null;
		await user.save();

		res.json({ message: "Пользователь подтвержден" });
	} catch (error) {
		console.error("Ошибка регистрации:", error);
		res.status(500).json({ message: "Ошибка подтверждения" });
	}
});

// POST /api/login
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email и пароль обязательны" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: "Неверный email или пароль" });
		}

		const validPassword = await user.validatePassword(password);
		if (!validPassword) {
			return res.status(401).json({ message: "Неверный email или пароль" });
		}

		if (!user.isConfirmed) {
			return res.status(403).json({ message: "Пользователь не подтвержден" });
		}

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		res.json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Ошибка при входе" });
	}
});

module.exports = router;
