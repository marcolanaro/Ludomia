var Action = function() {}

Action.prototype.destroy = function() {
	this._params.user.setAction([]);

}

Action.prototype.sendSocket = function(obj) {
	this._params.socket.broadcast.to(this._params.room.getSocketName()).emit(this._params.type, obj);

	this._params.socket.emit(this._params.type, obj);


}

module.exports = Action;