var tile = require('../tile');

module.exports = function(gameHash, socket, session, room) {
	var user = room.getUserByDBid(session.user_id);
	var from = user.getCoord();
	var to = gameHash.coord;

	var path = tile.path(room, false, from, to);

	var obj = {
		id: user.getId(),
		from: from,
		path: path
	};


	if (path.length>0) {
		var team = user.getTeam();
		var objToUser = [];

		if (room.isCoordConquerable(to, team)) {
			obj.action = {type: "conquer", coord: to, animation: user.params.conquer.animation};

			var type = "conquer";
			var Action = require("../../actions/"+type);


			objToUser[0] = new Action({
				user: user,
				room: room,
				coord: to,
				socket: socket
			});
		}

		tile.setUser(user, path, objToUser);
		tile.sendMsg(socket, room, obj);
	}
}