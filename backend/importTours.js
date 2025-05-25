const mongoose = require("mongoose");
const Tour = require("./models/Tour");
const toursData = require("./data/tours.json");

mongoose.connect("mongodb://localhost:27017/tours", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function importData() {
	try {
		await Tour.deleteMany({});
		await Tour.insertMany(toursData);
		console.log("Data imported successfully");
		process.exit();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

importData();