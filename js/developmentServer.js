var serve = require('serve-static')('.');
var fs = require('fs');

var PORT = 8000;

require('http').createServer(function (req, res) {

	if (req.url.indexOf('/savegame.php?') === 0) {

		return save(req, res);

	} else if (req.url.indexOf('/loadgame.php?') === 0) {

		return load(req, res);

	}

	serve(req, res, function (err) {

		res.statusCode = err ? (err.statusCode || err.status) : 404;
		res.end(err ? err.toString() : 'Cannot ' + req.method + ' ' + req.url + '\n');

	});

}).listen(PORT);


var s4 = function () {

	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

};


var save = function (req, res) {

	var obj = {};
	var params = req.url.split('?')[1].split('&');

	for (var param in params) {

		param = params[param].split('=');
		
		var paramName = param[0];
		
		if (paramName === 'level') {
			obj.level = param[1];
		} else if (paramName === 'exp') {
			obj.experience = param[1];
		} else if (paramName === 'exp_tnl') {
			obj.experience_tnl = param[1];
		} else if (paramName === 'health') {
			obj.health = param[1];
		} else if (paramName == 'max_health') {
			obj.max_health = param[1];	
		} else if (paramName === 'strength') {
			obj.strength = param[1];
		} else if (paramName === 'dex') {
			obj.dexterity = param[1];
		} else if (paramName === 'intellect') {
			obj.intellect = param[1];
		} else if (paramName === 'statpoints') {
			obj.stat_points = param[1];
		} else if (paramName === 'maxstatpoints') {
			obj.max_stat_points = param[1];
		}

	}

	var UUID = s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();

	fs.writeFile(UUID, JSON.stringify(obj), function (err) {

		if (err) return console.log(err);
		console.log('Saved ' + UUID);
		res.setHeader('Content-Type', 'text/plain');
		res.end(UUID);

	});

};



var load = function (req, res) {

	var UUID = req.url.split('=')[1];

	fs.readFile(UUID, { encoding: 'utf-8' }, function (err, data) {
		
		if (!err) {
			
			console.log('Loaded ' + UUID);
			
			data = JSON.parse(data);
			
			data.level = parseInt(data.level, 10);
			data.health = parseInt(data.health, 10);
			data.experience = parseInt(data.experience, 10);
			data.experience_tnl = parseInt(data.experience_tnl, 10);
			data.strength = parseInt(data.strength, 10);
			data.dexterity = parseInt(data.dexterity, 10);
			data.intellect = parseInt(data.intellect, 10);
			data.stat_points = parseInt(data.stat_points, 10);
			data.max_stat_points = parseInt(data.max_stat_points, 10);
			data.health = parseInt(data.health, 10);
			
			data.userID = UUID;
			
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(data));
			
		} else {
			
			console.log(err);
			res.setHeader('Content-Type', 'text/plain');
			res.end(UUID);
			
		}

	});

};

console.log('Develoment instance running at http://localhost:' + PORT + '/');
