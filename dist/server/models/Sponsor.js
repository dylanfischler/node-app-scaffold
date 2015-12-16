var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {
		type: String, 
		default: ''
	},
	url: {
		type: String, 
		default: '' 
	},
	logo: {
		data: Buffer, 
		contentType: String
	}
});

module.exports = mongoose.model('Sponsor', schema);