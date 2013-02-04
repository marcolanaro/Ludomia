var Middleware = require('./routing/middleware');

module.exports = function(sio, app, Models, Game){

	require('./routing/access')(sio, app, Models, Game);

	app.get('/', function(req, res){
		res.redirect("/index");
	});

	app.error(function(err, req, res, next){
		if(process.ENOENT == err.errno)
			res.send('404');
		else
			res.send('Error!');
	});

};
