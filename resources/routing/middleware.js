exports.loggedUser = function (req, res, next){
	if (req.session.logged == true)
		next();
	else
		res.redirect("/index");
}

exports.inAnotherGame = function (req, res, next){
	if (typeof req.session.game_id != "number")
		next();
	else
		res.redirect("/game");
}

exports.inGame = function (req, res, next){
	if (typeof req.session.game_id == "number")
		next();
	else
		res.redirect("/index");
}

exports.justLogged = function (req, res, next){
	if (!req.session.logged)
		next();
	else
		res.redirect("/index");
}
