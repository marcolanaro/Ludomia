var	OPTIONS		=	require('./options').get(),
	i18n		=	require('./i18n').get(),
	express		=	require('express'),
	ejs		=	require('ejs'),
	MemoryStore	=	express.session.MemoryStore,
	store		=	new MemoryStore();
	io		=	require('socket.io'),//.listen(OPTIONS.IO.PORT),
	mongoose	=	require('mongoose'),
	redis		=	require('redis'),
	app		=	express.createServer(
					express.static(__dirname + OPTIONS.STATIC.PATH),
					express.bodyParser(),
					express.methodOverride(),
					express.cookieParser(),
					express.session({
						store:store,
						secret:OPTIONS.SESSION.SECRET
					}),
					express.csrf()
				);

app.dynamicHelpers({
	token: function(req, res) {
		return req.session._csrf;
	},
	i18n: function(req, res) {
		return i18n;
	},
	lang: function(req, res) {
		return req.session.lang;
	}
});

app.set('views', __dirname + OPTIONS.RESOURCES.PATH + '/views');
app.set('view engine', 'ejs');
app.set('view options', {layout: false});

mongoose.connect('mongodb://localhost/test');

var sio=io.listen(app);
app.listen(OPTIONS.APP.PORT);

var Game = require('.' + OPTIONS.RESOURCES.PATH + '/game');
Game.init();

var Models = require('.' + OPTIONS.RESOURCES.PATH + '/models');
require('.' + OPTIONS.RESOURCES.PATH + '/routing')(sio,app,Models,Game);
require('.' + OPTIONS.RESOURCES.PATH + '/socket')(sio,store,redis,Game);
