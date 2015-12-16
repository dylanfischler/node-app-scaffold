var Model = require("../models/Model");

module.exports = function (app) {
	//base API
	app.get('/api', function(req,res){
		res.json("Welcome to the API");
	});

	if ('development' == app.get('env')) {
		
	}

};