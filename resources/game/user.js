var config = require("./config")();
var object = require("../utils/object");

Function.prototype.bind = function(THIS) {
	var __method = this, args=Array.prototype.slice.call(arguments, 1);
	return function() {
		return __method.apply(THIS, args);
	}
};

var Coord2Loc = function(coord,offset) {
	if (offset==undefined) offset = {x:0,y:0,z:0};
	return {
		x: 2*coord.x + (offset.x || 0),
		y: 2*coord.y + (offset.y || 0),
		z: 2*coord.z + (offset.z || 0)
	}
}

// obj = {UserDBid: user id nel database, name:nome nel gioco};
// id = id nella stanza (da 1 a 10 con 10 giocatori)
var User = function(obj, id) {
	this.params = {
		UserDBid: obj.UserDBid,
		UserId: id,
		name: obj.name,
		AcceptedInit: false,
		SocketConnected: false,
		AcceptedInit: false,
		team: false,
		path: [],
		timeout: null,
		action: []
	}
	object.extend(this.params, config.types.players[2]);
}

User.prototype.changeCharacter = function(id) {
	if (config.types.players[id])
		object.extend(this.params, config.types.players[id]);
}

User.prototype.getSession = function() {
	return this.params.UserDBid;
}

User.prototype.getId = function() {
	return this.params.UserId;
}

User.prototype.AcceptedInit = function() {
	this.params.AcceptedInit = true;
}

User.prototype.getAcceptedInit = function() {
	return this.params.AcceptedInit;
}

User.prototype.setSocketConnected = function() {
	this.params.SocketConnected = true;
	return true;
}

User.prototype.setSocketDisconnected = function() {
	this.params.SocketConnected = false;
	return true;
}

User.prototype.getSocketConnected = function() {
	return this.params.SocketConnected;
}

User.prototype.setTeam = function(id) {
	this.params.team = id;
	return id;
}

User.prototype.getTeam = function() {
	return this.params.team;
}

User.prototype.getName = function() {
	return this.params.name;
}

User.prototype.getCoord = function() {
	return this.params.coord;
}

User.prototype.setCoord = function(c) {
	this.params.coord = c;
}

User.prototype.setPath = function(p) {
	this.params.path = p;
	this.timeOut(this.refreshPath, {time:0.5 * this.timeNextCoord(), overtime:0});
}

User.prototype.getPath = function(p) {
	return this.params.path;
}

User.prototype.timeOut = function(callback, timer) {
	var t = {time:0, overtime:0};
	object.extend(t, timer);
	clearTimeout(this.params.timeout);
	this.params.timeout = setTimeout(callback.bind(this, t.time), (t.time + t.overtime) * 1000);
}

User.prototype.refreshPath = function(overtime) {
	if (this.params.path.length > 0) {
		this.setCoord(this.params.path.shift());
		if (this.params.path.length > 0)
			this.timeOut(this.refreshPath, {time: 0.5 * this.timeNextCoord(), overtime: overtime});
		else
			this.timeOut(this.refreshAction, {time: this.timeToAction() + overtime});
	} else 
			this.timeOut(this.refreshAction);
}

User.prototype.timeToAction = function() {
	var time = 0;
	if (this.getAction()) {
		time = this.getAction().time(this);
	}
	return time;
}

User.prototype.refreshAction = function() {
	if (this.getAction()) {
		this.getAction().do(this);
	}
}

User.prototype.timeNextCoord = function() {
	if (this.params.path[0]) {
		var from = Coord2Loc(this.params.coord);
		var to = Coord2Loc(this.params.path[0]);
		return Math.sqrt(Math.pow(to.x-from.x,2) + Math.pow(to.y-from.y,2) + Math.pow(to.z-from.z,2)) / this.getVelocity();
	} else return 0;
}

User.prototype.getVelocity = function() {
	return this.params.velocity;
}

User.prototype.getIdModel = function() {
	return this.params.idModel;
}

User.prototype.setAction = function(action) {
	this.params.action = action;
}

User.prototype.getAction = function(action) {
	return this.params.action[0];
}

User.prototype.getDestroy = function(action) {
	return this.params.destroy;
}

User.prototype.getConquer = function(action) {
	return this.params.conquer;
}

module.exports = User;