MG.Socket.on('init', function (data) {

	MG.init = new MG.Init(data);

});

MG.Init = (function(MG){

	MG.Socket.on('joinUser', function (data) {
		MG.info.room.users[data.id]=data;
		MG.init.insert(data);
	});
	MG.Socket.on('leftUser', function (data) {
		MG.init.remove(data.id);
		MG.info.room.users[data.id] = false;
	});
	MG.Socket.on('userJoinTeam', function(data) {
		MG.info.room.users[data.user_id].team = data.team_id;
		MG.init.remove(data.user_id);
		MG.init.insert(MG.info.room.users[data.user_id]);
	});
	MG.Socket.on('startGame', function(data) {
		location.reload(true);
	});
	MG.Socket.on('userAcceptedInit', function(data) {
		MG.info.room.users[data.user_id].AcceptedInit = true;
		if (data.user_id == MG.info.user.id)
			document.getElementById("btnAcceptInit").parentNode.removeChild(document.getElementById("btnAcceptInit"));
		document.getElementById("user_"+data.user_id).innerHTML+="Ok!";
		MG.init.checkIfStart();
	});

	var C = function(obj){
		MG.info = obj;
		MG.chat = new MG.UI.Chat();
		var u = obj.room.users;
		for (var i = u.length - 1; i >= 0; i -= 1)
			if (u[i] != false)
				this.insert(u[i]);
		this.checkIfStart();
	};

	C.prototype = {
		selectTeam: function(users) {
		},
		user: function(user){
			if (user.team === 0)
				var color = "99ff99";
			else {
				if (user.team === 1)
					var color = "9999ff";
				else
					var color = "ff9999";
			}
			var html = '<div id="user_'+user.id+'" class="front span6" style="background-color:#'+color+';border: thin solid #000;"><img src="./img/users/'+user.id+'.png">';
			if (MG.info.user.id == user.id)
				html += '<select onChange="MG.init.changeCharacter(this.value,'+user.id+');"><option value="0">Modello 0</option><option value="1">Modello 1</option><option value="2">Modello 2</option></select>';
			html += '<div style="float:right;">';
			if (MG.info.room.users[user.id].AcceptedInit!=true && user.team !== 0 && (MG.info.user.id == 0 || MG.info.user.id == user.id))
				html += '<a class="btn btn-small" href="javascript:MG.init.moveInTeam(0,'+user.id+');"><i class="icon-chevron-left"></i></a>';
			html += ' ';
			if (MG.info.room.users[user.id].AcceptedInit!=true && user.team !== 1 && (MG.info.user.id == 0 || MG.info.user.id == user.id))
				html +='<a class="btn btn-small" href="javascript:MG.init.moveInTeam(1,'+user.id+');"><i class="icon-chevron-right"></i></a>';
			html += '<br>'+user.name+'</div>';
			if (MG.info.room.users[user.id].AcceptedInit==true)
				html+="Ok!";
			html += '</div>';
			return html;
		},
		insert: function(user){
			if (typeof user.team == "number") {
				var el = "team"+user.team;
				if (MG.info.room.users[MG.info.user.id].AcceptedInit == true) {
					var e = document.getElementById("btnAcceptInit");
					if (e) e.parentNode.removeChild(e);
				} else if (MG.info.user.id == user.id)
					document.getElementById("btnAcceptInit").className="btn btn-large btn-success";
			} else
				var el = "users";
			document.getElementById(el).innerHTML += this.user(user);
		},
		remove: function(id){
			var elem = document.getElementById("user_"+id);
			elem.parentNode.removeChild(elem);
		},
		changeCharacter: function(character, id) {
			if (MG.info.user.id == id)
				MG.Socket.emit("userChangeCharacter",{ user_id: id, character_id: character });
		},
		moveInTeam: function(team, id){
			if (MG.info.user.id == 0 || MG.info.user.id == id)
				MG.Socket.emit("userJoinTeam",{ user_id: id, team_id: team });
		},
		start: function() {
			if (MG.info.user.id == 0)
				MG.Socket.emit("startGame");
		},
		checkIfStart: function() {
			if (MG.info.user.id == 0) {
				var check = true;
				var u = MG.info.room.users;
				for (var i=0; i<u.length; i+=1) {
					if (u[i].AcceptedInit!=true)
						check = false;
				}
				if (check==true)
					document.getElementById("controls").innerHTML = '<input type="button" class="btn btn-primary btn-large" value="Start" onClick="MG.init.start();">' + document.getElementById("controls").innerHTML;
			}
		},
		acceptedInit: function() {
			MG.Socket.emit("userAcceptedInit");
		}
	};

	return C;

}(MG));
