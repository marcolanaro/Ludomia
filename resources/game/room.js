var config = require("./config")();
var array = require("../utils/array");
var transform = require("../utils/transform");
var User = require("./user");
var Coordinate = require("./coordinate");

Function.prototype.bind = function(THIS) {
	var __method = this, args=Array.prototype.slice.call(arguments, 1);
	return function() {
		return __method.apply(THIS, args);
	}
};

var Room = function(Game, id) {
	this.Game = Game;
	this.params = {
		map: {
			graph: [
				[[{"c":1,"team":0}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1},{"c":3}]],
				[[{"c":1}],[{"c":6,"team":0},{"md2":"pilaar"}],[{"c":6,"team":0}],[{"c":6,"team":0}],[{"c":6,"team":0},{"md2":"pilaar"}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1},{"c":3}],[{"c":1}]],
				[[{"c":1}],[{"c":6,"team":0}],[{"c":6,"team":0}],[{"c":6,"team":0}],[{"c":6,"team":0}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1},{"c":3}],[{"c":1}],[{"c":1}]],
				[[{"c":1}],[{"c":6,"team":0}],[{"c":6,"team":0}],[{"c":6,"team":0}],[{"c":6,"team":0}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1},{"c":3}],[{"c":1}],[{"c":1}],[{"c":1}]],
				[[{"c":1}],[{"c":6,"team":0},{"md2":"pilaar"}],[{"c":6,"team":0}],[{"c":6,"team":0}],[{"c":6,"team":0},{"md2":"pilaar"}],[{"c":1}],[{"c":1}],[{"c":1},{"c":3}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}]],
				[[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1},{"c":4}],[{"c":1},{"c":2}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}]],
				[[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1},{"c":2}],[{"c":1},{"c":4}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}]],
				[[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1},{"c":4}],[{"c":1},{"c":2}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}]],
				[[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1},{"c":3}],[{"c":1}],[{"c":1}],[{"c":6,"team":1},{"md2":"pilaar"}],[{"c":6,"team":1}],[{"c":6,"team":1}],[{"c":6,"team":1},{"md2":"pilaar"}],[{"c":1}]],
				[[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1},{"c":3}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":6,"team":1}],[{"c":6,"team":1}],[{"c":6,"team":1}],[{"c":6,"team":1}],[{"c":1}]],
				[[{"c":1}],[{"c":1}],[{"c":1},{"md2":"ton"}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":6,"team":1}],[{"c":6,"team":1}],[{"c":6,"team":1}],[{"c":6,"team":1}],[{"c":1}]],
				[[{"c":1}],[{"c":1},{"c":3}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":6,"team":1},{"md2":"pilaar"}],[{"c":6,"team":1}],[{"c":6,"team":1}],[{"c":6,"team":1},{"md2":"pilaar"}],[{"c":1}]],
				[[{"c":1},{"c":3}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1}],[{"c":1,"team":1}]]
			],
			initUsersCoord: [
				[{x:-4,y:-4,z:0},{x:-4,y:-3,z:0},{x:-3,y:-4,z:0},{x:-3,y:-3,z:0},{x:-2,y:-4,z:0}],  // team 0
				[{x:3,y:2,z:0},{x:3,y:3,z:0},{x:4,y:2,z:0},{x:4,y:3,z:0},{x:5,y:3,z:0}] // team 1
			],
			coordinates: [

			]
		},
		id: id,
		coordinator: 0,
		initialized: false,
		users: [],
		UserDBid: [],
		users_free_space: [],
		user_count: 0,
		teams: [
			[],
			[]
		],
		max_users_per_team: 5
	};
	for (var x=this.params.map.graph.length-1; x>=0; x-=1) {
		if (!this.params.map.coordinates[x]) this.params.map.coordinates[x] = new Array();
		for (var y=this.params.map.graph[x].length-1; y>=0; y-=1) {
			if (!this.params.map.coordinates[x][y]) this.params.map.coordinates[x][y] = new Array();
			for (var z=this.params.map.graph[x][y].length-1; z>=0; z-=1) {
				if (!this.params.map.coordinates[x][y][z]) this.params.map.coordinates[x][y][z] = new Array();
				this.params.map.coordinates[x][y][z] = new Coordinate(this.params.map.graph[x][y][z], this.getCentralCoord({x:x,y:y,z:z}));
			}
		}
	}
}

Room.prototype.searchAreaCoord = function(x, y, z, team, OriginalTeam, temp) {
	var c = {x: x, y: y, z: z};
	if (array.position(temp, c)==-1 && this.existCoord(c) && this.params.map.coordinates[x][y][z].isConquerable() && this.params.map.coordinates[x][y][z].getTeam()==OriginalTeam) {
		temp.push(c);
		var arr = [ this.getCentralCoord(c) ];
		array.join(arr, this.searchAreaCoord(x+1, y, z, team, OriginalTeam, temp));
		array.join(arr, this.searchAreaCoord(x-1, y, z, team, OriginalTeam, temp));
		array.join(arr, this.searchAreaCoord(x, y+1, z, team, OriginalTeam, temp));
		array.join(arr, this.searchAreaCoord(x, y-1, z, team, OriginalTeam, temp));
		return arr;
	} else return false;
}

Room.prototype.searchArea = function(coord, team) {
	coord = this.getLateralCoord(coord);
	var temp = [];
	return this.searchAreaCoord(coord.x, coord.y, coord.z, team, this.params.map.coordinates[coord.x][coord.y][coord.z].getTeam(), temp);
}

Room.prototype.getUserByDBid = function(UserDBid) {
	var id_array = this.params.UserDBid[UserDBid];
	return this.params.users[id_array];
}

Room.prototype.getUserByUserId = function(id) {
	return this.params.users[id];
}

Room.prototype.isInitialized = function() {
	return this.params.initialized;
}

Room.prototype.initialize = function() {
	this.params.initialized = true;
	return true;
}

Room.prototype.countUsers = function() {
	return this.params.user_count;
}

Room.prototype.maxUserSlot = function() {
	return this.params.max_users_per_team * this.params.teams.length;
}

Room.prototype.freeUserSlot = function() {
	return this.params.user_count < this.maxUserSlot();
}

Room.prototype.addUser = function(object) {
	if (this.freeUserSlot()) {
		if (typeof this.params.UserDBid[object.UserDBid] == "number") {
			return this.params.UserDBid[object.UserDBid];
		} else {
			var id = this.params.users.length;
			if (this.params.users_free_space.length>0)
				id = this.params.users_free_space.shift();
			this.params.UserDBid[object.UserDBid] = id;
			this.params.users[id] = new User(object, id);
			this.params.user_count += 1;
			return id;
		}
	} else return false;
}

Room.prototype.removeUser = function(id) {
	if (this.params.users[id] != false) {
		if (this.params.user_count == 1)
			setTimeout(this.isEmpty.bind(this), 1*1000);
		var TeamId = this.getUserByUserId(id).getTeam();
		if (TeamId)
			this.params.teams[TeamId] = array.without(this.params.teams[TeamId], id);
		this.params.UserDBid[this.params.users[id].getSession()] = undefined;
		this.params.users[id] = false;
		this.params.users_free_space.push(id);
		this.params.user_count -= 1;
		return true;
	} else return false;
}

Room.prototype.isEmpty = function() {
	if (this.params.user_count == 0)
		this.Game.removeRoom(this.params.id);
}

Room.prototype.getInfo = function() {
	var object = {id:this.params.id,users:[],initialized:this.params.initialized};
	for (var i = 0; i < this.params.users.length; i += 1) {
		var user = this.params.users[i];
		if (user != false)
			object.users.push({
				id:i,
				name: user.getName(),
				team: user.getTeam(),
				idModel: user.getIdModel(),
				velocity: user.getVelocity(),
				coord: user.getCoord(),
				path: user.getPath(),
				AcceptedInit: user.getAcceptedInit()
			});
		else
			object.users.push(false);
	}
	return object;
}

Room.prototype.setTeam = function(UserId, TeamId) {
	if (this.params.teams[TeamId].length < this.params.max_users_per_team) {
		var old_team = this.getUserByUserId(UserId).getTeam();
		if (typeof old_team == "number")
			this.params.teams[old_team] = array.without(this.params.teams[old_team], UserId);
		this.getUserByUserId(UserId).setTeam(TeamId);
		this.getUserByUserId(UserId).setCoord(this.params.map.initUsersCoord[TeamId][this.params.teams[TeamId].length]);
		this.params.teams[TeamId].push(UserId);
		return true;
	} else return false;
}

Room.prototype.getSocketName = function() {
	return "room_" + this.params.id;
}

Room.prototype.getGraph = function() {
	return this.params.map.graph;
}

Room.prototype.getCoordinates = function() {
	return this.params.map.coordinates;
}

Room.prototype.getLateralCoord = function(coord) {
	return transform.Central2Lateral(coord, this.params.map.coordinates.length, this.params.map.coordinates[0].length);
}

Room.prototype.getCentralCoord = function(coord) {
	return transform.Lateral2Central(coord, this.params.map.graph.length, this.params.map.graph[0].length);
}

Room.prototype.getCoordinate = function(coord) {
	coord = this.getLateralCoord(coord);
	return this.getCoordinates()[coord.x][coord.y][coord.z];
}

Room.prototype.destroy = function(coord) {
	coord = this.getLateralCoord(coord);
	this.params.map.graph[coord.x][coord.y][coord.z] = undefined;
	this.params.map.coordinates[coord.x][coord.y][coord.z] = undefined;
}

Room.prototype.isCoordConquerable = function(c, team) {
	c = this.getLateralCoord(c);
	if (!this.existCoord(c) || this.getCoordinates()[c.x][c.y][0].getTeam() == team)
		return false;
	if (this.getTeamCoord({x:c.x+1,y:c.y,z:c.z}) == team || this.getTeamCoord({x:c.x-1,y:c.y,z:c.z}) == team || this.getTeamCoord({x:c.x,y:c.y+1,z:c.z}) == team || this.getTeamCoord({x:c.x,y:c.y-1,z:c.z}) == team)
		return true;
	else return false;
}

Room.prototype.getTeamCoord = function(c) {
	if (this.existCoord(c))
		return this.getCoordinates()[c.x][c.y][c.z].getTeam();
}

Room.prototype.existCoord = function(c) {
	var graph = this.getCoordinates();
	if (graph[c.x] && graph[c.x][c.y] && graph[c.x][c.y][c.z])
		return true;
	else
		return false;
}

module.exports = Room;