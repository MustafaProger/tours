const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	name: String,
	email: { type: String, unique: true },
	passwordHash: String,
	confirmationCode: String,
	isConfirmed: { type: Boolean, default: false },
});

userSchema.methods.setPassword = async function (password) {
	this.passwordHash = await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = async function (password) {
	return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
