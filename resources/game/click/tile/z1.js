var tile = require('../tile');

module.exports = function(gameHash, socket, session, room) {
	var user = room.getUserByDBid(session.user_id);
	var from = user.getCoord();

	var path = tile.path(room, true, from, {
		x: gameHash.coord.x,
		y: gameHash.coord.y,
		z: 0
	});

	var obj = {
		id: user.getId(),
		from: from
	};

	if (path.length>0 && path.pop()) {
		obj.path = path;
		var objToUser = [];
		if (room.getCoordinate(gameHash.coord).isDestroyable()) {
			obj.action = {type: "destroy", coord: gameHash.coord, animation: user.params.destroy.animation};

			var type = "destroy";
			var Action = require("../../actions/"+type);


			objToUser[0] = new Action({
				user: user,
				room: room,
				coord: gameHash.coord,
				socket: socket
			});
		}

		tile.setUser(user, path, objToUser);
		tile.sendMsg(socket, room, obj);
	}
}