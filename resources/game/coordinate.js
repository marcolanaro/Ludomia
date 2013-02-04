var config = require("./config")();
var object = require("../utils/object");

var Coordinate = function(obj, coord) {
	// copia dell'oggetto: quando modifico un parametro, viene modificato anche nell'oggetto di riferimento
	this._params = obj;
	this._params.coord = coord;

	var id = obj.c;
	//if (config.types.tiles[id]) {
		object.extend(this._params, config.types.tiles[id]);
	//}
}

Coordinate.prototype.getId = function() {
	return this._params.c;
}

Coordinate.prototype.isCube = function() {
	return (typeof this._params.c == "number");
}

Coordinate.prototype.isSet = function() {
	return this._params.set;
}

Coordinate.prototype.setSet = function(set) {
	this._params.idSet = set;
}

Coordinate.prototype.getSet = function() {
	return this._params.idSet;
}

Coordinate.prototype.isConquerable = function() {
	if (this.isCube())
		return (typeof config.types.tiles[this._params.c].conquerable == "object");
	else return false;
}

Coordinate.prototype.isDestroyable = function() {
	if (this.isCube())
		return (typeof config.types.tiles[this._params.c].destroyable == "object");
	else return false;
}

Coordinate.prototype.getTeam = function() {
	if (this._params.team >= 0)
		return this._params.team;
	else
		return undefined;
}

Coordinate.prototype.setTeam = function(team) {
	this._params.team = team;
	return team;
}

Coordinate.prototype.getPower = function() {
	if (this.isDestroyable())
		return this._params.destroyable.power;
	else return undefined;
}

Coordinate.prototype.removePower = function(power) {
	if (this.isDestroyable())
		this._params.destroyable.power -= power;
	return this.getPower();
}

Coordinate.prototype.getTime2Conquerable = function() {
	if (this.isConquerable())
		return this._params.conquerable.time;
	else return undefined;
}

Coordinate.prototype.removeTime2Conquerable = function(time) {
	if (this.isConquerable())
		this._params.conquerable.time -= time;
	return this.getTime2Conquerable();
}

Coordinate.prototype.resetTime2Conquerable = function() {
	if (this.isConquerable())
		this._params.conquerable.time = config.types.tiles[this._params.c].conquerable.time;
	return this.getTime2Conquerable();
}

module.exports = Coordinate;