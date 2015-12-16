var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	team: mongoose.Schema.Types.ObjectId,
	firstname: {
		type: String, 
		default: ''
	},
	lastname: {
		type: String, 
		default: '' 
	},
	email: {
		type: String, 
		default: ''
	},
	school: {
		type: String,
		enum: ['UMass', 'Hampshire', 'Smith', 'MHC'],
		default: 'UMass'
	},
	image: {
		type: String,
		default: ''
	}
});

module.exports = mongoose.model('TeamMember', schema);