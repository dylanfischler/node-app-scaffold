var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {
		type: String, 
		default: ''
	}
});

module.exports = mongoose.model('Model', schema);