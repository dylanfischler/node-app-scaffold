var watson = require('watson-developer-cloud');

var concept_insights = watson.concept_insights({
  username: '3b3b8bc1-522d-48a9-9be9-0f0f82e3b47c',
  password: 'mRCTfO2GHlou',
  version: 'v2'
});


module.exports = function (app) {
  app.get('/api/watson', function(req,res){
  	res.json("Watson API Access");
  });
  
  app.get('/api/watson/concept_insights/text/:text', function(req,res){

  	var params = {
  	  graph: '/graphs/wikipedia/en-20120601',
  	  text: req.params.text || ""
  	};

  	// Retrieve the concepts for input text
  	concept_insights.graphs.annotateText(params, function(err, resp) {
  	  if (err)
  	    res.json(err);
  	  else {
  	    res.json(resp);
  	  }
  	});
  });
};