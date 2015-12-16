var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	title: {
		type: String, 
		default: ''
	},
	firstname: {
		type: String, 
		default: ''
	},
	lastname: {
		type: String, 
		default: '' 
	},
	occupation: {
		type: String,
		default: ''
	},
	bio: {
		type: String, 
		default: ''
	},
	bio_short: {
		type: String,
		default: ''
	},
	year: {
		type: String,
		default: '2015',
		validate: {
			validator: function(v) {
				return /^\d{4}$/.test(v);
			},
			message: '{VALUE} is not a valid year'
		}
	},
	image: {
		type: String,
		default: ''
	},
	youtube: {
		type: String, 
		default: ''
	}
});

module.exports = mongoose.model('Speaker', schema);