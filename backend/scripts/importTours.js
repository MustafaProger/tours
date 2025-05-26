require('dotenv').config();
const mongoose = require('mongoose');
const Tour = require('../models/Tour');
const tours = require('../data/tours.json');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tours";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    importTours();
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

async function importTours() {
    try {
        // Очистка существующих туров
        await Tour.deleteMany({});
        console.log('Existing tours deleted');

        // Добавление новых туров
        const importedTours = await Tour.insertMany(tours);
        console.log(`Successfully imported ${importedTours.length} tours`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error importing tours:', error);
        process.exit(1);
    }
} 