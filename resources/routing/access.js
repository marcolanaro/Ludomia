var Middleware = require('./middleware');
var	languages = require('../../options').get().languages;

module.exports = function(io, app, Models, Game){

	function logging(req, res){
		var condition = {name:req.body.user, pass:req.body.password};
		Models.User.find(condition, function (err, docs) {
			if (docs.length==0) {
				req.flash('info', 'Nome utente o password errati.');
				res.render("index",{partial:"home",locals:{flash:req.flash()}});
			} else {
				Models.User.update({_id:docs[0]._id}, {date_lastLogin: Date.now}, {}, function(err){
					//console.log(err);
				});
				req.session.logged = true;
				req.session.user_id = docs[0]._id;
				req.session.user_name = docs[0].name;
				res.redirect("/index");
			}
		});
	}

	app.get('/lang/:lang', function(req, res){
		if (languages[req.params.lang])
			req.session.lang = req.params.lang;
		res.redirect("/index");
	});
	
	app.get('/index', Middleware.inAnotherGame, function(req, res){
		if (!req.session.lang)
			req.session.lang = 0;
		if (req.session.logged == true) {
			res.render("index",{
				part:"rooms",
				locals:{
					user:{name:req.session.user_name},
					rooms:Game.getUninitializedRooms()
				}
			});
		 } else
			res.render("index",{part:"home"});
	});

	app.post('/login', Middleware.justLogged, function(req, res){
		if (!req.body.user || !req.body.password) {
			req.flash('info', 'Inserire User e Password');
		} else {
			logging(req, res);
		}
	});
	// DA RIVEDERE FLASH A QUAN'ALTRO
	app.post('/register', Middleware.justLogged, function(req, res){
		if (!req.body.user || !req.body.password) {
			req.flash('info', 'Inserire User e Password');
			res.render("register",{locals:{flash:req.flash()}});
		} else {
			Models.User.find({name:req.body.user}, function (err, docs) {
				if (docs.length>0) {
					req.flash('info', 'Nome utente già esistente');
					res.render("register",{locals:{flash:req.flash()}});
				} else {
					var u = new Models.User({name: req.body.user, pass: req.body.password});
					u.save(function(err){
						if (err==null)
							logging(req, res);
						else {
							for (var o in err.errors) {
								req.flash(err.errors[o].path, err.errors[o].type);
							}
							res.render("register",{locals:{flash:req.flash()}});
						}
					});
				}
			});
		}
	});

	app.post('/logout', Middleware.loggedUser, function(req, res){
		req.session.logged = false;
		req.session.user_id = false;
		req.session.user_name = false;
		req.session.game_id = false;
		res.redirect("/index");
	});

	// DA TOGLIERE
	app.get('/logout', Middleware.loggedUser, function(req, res){
		req.session.logged = false;
		req.session.user_id = false;
		req.session.user_name = false;
		req.session.game_id = false;
		res.redirect("/index");
	});

	app.get('/game', Middleware.loggedUser, Middleware.inGame, function(req, res){
		var init = Game.getRoom(req.session.game_id).isInitialized();
		res.render("game/init_"+init,{
			locals:{
				object:{
					user_id: Game.getRoom(req.session.game_id).getUserByDBid(req.session.user_id).getId(),
					room: Game.getRoom(req.session.game_id).getInfo()
				},
				host: req.headers.host
			}
		});
	});

	app.get('/game/exit', Middleware.loggedUser, Middleware.inGame, function(req, res){
		req.session.game_id = false;
		res.redirect("/index");
	});

	function accessRoom(req, res, id) {
		id = parseInt(id);
		if (!Game.getRoom(id).isInitialized() && Game.getRoom(id).freeUserSlot()) {
			var UserId = Game.getRoom(id).addUser({
				UserDBid: req.session.user_id,
				name: req.session.user_name
			});
			if (typeof UserId == "number") {
				req.session.game_id = id;
				res.redirect("/game");
			} else res.redirect("/index");
		} else res.redirect("/index");
	}
	// da trasformare in POST
	app.get('/game/create', Middleware.loggedUser, Middleware.inAnotherGame, function(req, res){
		var id = Game.createRoom();
		accessRoom(req, res, id);
	});
	// da trasformare in POST
	app.get('/game/:id', Middleware.loggedUser, Middleware.inAnotherGame, function(req, res){
		accessRoom(req, res, req.params.id);
	});
 }
