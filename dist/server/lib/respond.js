module.exports = function(res, err, docs){
	var response = {};

	if(err){
		response.error = err;
	}
	else {
		response.data = docs;
	}

	response.api =  {
		"version": "0.1"
	};

	return res.json(response);
};