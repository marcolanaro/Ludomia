var emitStartGame = function(init, socket, session, Game) {
	var room = Game.getRoom(session.game_id);
	var UserId = room.getUserByDBid(session.user_id).getId();

	var object = {
		user: {},
		room: room.getInfo()
	};
	if (init == true)
		if (room.isInitialized() == true)
			object.user = {id:UserId,life:120,mana:100,mana_vel:2};
		else
			object.user = {id:UserId};
	else
		object.user = {life:120,mana:100,mana_vel:2};
	if (room.isInitialized() == true) {
		object.room.coord = room.getGraph();
		object.skills = [
			{"id":1,"name":"Prova","time":3,"cost":30},{"id":3,"name":"Bla bla!","time":1,"cost":50},{"id":4,"name":"Skillaccia","time":0.5,"cost":10},{"id":6,"name":"Ha ha ha...","time":4,"cost":20},{"id":7,"name":"Skill di Prova","time":2,"cost":10}
		];
	}
	return object;
}

module.exports = function(socket, session, Game) {
	var room = Game.getRoom(session.game_id);
	var user = room.getUserByDBid(session.user_id);

	// On Connect
	socket.join(room.getSocketName());

	socket.broadcast.to(room.getSocketName()).emit("joinUser",{
		id: user.getId(),
		name:session.user_name,
		team: user.getTeam(),
		AcceptedInit: user.getAcceptedInit()
	});

	socket.emit("init", emitStartGame(true, socket, session, Game));

	// On Others
	socket.on("chat", function (data) {
		socket.broadcast.to(room.getSocketName()).emit("chat", {
			userName: session.user_name,
			message: data.message
		});
	});

	socket.on("userJoinTeam", function (data) {
		if (!room.isInitialized() && room.getUserByUserId(data.user_id).getAcceptedInit() != true && (user.getId() == 0 || user.getId() == data.user_id)) {
			if (room.setTeam(data.user_id, data.team_id) == true) {
				var obj = {
					user_id: data.user_id,
					team_id: data.team_id
				};
				socket.emit("userJoinTeam", obj);
				socket.broadcast.to(room.getSocketName()).emit("userJoinTeam", obj);
			}
		}
	});

	socket.on("userChangeCharacter", function (data) {
		if (!room.isInitialized() && room.getUserByUserId(data.user_id).getAcceptedInit() != true && user.getId() == data.user_id) {
			room.getUserByUserId(data.user_id).changeCharacter(data.character_id);
		}
	});

	socket.on("userAcceptedInit", function (data) {
		if (!room.isInitialized() && user.getTeam() !== false) {
			user.AcceptedInit(); 
			var obj = {user_id: user.getId()};
			socket.broadcast.to(room.getSocketName()).emit("userAcceptedInit", obj);
			socket.emit("userAcceptedInit", obj);
		}
	});

	socket.on("startGame", function (data) {
		if (user.getId() == 0) {
			if (!room.isInitialized()) {
				Game.initializeRoom(session.game_id);
				var obj = emitStartGame(false, socket, session, Game);
				socket.broadcast.to(room.getSocketName()).emit("startGame", obj);
				socket.emit("startGame", obj);
			}
		}
	});

	socket.on("click", function (gameHash) {
		var library = (function(obj) {
			switch (obj) {
				case "tile": return "tile";
			}
			return false;
		})(gameHash.obj);

		if (library != false) {
			require('./game/click/'+library).click(gameHash, socket, session, room);
		}
	});


}
