var respond = require("../lib/respond");
//models
var Speaker = require("../models/Speaker"),
	Team = require("../models/Team"),
	TeamMember = require("../models/TeamMember"),
	Sponsor = require("../models/Sponsor");

module.exports = function (app) {
	//base API
	app.get('/api', function(req,res){
		res.json("Welcome to the TEDxAmherst API");
	});

	require('./watson.js')(app);

	//Team
	app.get('/api/team', function(req,res){
		Team.find({}, function(err, docs){
			return respond(res, err, docs);
		});
	});
	app.get('/api/team/:id', function(req,res){
		Team.find({"_id": req.params.id}, function(err, docs){
			return respond(res, err, docs);
		});
	});
	app.get('/api/team/:id/member', function(req,res){
		TeamMember.find({"team": req.params.id}, function(err, docs){
			return respond(res, err, docs);
		});
	});

	//TeamMembers
	app.get('/api/teammember', function(req,res){
		TeamMember.find({}, function(err, docs){
			return respond(res, err, docs);
		});
	});
	app.get('/api/teammember/:id', function(req,res){
		TeamMember.find({"_id": req.params.id}, function(err, docs){
			return respond(res, err, docs);
		});
	});

	//Speakers
	app.get('/api/speaker', function(req,res){
		Speaker.find({}, function(err, docs){
			return respond(res, err, docs);
		});
	});
	app.get('/api/speaker/:id', function(req,res){
		Speaker.find({"_id": req.params.id}, function(err, docs){
			return respond(res, err, docs);
		});
	});

	//Sponsors
	app.get('/api/sponsor', function(req,res){
		Sponsor.find({}, function(err, docs){
			return respond(res, err, docs);
		});
	});
	app.get('/api/sponsor/:id', function(req,res){
		Sponsor.find({"_id": req.params.id}, function(err, docs){
			return respond(res, err, docs);
		});
	});


	//Dev Create/Update Routes
	if ('development' == app.get('env')) {
		app.post('/api/team', function(req,res){
			var newTeam = new Team({name: req.body.name});
			newTeam.save(function(err){
				return respond(res, err);
			});
		});
		app.post('/api/teammember', function(req,res){
			var newTeamMember = new TeamMember({firstname: req.body.firstname, lastname: req.body.lastname});
			Team.findById(req.body.team, function (err, team) {
				if(err){
					return respond(res, err);
				}
				else {
					newTeamMember.team = team._id;
					newTeamMember.save(function(err){
						return respond(res, err);
					});
				}
			});
		});
		app.post('/api/speaker', function(req,res){
			var newSpeaker = new Speaker({
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				title: req.body.title,
				bio: req.body.title,
				bio_short: req.body.bio_short,
				year: req.body.year
			});
			newSpeaker.save(function(err){
				return respond(res, err);
			});
		});
		app.post('/api/sponsor', function(req,res){
			var newSponsor = new Sponsor({ //TODO: add logo upload 
				name: req.body.name,
				url: req.body.url
			});
			newSponsor.save(function(err){
				return respond(res, err);
			});
		});
	}

};