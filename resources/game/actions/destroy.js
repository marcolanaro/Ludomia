var util = require("util");
var Action = require("../action");

var Destroy = function(params) {
	this._params = params;
	this._params.type= "destroy";
}

util.inherits(Destroy, Action);

Destroy.prototype.time = function() {
	return (1 / this._params.user.getDestroy().velocity);
}

Destroy.prototype.do = function() {
	if (!this._params.room.getCoordinate(this._params.coord)) {
		this.sendObj();
		return false;
	}
	if (this._params.room.getCoordinate(this._params.coord).removePower(this._params.user.getDestroy().power) > 0) {

		this._params.user.timeOut(this._params.user.refreshAction, {time: this._params.user.timeToAction()});
	} else {

		this._params.room.destroy(this._params.coord);

		this.sendObj();
	}
}

Destroy.prototype.sendObj = function() {
	var obj = {coord: this._params.coord, user: this._params.user.getId()};
	this.sendSocket(obj);
	this.destroy();
}

module.exports = Destroy;