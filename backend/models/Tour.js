const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	date: {
		type: Date,
		required: true
	},
	time: {
		type: String,
		required: true
	},
	duration: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
	link: String,
	image: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	maxParticipants: {
		type: Number,
		required: true,
		default: 15
	},
	currentParticipants: {
		type: Number,
		default: 0
	},
	included: [{
		type: String,
		trim: true
	}],
	excluded: [{
		type: String,
		trim: true
	}],
	highlights: [{
		type: String,
		trim: true
	}],
	itinerary: [{
		day: Number,
		title: String,
		description: String,
		activities: [String]
	}],
	difficulty: {
		type: String,
		enum: ['легкий', 'средний', 'сложный'],
		default: 'средний'
	},
	rating: {
		type: Number,
		default: 0,
		min: 0,
		max: 5
	},
	reviews: [{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5
		},
		comment: {
			type: String,
			required: true,
			trim: true
		},
		date: {
			type: Date,
			default: Date.now
		}
	}],
	category: {
		type: String,
		enum: ['природа', 'история', 'приключения', 'культура', 'отдых'],
		required: true,
		default: 'природа'
	},
	languages: [{
		type: String,
		enum: ['русский', 'английский', 'китайский'],
		default: ['русский']
	}],
	meetingPoint: {
		type: String,
		required: true,
		default: 'Будет объявлено позже'
	},
	cancellationPolicy: {
		type: String,
		default: 'Бесплатная отмена за 24 часа до начала тура'
	}
}, {
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

// Виртуальное поле для проверки доступности мест
tourSchema.virtual('availableSpots').get(function() {
	return this.maxParticipants - this.currentParticipants;
});

// Виртуальное поле для проверки, доступен ли тур для бронирования
tourSchema.virtual('isAvailable').get(function() {
	return this.availableSpots > 0 && new Date(this.date) > new Date();
});

// Индексы для улучшения производительности поиска
tourSchema.index({ price: 1, rating: -1 });
tourSchema.index({ date: 1 });
tourSchema.index({ category: 1 });

module.exports = mongoose.model("Tour", tourSchema);
