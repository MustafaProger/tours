const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Нет токена" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // { id, email }
		next();
	} catch (error) {
		res.status(401).json({ message: "Неверный токен" });
	}
};

module.exports = { protect };
