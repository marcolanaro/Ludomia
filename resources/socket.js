var	parseCookie	= require('connect').utils.parseCookie;
var	Session		= require('connect').middleware.session.Session;

var setSession = function(session) {
	session.reload(function() {
		session.touch().save();
	});
}

module.exports = function(io, store, redis, Game){

	io.set('authorization', function (data, accept) {
		if (data.headers.cookie) {
			data.cookie = parseCookie(data.headers.cookie);
			data.sessionID = data.cookie['connect.sid'];
			data.sessionStore = store;
			store.get(data.sessionID, function (err, session) {
				if (err) {
					accept(err.message, false);
				} else {
					data.session = new Session(data, session);
					accept(null, true);
				}
			});
		} else {
			return accept('No cookie transmitted.', false);
		}
	});

	io.sockets.on('connection', function (socket) {
		var session = socket.handshake.session;
		var room = Game.getRoom(session.game_id);
		var user = room.getUserByDBid(session.user_id);

		if (session && session.logged && typeof session.game_id == "number" && user.getSocketConnected() == false) {
			user.setSocketConnected();

			require('./publisher')(socket, session, Game);

			socket.on('disconnect', function () {
				user.setSocketDisconnected();
				socket.broadcast.to(room.getSocketName()).emit("leftUser",{
					id: user.getId()
				});
				// sarebbe da ripetere a tempi crescenti e solo dopo un po' di tentativi cancellarlo
				setTimeout(function(){
					if (user.getSocketConnected() == false) {
						room.removeUser(user.getId());
					}
				}, 5*1000);
			});

		} else {
			// ACCESSO VIETATO
		}

	});

};
