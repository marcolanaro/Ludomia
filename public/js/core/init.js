MG.Core.Init = (function(MG){

	MG.Socket.on('joinUser', function (data) {
		MG.info.room.users[data.id]=data;
		MG.select_team.insert(data);
	});
	MG.Socket.on('leftUser', function (data) {alert('s');
		MG.select_team.remove(data.id);
		MG.info.room.users[data.id] = false;
	});

	var C = function(obj){
		MG.info = obj;
		MG.select_team = new MG.UI.Select_Team(obj.room.users);
		MG.chat = new MG.UI.Chat();
	};

	C.prototype = {

	};

	return C;

}(MG));
