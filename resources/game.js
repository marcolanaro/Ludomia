var	array	= require("./utils/array"),
	Room = require("./game/room");

exports.init = function() {
	this.game = {
		rooms:[],
		rooms_ref_NO_using:[],
		rooms_ref_IN_using:[],
		rooms_ref_IN_using_NO_initialized:[]
	};
}

exports.createRoom = function() {
	var id = this.game.rooms.length;
	if (this.game.rooms_ref_NO_using.length > 0)
		id = this.game.rooms_ref_NO_using.shift();
	this.game.rooms[id] = new Room(this, id);
	this.game.rooms_ref_IN_using.push(id);
	this.game.rooms_ref_IN_using_NO_initialized.push(id);
	//console.log(this.game.rooms);
	return id; 
}

exports.removeRoom = function(id) {
	if (this.game.rooms[id] != false) {
		var isInit = this.game.rooms[id].isInitialized();
		this.game.rooms[id] = false;
		this.game.rooms_ref_NO_using.push(id);
		if (isInit)
			var ar = this.game.rooms_ref_IN_using;
		else
			var ar = this.game.rooms_ref_IN_using_NO_initialized;
		var ar1 = [];
		for (var i = 0; i < ar.length; i += 1)
			if (ar[i] != id)
				ar1.push(ar[i])
		if (isInit)
			this.game.rooms_ref_IN_using = ar1;
		else
			this.game.rooms_ref_IN_using_NO_initialized = ar1;
		return true;
	} else return false;
}

exports.getUninitializedRooms = function() {
	return this.game.rooms_ref_IN_using_NO_initialized;
}

exports.getRooms = function() {
	return this.game.rooms_ref_IN_using;
}

exports.getRoom = function(id) {
	return this.game.rooms[id];
}

exports.initializeRoom = function(id) {
	var ar = [];
	for (var i = 0; i < this.game.rooms_ref_IN_using_NO_initialized.length; i += 1) 
		if (this.game.rooms_ref_IN_using_NO_initialized[i] != id)
			ar.push(this.game.rooms_ref_IN_using_NO_initialized[i]);
	this.game.rooms_ref_IN_using_NO_initialized = ar;
	this.game.rooms[id].initialize();
}
