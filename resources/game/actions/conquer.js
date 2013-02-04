var util = require("util");
var Action = require("../action");

var Conquer = function(params) {
	this._params = params;
	this._params.type= "conquer";
}

util.inherits(Conquer, Action);


Conquer.prototype.conquerableSet = function(set) {
	return (this._params.room.getCoordinate(this._params.coord).isSet() && set.length > 1);
}

Conquer.prototype.time = function() {
	var set = this._params.room.searchArea(this._params.coord, this._params.user.getTeam());
	if (this.conquerableSet(set)) {
		return (set.length / this._params.user.getConquer().velocity);
	} else
		return (1 / this._params.user.getConquer().velocity);
}

Conquer.prototype.do = function() {
	var set = this._params.room.searchArea(this._params.coord, this._params.user.getTeam());
	if (!this.conquerableSet(set))
		set = [this._params.coord];
	var obj = {coords: set, user: this._params.user.getId(), team: this._params.user.getTeam()};
	for (var i = set.length - 1; i >= 0; i -=1)
		this._params.room.getCoordinate(set[i]).setTeam(this._params.user.getTeam());
	this.sendSocket(obj);
	this.destroy();
}

module.exports = Conquer;