var dijkstra = require('../../utils/dijkstra');

exports.click = function(gameHash, socket, session, room) {
	if (gameHash.coord.z>=0 && gameHash.coord.z<2)
		require('./tile/z'+gameHash.coord.z)(gameHash, socket, session, room);
}

exports.path = function(room, nearest, from, to) {
	return dijkstra.dijkstraGrid({
		nearest: nearest,
		diag: true,
		zeta: false,
		from: from,
		to: to,
		graph: room.getCoordinates()
	});
}

exports.sendMsg = function(socket, room, obj) {
	socket.broadcast.to(room.getSocketName()).emit("move", obj);
	socket.emit("move", obj);
}

exports.setUser = function(user, path, obj) {
	user.setPath(path);
	user.setAction(obj);
}